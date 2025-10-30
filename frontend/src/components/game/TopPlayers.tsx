import CardHand from "@/components/game/cards/CardHand.tsx";
import type {CardType, Player} from "@/components/Interfaces.tsx";

interface TopPlayersProp {
    player: Player,
    hand: CardType[] | undefined,
}

const TopPlayers = ({player, hand} : TopPlayersProp) => {
    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-col items-center"}>
            <div className={"flex justify-center grid-flow-col grid-rows-1"}/>
            <div id="${slotId}-username" className="text-center font-bold mb-2">{player.userName}</div>

            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id="${slotId}-cards"><CardHand initcards={hand}/></div>
                <div id="${slotId}-draw" className="flex justify-center"></div>
            </div>

        </div>
    );
};

export default TopPlayers;