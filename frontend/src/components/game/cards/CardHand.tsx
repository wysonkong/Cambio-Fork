import {Card} from "@/components/game/cards/Card.tsx";
import {useEffect, useState} from 'react';
import type {CardType, Player} from "@/components/Interfaces.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";



interface CardHandProp {
    initcards: CardType[] | undefined,
    thisPlayer: Player,
    handleClick: (userId: number, index: number) => void;
    selectedCard: {userId: number, index: number} | null;
}
const CardHand = ({initcards, thisPlayer, handleClick, selectedCard} : CardHandProp) => {
    const [topCards, setTopCards] = useState<CardType[]>();
    const [bottomCards, setBottomCards] = useState<CardType[]>();
    const [middleIndex, setMiddleIndex] = useState<number> (Math.ceil(initcards ? initcards.length / 2 : 2))
    const {user} = useUser();



    useEffect(() => {
        setMiddleIndex(Math.ceil(initcards ? initcards.length / 2 : 2))
        console.log("useeffect of card hand")
        console.log(initcards)
        setTopCards(initcards?.slice(0, middleIndex));
        setBottomCards(initcards?.slice(middleIndex));
        console.log(topCards);
        console.log(bottomCards);

    }, [initcards]);

    return (
        <div className={"flex justify-center grid-flow-col grid-rows-2"}>
                <>
                    <div className={"border-2 border-white hover:ring-accent"}>
                        {topCards?.map((card, index) => (
                        <Card key={index} card={card} cardIndex={index} thisPlayerId={thisPlayer.userId} handleClick={handleClick}
                              isSelected={
                                  selectedCard?.userId === thisPlayer.userId &&
                                  selectedCard?.index === index
                              }/>
                            ))}
                    </div>
                    <div className={"border-2 border-white hover:ring-accent"}>
                        {bottomCards?.map((card, index) => (
                            <Card key={`${user?.id}-${index}`} card={card} cardIndex={index + middleIndex} thisPlayerId={thisPlayer.userId} handleClick={handleClick}
                                  isSelected={
                                      selectedCard?.userId === thisPlayer.userId &&
                                      selectedCard?.index === (index + middleIndex)
                                  }/>
                        ))}
                    </div>
                </>
        </div>
    );
};

export default CardHand;