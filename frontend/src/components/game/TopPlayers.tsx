import CardHand from "@/components/game/CardHand.tsx";

const TopPlayers = () => {
    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-col items-center"}>
            <div className={"flex justify-center grid-flow-col grid-rows-1"}/>
            <div id="${slotId}-username" className="text-center font-bold mb-2">Player</div>

            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id="${slotId}-cards"><CardHand/></div>
                <div id="${slotId}-draw" className="flex justify-center"></div>
            </div>

        </div>
    );
};

export default TopPlayers;