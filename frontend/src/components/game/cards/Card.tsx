import type {CardType} from "@/components/Interfaces.tsx";
import {useEffect, useState} from 'react';
import {useUser} from "@/components/providers/UserProvider.tsx";




interface CardProp {
    card: CardType | null,
}

export const Card = ({card} : CardProp) => {
    const[imgSrc, setImgSrc] = useState<string> ("/images/svgtopng/card-back.png");
    const {user} = useUser();

    useEffect(() => {
        if(!card) return;

        if(!user) return;
        console.log("useEffect of card")
        if(card?.isVisible?.includes(user.id)) {
            console.log("card is visible")
            setImgSrc(`/images/svgtopng/${card?.rank}-${card?.suit}.png`);
        }
    }, [card]);


    return(
        <div>
            <img src={imgSrc}
                 alt={`${card?.rank} + ${card?.suit}`}
                 className={"h-28 w-20"}/>
        </div>
    );
};

