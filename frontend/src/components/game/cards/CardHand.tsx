import {Card} from "@/components/game/cards/Card.tsx";
import type {CardType, Player} from "@/components/Interfaces.tsx";



interface CardHandProp {
    initcards: CardType[] | undefined,
    thisPlayer: Player,
    handleClick: (userId: number, index: number) => void;
    selectedCard: {userId: number, index: number} | null;
}
const CardHand = ({initcards, thisPlayer, handleClick, selectedCard} : CardHandProp) => {
    const allCards = initcards;


    return (
        <div className="grid grid-rows-2 grid-flow-col gap-2 justify-center">
            {allCards?.map((card, index) => (
                <Card key={index} card={card} cardIndex={index} thisPlayerId={thisPlayer.userId} handleClick={handleClick} isSelected={selectedCard?.userId === thisPlayer.userId && selectedCard?.index === index} />
            ))}
        </div>
    );
};

export default CardHand;