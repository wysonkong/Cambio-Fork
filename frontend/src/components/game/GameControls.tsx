import {Button} from "@/components/ui/button.tsx";
import Chat from "@/components/game/Chat.tsx";
import ActionLog from "@/components/game/ActionLog.tsx";
import {useGame} from "@/components/providers/GameProvider.tsx";
import {useEffect, useState} from "react";


interface GameControlsProps {
    gameId?: number | null
    handleStart?: () => void,
    handleDraw?: () => void,
    handleDiscard?: () => void,
    handleSwap?: () => void,
    handleCambio?: () => void,
    handleStick?: () => void,

}

const GameControls = ({
                          gameId,
                          handleStart,
                          handleDraw,
                          handleDiscard,
                          handleSwap,
                          handleCambio,
                          handleStick,
                      }: GameControlsProps) => {
    const {gameControlArr} = useGame();
    const [chatOpen, setChatOpen] = useState<boolean> (false);

    const keyBindings = [
        { key: " ", index: 1, handler: handleDraw },    // Draw
        { key: " ", index: 2, handler: handleDiscard }, // Discard
        { key: "z", index: 3, handler: handleSwap },    // Swap
        { key: "c", index: 4, handler: handleCambio },  // Cambio
        { key: "shift", index: 5, handler: handleStick },   // Stick
    ];

    const handleChat =() => {
        let chatStatus = chatOpen;
        chatStatus = !chatStatus;
        setChatOpen(chatStatus)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            // Open chat if Enter pressed
            if (!chatOpen && key === "Enter") {
                event.preventDefault();
                setChatOpen(true);
                return;
            }

            if (chatOpen) return; // disable other keybinds when chat is open

            const binding = keyBindings.find(
                (b) => b.key === key.toLowerCase() && gameControlArr[b.index]
            );

            if (binding?.handler) {
                event.preventDefault();
                binding.handler();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);

    }, [gameControlArr, handleStart, handleDraw, handleDiscard, handleSwap, handleCambio, handleStick, chatOpen]);


    return (
        <div id="bottom"
             className={"mt-4 gap-4 p-8 bg-foreground text-black text-center h-16 flex items-center justify-center w-full rounded-md"}>
            <span id="display-turn"></span>
            {gameControlArr[0] && (<Button id="start-btn"
                                           className={"px-4 py-2 bg-chart-1  rounded-lg hover:bg-chart-1/80 focus:ring-chart-1/50"}
                                           onClick={handleStart}>
                Start Game
            </Button>)}
            {gameControlArr[1] && <Button id="draw-btn"
                                          className={"px-4 py-2 bg-chart-2 rounded-lg hover:bg-chart-2/80 focus:ring-chart-2/50"}
                                          onClick={handleDraw}>
                Draw (Space)
            </Button>}
            {gameControlArr[2] && <Button id="discard-btn"
                                          className={"px-4 py-2 bg-chart-4  rounded-lg hover:bg-chart-4/80 focus:ring-chart-4/50"}
                                          onClick={handleDiscard}>
                Discard (Space)
            </Button>}
            {gameControlArr[3] && <Button id="swap-pending-btn"
                                          className={"px-4 py-2 bg-chart-5 rounded-lg hover:bg-chart-5/80 focus:ring-chart-5/50"}
                                          onClick={handleSwap}>
                Swap (Z)
            </Button>}
            {gameControlArr[4] && <Button id="cambio-btn"
                                          className={"px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 focus:ring-primary/50"}
                                          onClick={handleCambio}>
                Cambio! (C)
            </Button>}
            {gameControlArr[5] && <Button id="stick-btn"
                                          className={"px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 focus:bg-accent/50"}
                                          onClick={handleStick}>
                Stick (Shfit)
            </Button>}
            <ActionLog/>
            <Button onClick={handleChat}>
                Chat (Enter)
            </Button>
            <Chat gameId={gameId} chatOpen={chatOpen} handleChat={handleChat}/>
        </div>
    );
};

export default GameControls;