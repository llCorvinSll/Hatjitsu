import * as _ from "underscore";
import {Room} from "./room";
import * as socketio from "socket.io";
import {ServerEvents} from "../../shared/protocol";


export class Lobby {
  constructor(io: socketio.Server) {
    this.io = io;
  }

  private readonly io: socketio.Server;
  rooms: {[key: string]: Room} = {};


  createRoom(roomUrl?: string): Room {
    roomUrl = roomUrl === undefined ? this.createUniqueURL() : roomUrl + this.createUniqueURL();
    if (this.rooms[roomUrl]) {
      this.createRoom(roomUrl);
    }

    // remove any existing empty rooms first
    const thatRooms = this.rooms;
    _.each(this.rooms, function(room, key, rooms) {
      if (room.getClientCount() == 0) {
        delete thatRooms[key];
        // console.log("removed room " + key);
      }
    });

    this.rooms[roomUrl] = new Room(this.io, roomUrl);
    return this.rooms[roomUrl];
  };

  createUniqueURL() {
    let text = "";
    const possible = "0123456789";

    for (let i = 0; i < 5; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  joinRoom(socket: socketio.Socket, data): Room | {error: string} {
    if(data.roomUrl && data.roomUrl in this.rooms) {
      const room = this.getRoom(data.roomUrl);
      if (socket != null && data && data.sessionId != null) {
        if (room instanceof Room) {
          room.enter(socket, data);
          socket.join(data.roomUrl);
          socket.broadcast.to(data.roomUrl).emit(ServerEvents.ROOM_JOINED, room.json());
        }
      }
      return room;
    } else {
      return { error: 'Sorry, this room no longer exists ...'};
    }
  };

  getRoom(roomUrl: string) {
    const room = this.rooms[roomUrl];
    if (room) {
      return room;
    } else {
      return { error: 'Sorry, this room no longer exists ...'};
    }
  };

  broadcastDisconnect(socket: socketio.Socket) {
    // var clientRooms = this.io.sockets.manager.roomClients[socket.id]
    //     , socketRoom, room
    // ;
    // // console.log("broadcast Disconnect");
    // for (socketRoom in clientRooms) {
    //   if (socketRoom.length) {
    //     const roomUrl = socketRoom.substr(1);
    //     let room = this.getRoom(roomUrl);
    //     if (room) {
    //       if (room instanceof Room) {
    //         room.leave(socket);
    //       }
    //     }
    //     this.io.sockets.in(roomUrl).emit('room left');
    //   }
    // }
  };

}
