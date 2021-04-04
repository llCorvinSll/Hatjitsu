

export enum Commands {
    SORT_VOTES = 'sort votes',
    FORCE_REVEAL = 'force reveal',
    TOGGLE_VOTER  = 'toggle voter',
    RESET_VOTE = 'reset vote',
    UNVOTE = 'unvote',
    CREATE_ROOM = 'create room'
}


export interface EventsMap {
    [Commands.CREATE_ROOM]: (url: string) => void;
}

export interface ClientEmitMap {
    [Commands.CREATE_ROOM]: (some: null, cb: (url: string) => void) => void;
}
