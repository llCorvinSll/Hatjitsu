import {io, Socket} from "socket.io-client";
import {ClientEmitMap, Commands, EventsMap} from "@shared/protocol";
import * as Cookies from "js-cookie";


export class Api {
    constructor() {
        this.socket = io({
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 10,
            transports: ['websocket']
        });

        // this.socket.on('error', function (reason) {
        //     // console.log('service: on error', reason);
        //     $rootScope.$apply(function () {
        //         $rootScope.socketMessage = ":-(  Error = " + reason;
        //     });
        // });

        // this.socket.on('connect_failed', function (reason) {
        //     // console.log('service: on connect failed', reason);
        //     $rootScope.$apply(function () {
        //         $rootScope.socketMessage = ":-(  Connect failed";
        //     });
        // });

        this.socket.on('disconnect', function () {
            console.log('service: on disconnect');
            // $rootScope.$apply(function () {
            //     $rootScope.socketMessage = ":-(  Disconnected";
            // });
        });

        // this.socket.on('connecting', function () {
        //      console.log('service: on connecting');
        //     $rootScope.$apply(function () {
        //         $rootScope.socketMessage = "Connecting...";
        //     });
        // });

        // this.socket.on('reconnecting', function () {
        //     // console.log('service: on reconnecting');
        //     $rootScope.$apply(function () {
        //         $rootScope.socketMessage = "Reconnecting...";
        //     });
        // });

        // this.socket.on('reconnect', function () {
        //     // console.log('service: on reconnect');
        //     $rootScope.$apply(function () {
        //         $rootScope.socketMessage = null;
        //     });
        // });

        // this.socket.on('reconnect_failed', function () {
        //     // console.log('service: on reconnect_failed');
        //     $rootScope.$apply(function () {
        //         $rootScope.socketMessage = ":-( Reconnect failed";
        //     });
        // });

        this.socket.on('connect', () => {
            const sessionId = this.socket.id;
            console.log('service: on connect');

            // $rootScope.socketMessage = null;
            // console.log("new session id = " + sessionId);
            if (!Cookies.get("sessionId")) {
                Cookies.set("sessionId", sessionId);
            }
            this.sessionId = Cookies.get("sessionId");
            // console.log("session id = " + that.rootScope.sessionId);
        });
    }

    createRoom(): Promise<string> {
        return new Promise<string>((ok, fail) => {
            this.socket.emit(Commands.CREATE_ROOM, null, (url: string) => {
                ok(url)
            })
        })
    }


    private socket: Socket<ClientEmitMap>;

    private sessionId?: string;
}
