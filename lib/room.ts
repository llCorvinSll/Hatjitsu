import * as _ from "underscore";
import * as socketio from "socket.io";


interface IConnectionDescription {
  sessionId: string;
  socketId: string | null;
  vote: string | null;
  voter: boolean;
}


export class Room {
  constructor(io: socketio.Server, roomUrl: string) {
    this.io = io;
    this.roomUrl = roomUrl;
  }

  private io: socketio.Server;
  private readonly roomUrl: string;
  private createdAt = calcTime(2);
  private createAdmin = true;
  private hasAdmin = false;
  private cardPack = 'goat';
  private connections: {[key: string]: IConnectionDescription}= {}; // we collect the votes in here
  private forcedReveal = false;
  private alreadySorted = false;

  info() {
    this.createAdmin = this.hasAdmin === false;
    this.hasAdmin = true;
    // console.log("room info = ", this.json());
    return this.json();
  };

  enter(socket: socketio.Socket, data) {
    // console.log("room entered as " + socket.id);
    if (this.connections[data.sessionId]) {
      this.connections[data.sessionId].socketId = socket.id;
    } else {
      this.connections[data.sessionId] = { sessionId: data.sessionId, socketId: socket.id, vote: null, voter: true };
    }
  }

  leave(socket: socketio.Socket) {
    const connection = _.find(this.connections, function(c) { return c.socketId === socket.id } );
    if (connection && connection.sessionId) {
      connection.socketId = null;
    }
  }

  setCardPack(data) {
    this.cardPack = data.cardPack;
    this.io.sockets.in(this.roomUrl).emit('card pack set');
    // console.log('card pack set');
  }

  toggleVoter(data) {
    if (this.connections[data.sessionId]) {
      this.connections[data.sessionId]['voter'] = data.voter;
      if (!data.voter) {
        this.connections[data.sessionId].vote = null;
      }
      // console.log("voter set to " + data.voter + " for " + data.sessionId);
    }
    this.io.sockets.in(this.roomUrl).emit('voter status changed');
  }

  recordVote(socket: socketio.Socket, data) {
    if (this.connections[data.sessionId]) {
      this.connections[data.sessionId]['vote'] = data.vote;
    }
    socket.broadcast.to(this.roomUrl).emit('voted');
    // this.io.sockets.in(this.roomUrl).emit('voted');
  }

  destroyVote(socket: socketio.Socket, data) {
    if (this.connections[data.sessionId]) {
      this.connections[data.sessionId]['vote'] = null;
    }
    socket.broadcast.to(this.roomUrl).emit('unvoted');
    // this.io.sockets.in(this.roomUrl).emit('unvoted');
  }

  resetVote() {
    _.forEach(this.connections, function(c) {
      c.vote = null;
    })
    this.forcedReveal = false;
    this.alreadySorted = false;
    this.io.sockets.in(this.roomUrl).emit('vote reset');
  }

  forceReveal() {
    this.forcedReveal = true;
    this.alreadySorted = false;
    this.io.sockets.in(this.roomUrl).emit('reveal');
  }

  sortVotes() {
    this.alreadySorted = true;
    this.io.sockets.in(this.roomUrl).emit('reveal');
  }

  getClientCount() {
    return _.map(this.connections, (c) => { return c.socketId }).length;
  }

  json() {
    return {
      roomUrl: this.roomUrl,
      createdAt: this.createdAt,
      createAdmin: this.createAdmin,
      hasAdmin: this.hasAdmin,
      cardPack: this.cardPack,
      forcedReveal: this.forcedReveal,
      alreadySorted: this.alreadySorted,
      connections: _.map(this.connections, (c) => { return c.socketId })
    };
  }
}

function calcTime(offset: number) {
  // create Date object for current location
  const d = new Date();

  // convert to msec
  // add local time zone offset
  // get UTC time in msec
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  // create new Date object for different place
  // using supplied offset
  const nd = new Date(utc + (3600000 * offset));

  // return time as a string
  return nd.toLocaleString();
}
