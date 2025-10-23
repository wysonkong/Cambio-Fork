import {Client, Frame, IMessage, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
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

    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // Hook subscriptions from gameRender.js
        subscribeGameState(gameId);
        subscribeActions(gameId);
        subscribeChat(gameId);

        sendAction(gameId, currentUser.userId, currentUser.username, "JOIN", {});
    }, error => {
        console.error('STOMP connection error: ', error);
    });

}