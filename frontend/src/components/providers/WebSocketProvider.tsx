import React, { createContext, useContext, useRef, useState} from "react";
import { Client, type Frame } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { useUser } from "@/components/providers/UserProvider.tsx";

interface WebSocketContextType {
    connect: (gameId: number) => void;
    sendAction: (gameId: number, type: string, payload: any) => void;
    stompClient: Client | null;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
    connect: () => {},
    sendAction: () => {},
    stompClient: null,
    isConnected: false,
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const stompClientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Connect to WebSocket and send JOIN
    const connect = (gameId: number) => {
        if (!user) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: () => {}, // Disable console spam
        });

        client.onConnect = (frame: Frame) => {
            console.log("Connected:", frame);
            setIsConnected(true);
            stompClientRef.current = client;

            // Automatically send JOIN when connected
            sendAction(gameId, "JOIN", {});
        };

        client.onStompError = (frame: Frame) => {
            console.error("STOMP error:", frame);
            setIsConnected(false);
        };

        client.activate();
    };

    // Send an action via WebSocket
    const sendAction = (gameId: string | number, type: string, payload: any) => {
        console.log("Attempting to send action:", { gameId, type, payload });

        if (!user) {
            console.warn("No user loaded yet, cannot send action");
            return;
        }

        if (stompClientRef.current?.connected) {
            console.log("STOMP connected, sending...");
            stompClientRef.current.publish({
                destination: `/app/game/${gameId}/action`,
                body: JSON.stringify({
                    userId: user.id,
                    username: user.username,
                    type,
                    payload,
                }),
            });
        } else {
            console.warn("STOMP not connected yet, action not sent");
        }
    };


    return (
        <WebSocketContext.Provider value={{ connect, sendAction, stompClient: stompClientRef.current, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
