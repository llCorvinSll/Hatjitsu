import _ from "underscore";
import express from "express";
import path from 'path';
import http from 'http';
import * as socketio from "socket.io";
import {Lobby} from "./lib/lobby";
import {Room} from "./lib/room";
import {Commands} from "../shared/protocol";

// const env = process.env.NODE_ENV || 'development';
const env = 'development';

const gzippo = require('gzippo');
const config = require('../config.js')[env];

const app = module.exports = express();

const server = http.createServer(app);
let io: socketio.Server = require("socket.io")();

io.listen(server)

const lobby = new Lobby(io);

let statsConnectionCount = 0;
let statsDisconnectCount = 0;
let statsSocketCount = 0;
let statsSocketMessagesReceived = 0;

// Configuration

// Set the CDN options
const options = {
    publicDir  : path.join(__dirname, 'app')
  , viewsDir   : path.join(__dirname, 'app')
  , domain     : 'dkb4nwmyziz71.cloudfront.net'
  , bucket     : 'hatchetapp'
  , key        : 'AKIAIS3XCFXFKWXGKK7Q'
  , secret     : '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'
  , hostname   : config.hostname
  , port       : config.port
  , ssl        : false
  , production : config.packAssets
};

// Initialize the CDN magic
var CDN = require('express-cdn')(app, options);


app.set('views', __dirname + '/../frontend');
app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});
// frontend.use(express.logger());
// frontend.use(express.bodyParser());
// frontend.use(express.methodOverride());
// frontend.use(express.staticCache());


app.use(express.static(__dirname + '/../frontend'));


if (env == "development") {
  // frontend.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

}

if (env == "production") {
  var oneDay = 86400000;
  // frontend.use(assetsManagerMiddleware);
  app.use(gzippo.staticGzip(__dirname + '/frontend'));
  // frontend.use(express.errorHandler());
}

app.locals.CDN = CDN
// Add the dynamic view helper
// frontend.dynamicHelpers({ CDN: CDN });

app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/debug_state', function(req, res) {
  res.json({
    "stats": {
      "connectionCount": statsConnectionCount,
      "disconnectCount": statsDisconnectCount,
      "currentSocketCount": statsSocketCount,
      "socketMessagesReceived": statsSocketMessagesReceived
    },
    "rooms": _.map(lobby.rooms, function(room, key) { return room.json() } )
  });
});

app.get('/:id', function(req, res) {
  if (req.params.id in lobby.rooms) {
    res.render('index.ejs');
  } else {
   res.redirect('/');
  }
});


// io.configure(function () {
//   io.set('transports', ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
// });
//
// io.configure('production', function(){
//   io.enable('browser client minification');
//   io.enable('browser client etag');
//   io.enable('browser client gzip');
//   io.set("polling duration", 10);
//   io.set('log level', 1);
// });
// io.configure('development', function(){
//   io.set('log level', 2);
// });

/* EVENT LISTENERS */


io.on('connection', function (socket) {
  statsConnectionCount++;
  statsSocketCount++;

  socket.on('disconnect', function () {
    statsDisconnectCount++;
    statsSocketCount--;
    // console.log("On disconnect", socket.id);
    lobby.broadcastDisconnect(socket);
  });

  socket.on(Commands.CREATE_ROOM, function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("on create room", socket.id, data);
    let room = lobby.createRoom();
    callback(room.json());
  });

  socket.on(Commands.JOIN_ROOM, function (data, callback) {
    statsSocketMessagesReceived++;
    console.log("on join room " + data.roomUrl, socket.id, data);
    const room = lobby.joinRoom(socket, data);
    if(!(room instanceof Room) && room.error) {
      callback( { error: room.error } );
    } else {
      if (room instanceof Room) {
        callback(room.info());
      }
    }
  });

  socket.on('room info', function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("on room info for " + data.roomUrl, socket.id, data);
    const room = lobby.getRoom(data.roomUrl);
    // room = { error: "there was an error" };
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error } );
    } else {
      if (room instanceof Room) {
        callback(room.info());
      }
    }
  });

  socket.on(Commands.SET_CARD_PACK, function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("on set card pack " + data.cardPack + " for " + data.roomUrl, socket.id, data);
    const room = lobby.getRoom(data.roomUrl);
    // console.log("error=" + room.error);
    if (room instanceof Room) {
      room.setCardPack(data);
      callback(room.json())
    }
  });

  socket.on('vote', function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("on vote " + data.vote + " received for " + data.roomUrl, socket.id, data);
    const room = lobby.getRoom(data.roomUrl);
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error });
    } else {
      if (room instanceof Room) {
        room.recordVote(socket, data);
      }
      callback( {} );
    }
  });

  socket.on(Commands.UNVOTE, function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("omn unvote received for " + data.roomUrl, socket.id, data);
    const room = lobby.getRoom(data.roomUrl);
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error });
    } else {
      if (room instanceof Room) {
        room.destroyVote(socket, data);
      }
      callback( {} );
    }
  });

  socket.on(Commands.RESET_VOTE, function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("on reset vote  received for " + data.roomUrl, socket.id, data);
    const room = lobby.getRoom(data.roomUrl);
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error });
    } else {
      if (room instanceof Room) {
        room.resetVote();
      }
      callback( {} );
    }
  });

  socket.on(Commands.FORCE_REVEAL, function (data, callback) {
    statsSocketMessagesReceived++;
    const room = lobby.getRoom(data.roomUrl);
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error });
    } else {
      if (room instanceof Room) {
        room.forceReveal();
      }
      callback( {} );
    }
  });

  socket.on(Commands.SORT_VOTES, function (data, callback) {
    statsSocketMessagesReceived++;
    const room = lobby.getRoom(data.roomUrl);
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error });
    } else {
      if (room instanceof Room) {
        room.sortVotes();
      }
      callback( {} );
    }
  });

  socket.on(Commands.TOGGLE_VOTER, function (data, callback) {
    statsSocketMessagesReceived++;
    // console.log("on toggle voter for " + data.roomUrl, socket.id, data);
    const room = lobby.getRoom(data.roomUrl);
    if (!(room instanceof Room) && room.error) {
      callback( { error: room.error });
    } else {
      if (room instanceof Room) {
        room.toggleVoter(data);
      }
      callback( {} );
    }
  });
});

const port = process.env.app_port || 5000; // Use the port that Heroku provides or default to 5000
server.listen(port)
