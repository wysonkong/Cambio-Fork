import DeckArea from "@/components/game/DeckArea.tsx";
import PlayerZone from "@/components/game/PlayerZone.tsx";
import GameControls from "@/components/game/GameControls.tsx";

const Test = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className={"flex-1 flex flex-col items-center justify-start overflow-y-auto"}>
                <div className={"grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-0 p-4 w-full h-full"}>
                    <div className={"flex justify-center items-center col-start-1 row-start-1"}><PlayerZone/></div>
                    <div className={"flex justify-center items-center col-start-2 row-start-1"}><PlayerZone/></div>
                    <div className={"flex justify-center items-center col-start-1 row-start-2"}><PlayerZone/></div>
                    <div className={"flex justify-center items-center col-start-2 row-start-2"}><PlayerZone/></div>
                    <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1]"}>
                        <DeckArea/>
                    </div>
                </div>
                <div className={""}><GameControls/></div>
            </div>

        </div>
    );
};

export default Test;