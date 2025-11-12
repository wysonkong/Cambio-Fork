export interface User {
    id: number
    username: string
    password: string
    wins: number
    loses: number
    avatar: string;
    card: string;
    balance: number;
}

export interface CardType {
    rank: string
    suit: string
    visible: number[]
}


export interface Player {
    userId : number,
    userName : string,
    index: number,
    hand: CardType[],
    score: number,
    pending: CardType
}

export interface endPlayer {
    id: number,
    score: number,
    user: string,
}

export interface GameState {
    players: Player[],
    prevCard: CardType,
    currentTurn: number,
    cambioCalled: boolean,
    didStickWork: boolean,
    specialMove: number,
    winners: Player[],
    tempTurn: boolean,
    gameStarted: boolean,
    cambioPlayer: Player,
    lastCardStuck: boolean,
    hasDrawn: boolean,
    seq: number
}

export interface ChatMessage {
    sender: string;
    content: string;
    timestamp?: Date;
}

export interface ActionLogType {
    userId: number
    username: string;
    type: string;
    payload: Map<string, Object>;
}

export interface SwapState {
    originUserId : number | null;
    originIndex : number | null;
    destinationUserId: number | null;
    destinationIndex: number | null;
}
