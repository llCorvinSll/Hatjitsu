import {io, Socket} from "socket.io-client";
import {ClientEmitMap, ClientListenMap, Commands, Decks, IRoomState, ServerEvents} from "../../../shared/protocol";
import * as Cookies from "js-cookie";
import {BehaviorSubject} from "rxjs";


export class Api {
    constructor() {
        this.socket = io({
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 10,
            transports: ['websocket']
        });

        this.socket.on('disconnect', function () {
            console.log('service: on disconnect');
            // $rootScope.$apply(function () {
            //     $rootScope.socketMessage = ":-(  Disconnected";
            // });
        });

        this.socket.on('connect', () => {
            const sessionId = this.socket.id;
            console.log('service: on connect');

            if (!Cookies.get("sessionId")) {
                Cookies.set("sessionId", sessionId);
            }
            this.sessionId = Cookies.get("sessionId");

            this.connected.next(true)
        });
    }

    setCardPack(cardPack: Decks) {
        // $scope.resetVote();

        this.socket.emit(Commands.SET_CARD_PACK, { roomUrl: this.currentRoom.value.roomUrl, cardPack: cardPack }, (room) => {
            this.currentRoom.next(room)
        });
    };

    createRoom(): Promise<IRoomState> {
        return new Promise<IRoomState>((ok, fail) => {
            this.socket.emit(Commands.CREATE_ROOM, null, (room: IRoomState) => {
                this.currentRoom.next(room)
                ok(room)
            })
        })
    }

    joinRoom(roomId: string) {
        this.subscribeToRoomEvents()

        const args = {roomUrl: roomId, sessionId: this.sessionId!!};
        console.log("joining room", args)

        this.socket.emit(Commands.JOIN_ROOM, args, (room) => {
            this.currentRoom.next(room)
        });
    }

    private subscribeToRoomEvents() {
        this.socket.on(ServerEvents.ROOM_JOINED,  (room) => {
            this.currentRoom.next(room);
        });

        this.socket.on(ServerEvents.ROOM_LEFT,  (room) => {
            this.currentRoom.next(room);
        });

        this.socket.on(ServerEvents.CARD_PACK_SET,  (room) => {
            this.currentRoom.next(room);
        });
    }

    private socket: Socket<ClientListenMap, ClientEmitMap>;

    public currentRoom: BehaviorSubject<IRoomState> = new BehaviorSubject<IRoomState>({
        roomUrl: "",
        createdAt: "",
        createAdmin: false,
        hasAdmin: false,
        cardPack: Decks.GOAT,
        forcedReveal: false,
        alreadySorted: false,
        connections: []
    });

    public connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private sessionId?: string;
}


function  configureRoom() {

    socket.on('voter status changed', function () {
        // console.log("on voter status changed");
        // console.log("emit room info", { roomUrl: $scope.roomId });
        socket.emit('room info', { roomUrl: $scope.roomId }, function (response) {
            processMessage(response, refreshRoomInfo);
        });
    });
    socket.on('voted', function () {
        // console.log("on voted");
        // console.log("emit room info", { roomUrl: $scope.roomId });
        socket.emit('room info', { roomUrl: $scope.roomId }, function (response) {
            processMessage(response, refreshRoomInfo);
        });
    });
    socket.on('unvoted', function () {
        // console.log("on unvoted");
        // console.log("emit room info", { roomUrl: $scope.roomId });
        socket.emit('room info', { roomUrl: $scope.roomId }, function (response) {
            processMessage(response, refreshRoomInfo);
        });
    });
    socket.on('vote reset', function () {
        // console.log("on vote reset");
        // console.log("emit room info", { roomUrl: $scope.roomId });
        socket.emit('room info', { roomUrl: $scope.roomId }, function (response) {
            processMessage(response, refreshRoomInfo);
        });
    });

    socket.on('reveal', function () {
        // console.log("reveal event received");
        // setLocalVote(null);
        socket.emit('room info', { roomUrl: $scope.roomId }, function (response) {
            processMessage(response, refreshRoomInfo);
        });
    });

    socket.on('disconnect', function () {
        // console.log("on disconnect");
    });
};
