export interface User {
    id: number
    username: string
    password: string
    wins: number
    loses: number
    avatar: string;
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
    seq: number
}

export interface ChatMessage {
    sender: string;
    content: string;
    timestamp?: Date;
}
