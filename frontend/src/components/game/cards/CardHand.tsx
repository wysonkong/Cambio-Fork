import {Card} from "@/components/game/cards/Card.tsx";
import type {CardType, Player} from "@/components/Interfaces.tsx";



interface CardHandProp {
    initcards: CardType[] | undefined,
    thisPlayer: Player,
    handleClick: (userId: number, index: number) => void;
    selectedCard: {userId: number, index: number} | null;
    topPlayer: boolean;
}
const CardHand = ({initcards, thisPlayer, handleClick, selectedCard, topPlayer} : CardHandProp) => {
    const allCards = initcards;


    return (
        <div className="grid grid-rows-2 grid-flow-col gap-2 justify-center">
             {allCards?.map((card, index, array) => (

                <Card key={index} card={card} cardIndex={topPlayer ? array.length - 1 - index : index} thisPlayerId={thisPlayer.userId} handleClick={handleClick} isSelected={selectedCard?.userId === thisPlayer.userId && selectedCard?.index === (topPlayer ? array.length - 1 - index : index)} />
            ))}
        </div>
    );
};

export default CardHand;