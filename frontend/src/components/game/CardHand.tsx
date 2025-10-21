import Card from "@/components/game/Card.tsx";
import {useState} from 'react';

const CardHand = () => {
    const [cards, setCards] = useState([1,2,3,4]);

    const middleIndex = Math.ceil(cards.length / 2);
    const topCards = cards.slice(0, middleIndex);
    const bottomCards = cards.slice(middleIndex);

    return (
        <div className={"flex justify-center grid-flow-col grid-rows-2"}>
                <>
                    <div className={"border-2 border-white hover:ring-accent"}>
                        {topCards.map((card, index) => (
                        <Card key={index}/>
                            ))}
                    </div>
                    <div className={"border-2 border-white hover:ring-accent"}>
                        {bottomCards.map((card, index) => (
                            <Card key={index}/>
                        ))}
                    </div>
                </>
        </div>
    );
};

export default CardHand;