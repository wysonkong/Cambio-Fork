import type {Card, User} from "@/components/Interfaces.tsx";
import {createContext, useEffect, useState} from 'react';

interface CardContextType {
    card: Card | null;
    setCard: (card: Card) => void;
}

const CardContext = createContext<CardContextType>({
    card: null,
    setCard: () => {}
})

const test: Card = {
    rank: "K",
    suit: "Spade",
    isVisible: [0,2],
}

const currentPlayerId = 1

const Card = () => {
    const [card, setCard] = useState<Card | null>(null);

    useEffect(() => {
        setCard(test)
    }, []);


    return(
        <div>
            <img src={card?.isVisible.includes(currentPlayerId)
                ? `/images/svgtopng/${card?.rank}-${card?.suit}.png`
                : "/images/svgtopng/card-back.png"}
                 alt={`${card?.rank} + ${card?.suit}`}
                 className={"h-28 w-20"}/>
        </div>
    );
};

export default Card;