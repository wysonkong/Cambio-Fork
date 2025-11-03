import CardHand from "@/components/game/cards/CardHand.tsx";
import type {Player, CardType} from "@/components/Interfaces.tsx";

interface BottomPlayersProp {
    player: Player,
    hand: CardType[] | undefined,
}
const BottomPlayers = ({player, hand} : BottomPlayersProp) => {

    console.log(player)

    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-col items-center"}>
            <div className={"flex justify-center grid-flow-col grid-rows-1"}/>
            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id="${slotId}-cards"><CardHand initcards={hand}/></div>
                <div id="${slotId}-draw" className="flex justify-center"></div>
            </div>
            <div id="${slotId}-username" className="text-center font-bold mb-2 flex flex-col">
                {player.userName}
            </div>

        </div>
    );
};

export default BottomPlayers;