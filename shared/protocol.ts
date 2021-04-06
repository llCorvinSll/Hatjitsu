

export const enum Commands {
    SORT_VOTES = 'sort votes',
    FORCE_REVEAL = 'force reveal',
    TOGGLE_VOTER  = 'toggle voter',
    RESET_VOTE = 'reset vote',
    CREATE_ROOM = 'create room',
    JOIN_ROOM  = 'join room',
    SET_CARD_PACK = 'set card pack',
    VOTE  = 'vote',
    UNVOTE = 'unvote',
}

export const enum ServerEvents {
    ROOM_JOINED = 'room joined',
    ROOM_LEFT = 'room left',
    CARD_PACK_SET = 'card pack set',
}

export interface IConnectionDescription {
    sessionId: string;
    socketId: string | null;
    vote: string | null;
    voter: boolean;
}

export interface IRoomState {
    roomUrl:string;
    createdAt:string;
    createAdmin:boolean;
    hasAdmin:boolean;
    cardPack: Decks | null;
    forcedReveal:boolean;
    alreadySorted:boolean;
    connections: IConnectionDescription[];
}

export interface EventsMap {
    [Commands.CREATE_ROOM]: (url: string) => void;
}

export interface ClientEmitMap {
    [Commands.CREATE_ROOM]: (some: null, cb: (url: IRoomState) => void) => void;
    [Commands.JOIN_ROOM]: (some: { roomUrl: string, sessionId: string }, cb: (url: IRoomState) => void) => void;
    [Commands.SET_CARD_PACK]: (some: { roomUrl: string, cardPack: Decks }, cb: (url: IRoomState) => void) => void;
    [Commands.VOTE]: (some: { roomUrl: string, vote: string, sessionId: string }, cb: (url: IRoomState) => void) => void;
    [Commands.UNVOTE]: (some: { roomUrl: string, sessionId: string }, cb: (url: IRoomState) => void) => void;
}

export interface ClientListenMap {
    [ServerEvents.ROOM_JOINED]: (room: IRoomState) => void;
    [ServerEvents.ROOM_LEFT]: (room: IRoomState) => void;
    [ServerEvents.CARD_PACK_SET]: (room: IRoomState) => void;
}

export enum Decks {
    GOAT = 'goat',
    FIB = 'fib',
    SEQ = 'seq',
    PLAY = 'play',
    TSHIRT = 'tshirt'
}


const FIB_DECK = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?'];
const GOAT_DECK = ['0', '\u00BD', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '\u2615'];
const SEQ_DECK = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '?'];
const PLAY_DECK = ['A\u2660', '2', '3', '5', '8', '\u2654'];
const TSHIRT_DECK = ['XL', 'L', 'M', 'S', 'XS', '?'];

export function chooseCardPack(val: Decks) {
    switch (val) {
        case (Decks.FIB):
            return FIB_DECK;
        case (Decks.GOAT):
            return GOAT_DECK;
        case (Decks.SEQ):
            return SEQ_DECK;
        case (Decks.PLAY):
            return PLAY_DECK;
        case (Decks.TSHIRT):
            return TSHIRT_DECK;
        default:
            return [];
    }
}
