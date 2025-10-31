import React, {createContext, use, useState} from 'react';
import type {GameState} from "@/components/Interfaces.tsx";


interface GameContextType {
    gameState: GameState | null,
    gameControl: (gameState: GameState) => void,
}

const GameContext = createContext<GameContextType>({
    gameState: null,
    gameControl: () => {},
})

const GameProvider = ({children} : {children: React.ReactNode}) => {
    const [startBtn, setStartBtn] = useState(true);
    const [drawBtn, setDrawBtn] = useState(false);
    const [discardBtn, setDiscardBtn] = useState(false);
    const [swapBtn, setSwapBtn] = useState(false);
    const [cambioBtn, setCambioBtn] = useState(false);
    const [stickBtn, setStickBtn] = useState(false);

    const gameControl = (gameState: GameState) => {

    }

    return (
        <GameContext.Provider value={{gameState, gameControl}}>{children}</GameContext.Provider>
    );
};

export default GameProvider;