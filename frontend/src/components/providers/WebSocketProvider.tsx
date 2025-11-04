import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import { Client, type Frame } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { useUser } from "@/components/providers/UserProvider.tsx";
import type {GameState, ChatMessage, ActionLogType} from "@/components/Interfaces.tsx";

interface WebSocketContextType {
    connect: (gameId: number) => void;
    sendAction: (gameId: number, type: string, payload: any) => void;
    sendMessage: (gameId: number, input: string) => void;
    stompClient: Client | null;
    isConnected: boolean;
    gameState: GameState | null; // 👈 Added this
    chatMessages: ChatMessage[];
    actionLogs: ActionLogType[];
}

const WebSocketContext = createContext<WebSocketContextType>({
    connect: () => {},
    sendAction: () => {},
    sendMessage: () => {},
    stompClient: null,
    isConnected: false,
    gameState: null, // 👈 Added this
    chatMessages: [],
    actionLogs: [],
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [gameId, setGameId] = useState<number | null>(null); // 👈 Changed to number
    const [client, setClient] = useState<Client | null>(null); // 👈 Fixed typo
    const { user } = useUser();
    const stompClientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [actionLogs, setActionLogs] = useState<ActionLogType[]>([]);

    useEffect(() => {
        if (client) {
            client.onConnect = (frame: Frame) => {
                console.log("Connected:", frame);
                setIsConnected(true);
                stompClientRef.current = client;

                // Subscribe to game-specific updates
                const stateSub = client.subscribe(`/topic/game.${gameId}.state`, (message) => {
                    try {
                        const newState: GameState = JSON.parse(message.body);
                        console.log("🆕 Received new game state:", newState);
                        setGameState(newState);
                    } catch (err) {
                        console.error("Invalid game state message", err);
                    }
                });
                const chatSub = client.subscribe(`/topic/game.${gameId}.chat`, (message) => {
                    try {
                        const chatMsg: ChatMessage = JSON.parse(message.body);
                        if(chatMsg)setChatMessages((prev) => [...prev, chatMsg]);
                    } catch (err) {
                        console.error("Invalid chat message", err);
                    }
                });
                const actionSub = client.subscribe(`/topic/game.${gameId}.action`, (message) => {
                    try{
                        const actionLog: ActionLogType = JSON.parse(message.body);
                        console.log("Action Log updated")
                        if (actionLog) setActionLogs((prev) => [...prev, actionLog]);
                    } catch (err) {
                        console.error("Invalid action log", err);
                    }
                })

                // Automatically send JOIN when connected
                if (gameId) {
                    sendAction(gameId, "JOIN", {});
                }
            };

            client.onDisconnect = () => {
                console.log("Disconnected from WebSocket");
                setIsConnected(false);
                stompClientRef.current = null;
            };

            client.onStompError = (frame: Frame) => {
                console.error("STOMP error:", frame);
                setIsConnected(false);
            };

            client.activate(); // 👈 Activate the client here

            return () => {
                console.log("Shutting down client");
                client.deactivate();
            };
        }
    }, [client, gameId, user]); // 👈 Added dependencies

    // Connect to WebSocket
    const connect = (newGameId: number) => { // 👈 Fixed parameter type
        if (!user) {
            console.warn("No user available, cannot connect");
            return;
        }

        const newClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: () => {}, // Disable console spam
        });

        setGameId(newGameId);
        setClient(newClient);
    };

    // Send an action via WebSocket
    const sendAction = (gameId: number, type: string, payload: Map<string, Object>) => {
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

    const sendMessage = (gameId: number, input: string) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: `/app/game/${gameId}/chat`,
                body: JSON.stringify({
                    userId: user?.id,
                    message: input,
                }),
            });
        }
    }

    return (
        <WebSocketContext.Provider
            value={{
                connect,
                sendAction,
                stompClient: stompClientRef.current,
                isConnected,
                gameState,
                sendMessage,
                chatMessages,
                actionLogs// 👈 Added this
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);