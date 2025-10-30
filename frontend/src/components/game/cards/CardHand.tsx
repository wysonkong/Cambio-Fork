import {Card} from "@/components/game/cards/Card.tsx";
import {useEffect, useState} from 'react';
import type {CardType} from "@/components/Interfaces.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";


interface CardHandProp {
    initcards: CardType[] | undefined,
}
const CardHand = ({initcards} : CardHandProp) => {
    const [topCards, setTopCards] = useState<CardType[]>();
    const [bottomCards, setBottomCards] = useState<CardType[]>();
    const {user} = useUser();



    useEffect(() => {
        console.log("useeffect of card hand")
        console.log(initcards)
        const middleIndex = Math.ceil(initcards ? initcards.length / 2 : 2);
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
                        <Card key={index} card={card}/>
                            ))}
                    </div>
                    <div className={"border-2 border-white hover:ring-accent"}>
                        {bottomCards?.map((card, index) => (
                            <Card key={`${user?.id}-${index}`} card={card}/>
                        ))}
                    </div>
                </>
        </div>
    );
};

export default CardHand;