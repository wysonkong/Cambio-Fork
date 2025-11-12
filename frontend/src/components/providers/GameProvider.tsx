import React, {createContext, useContext, useEffect, useState} from 'react';
import type {GameState, Player} from "@/components/Interfaces.tsx";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";


interface GameContextType {
    gameState: GameState | null,
    gameControlArr: boolean[],
    myIndex: number
}

const GameContext = createContext<GameContextType>({
    gameState: null,
    gameControlArr: [],
    myIndex: -1,
})

const GameProvider = ({children} : {children: React.ReactNode}) => {
    const {gameState} = useWebSocket()
    const [gameControlArr, setGameControlArr] = useState<boolean[]> ([true, false, false, false ,false, false])
    const [myIndex, setMyIndex] = useState<number>(-1);
    const {user} = useUser();


    useEffect(() => {
        if(!gameState) return;

        gameState.players.forEach((p: Player, index) => {
            if(p.userId === user?.id) {
                setMyIndex(index);
            }
        })
        if(!gameState.gameStarted) {
            console.log("game has not started")
            setGameControlArr([true, false, false, false ,false, false])
        }
        else {
            if(gameState.currentTurn === myIndex ) {
                if(!gameState.hasDrawn) {
                    setGameControlArr([false, true, false, false, true, true])
                }
                if(gameState.hasDrawn && gameState.players[myIndex].pending !== null) {
                    setGameControlArr([false, false, true, true, false, false])
                }
                if(gameState.hasDrawn && gameState.players[myIndex].pending === null) {
                    if(!gameState.lastCardStuck) {
                        setGameControlArr([false, false, false, false, false, true])
                    }
                    else {
                        setGameControlArr([false, false, false, false, false, false ])
                    }
                }
            }
            else {
                if(!gameState.lastCardStuck) {
                    setGameControlArr([false, false, false, false, false, true])
                }
                else {
                    setGameControlArr([false, false, false, false, false, false ])
                }
            }
        }
    }, [gameState]);



    return (
        <GameContext.Provider value={{gameControlArr, gameState, myIndex}}>{children}</GameContext.Provider>
    );
};

export default GameProvider;

export const useGame = () => useContext(GameContext);