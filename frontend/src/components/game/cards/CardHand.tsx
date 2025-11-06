import {Card} from "@/components/game/cards/Card.tsx";
import type {CardType, Player} from "@/components/Interfaces.tsx";
import type {RefObject} from "react";



interface CardHandProp {
    cardRefs: RefObject<Map<string, HTMLDivElement>>
    initcards: CardType[] | undefined,
    thisPlayer: Player,
    handleClick: (userId: number, index: number) => void;
    selectedCard: {userId: number, index: number} | null;
    topPlayer: boolean;
}
const CardHand = ({cardRefs, initcards, thisPlayer, handleClick, selectedCard, topPlayer} : CardHandProp) => {
    const allCards = initcards;


    return (
        <div className="grid grid-rows-2 grid-flow-col gap-2 justify-center">
             {allCards?.map((card, index, array) => (

                <Card ref={(el) => {
                    if (el) cardRefs.current.set(`${thisPlayer.userId}-${topPlayer ? array.length - 1 - index : index}`, el);
                    else cardRefs.current.delete(`${thisPlayer.userId}-${topPlayer ? array.length - 1 - index : index}`);
                }} key={index} card={card} cardIndex={topPlayer ? array.length - 1 - index : index} thisPlayerId={thisPlayer.userId} handleClick={handleClick} isSelected={selectedCard?.userId === thisPlayer.userId && selectedCard?.index === (topPlayer ? array.length - 1 - index : index)} />
            ))}
        </div>
    );
};

export default CardHand;