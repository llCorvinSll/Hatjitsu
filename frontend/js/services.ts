import {IAngularStatic} from "angular";
import { io } from "socket.io-client";
import * as Cookies from "js-cookie";

declare var angular:IAngularStatic;

export const pokerAppServices = angular.module('pokerApp.services', []);

pokerAppServices.value('version', '0.1');

pokerAppServices.factory('socket', ['$rootScope', function ($rootScope) {
  const socket = io({
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    transports: ['websocket']
  });

  $rootScope.socketMessage = null;
  $rootScope.activity = false;
  $rootScope.sessionId = null;

  socket.on('error', function (reason) {
    // console.log('service: on error', reason);
    $rootScope.$apply(function () {
      $rootScope.socketMessage = ":-(  Error = " + reason;
    });
  });

  socket.on('connect_failed', function (reason) {
    // console.log('service: on connect failed', reason);
    $rootScope.$apply(function () {
      $rootScope.socketMessage = ":-(  Connect failed";
    });
  });

  socket.on('disconnect', function () {
    // console.log('service: on disconnect');
    $rootScope.$apply(function () {
      $rootScope.socketMessage = ":-(  Disconnected";
    });
  });

  socket.on('connecting', function () {
    // console.log('service: on connecting');
    $rootScope.$apply(function () {
      $rootScope.socketMessage = "Connecting...";
    });
  });

  socket.on('reconnecting', function () {
    // console.log('service: on reconnecting');
    $rootScope.$apply(function () {
      $rootScope.socketMessage = "Reconnecting...";
    });
  });

  socket.on('reconnect', function () {
    // console.log('service: on reconnect');
    $rootScope.$apply(function () {
      $rootScope.socketMessage = null;
    });
  });

  socket.on('reconnect_failed', function () {
    // console.log('service: on reconnect_failed');
    $rootScope.$apply(function () {
      $rootScope.socketMessage = ":-( Reconnect failed";
    });
  });

  socket.on('connect', function () {
    var sessionId = socket.id;
    // console.log('service: on connect');
    $rootScope.$apply(function () {
      $rootScope.socketMessage = null;
      // console.log("new session id = " + sessionId);
      if (!Cookies.get("sessionId")) {
        Cookies.set("sessionId", sessionId);
      }
      $rootScope.sessionId = Cookies.get("sessionId");
      // console.log("session id = " + that.rootScope.sessionId);
    });
  });

  return {
    on: function (eventName, callback) {
      $rootScope.socketMessage = null;
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      $rootScope.activity = true;
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          $rootScope.activity = false;
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
