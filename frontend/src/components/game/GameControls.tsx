import {Button} from "@/components/ui/button.tsx";
import Chat from "@/components/game/Chat.tsx";
import ActionLog from "@/components/game/ActionLog.tsx";
import {useGame} from "@/components/providers/GameProvider.tsx";

interface GameControlsProps {
    gameId?: number | null
    handleStart?: () => void,
}

const GameControls = ({gameId, handleStart}: GameControlsProps) => {
    const {gameControlArr} = useGame();

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
                    className={"px-4 py-2 bg-chart-2 rounded-lg hover:bg-chart-2/80 focus:ring-chart-2/50"}>
                Draw
            </Button>}
            {gameControlArr[2] && <Button id="discard-btn"
                    className={"px-4 py-2 bg-chart-4  rounded-lg hover:bg-chart-4/80 focus:ring-chart-4/50"}>
                Discard
            </Button>}
            {gameControlArr[3] && <Button id="swap-pending-btn"
                    className={"px-4 py-2 bg-chart-5 rounded-lg hover:bg-chart-5/80 focus:ring-chart-5/50"}>
                Swap
            </Button>}
            {gameControlArr[4] && <Button id="cambio-btn"
                    className={"px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 focus:ring-primary/50"}>
                Cambio!
            </Button>}
            {gameControlArr[5] && <Button id="stick-btn" className={"px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 focus:bg-accent/50"}>
                Stick
            </Button>}
            <ActionLog/>
            <Chat gameId={gameId}/>
        </div>
    );
};

export default GameControls;