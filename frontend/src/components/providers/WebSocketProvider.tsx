import {Client} from "@stomp/stompjs";
import React, {createContext, useRef, useState} from "react";

interface WebSocketContextType {
    stompClient: Client | null;
    connect: (gameId: string) => void;
    sendAction :(gameId: string, userId: string, username: string, type: string, payload: any) => void;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
    stompClient: null,
    connect: () => {},
    sendAction: () => {},
    isConnected: false,
});

export const WebSocketProvider = ({children} : {children: React.ReactNode}) => {
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);


}