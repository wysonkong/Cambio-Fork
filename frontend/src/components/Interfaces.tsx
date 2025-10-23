export interface User {
    id: number
    username: string
    password: string
    wins: number
    loses: number
    avatar: string;
}

export interface Card {
    rank: string
    suit: string
    isVisible: number[]
}
