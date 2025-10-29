import type {Card} from "@/components/Interfaces.tsx";
import {useEffect, useState} from 'react';
import {useUser} from "@/components/providers/UserProvider.tsx";




interface CardProp {
    card: Card | null,
}

const Card = ({card} : CardProp) => {
    const[imgSrc, setImgSrc] = useState<string> ("/images/svgtopng/card-back.png");
    const {user} = useUser();

    useEffect(() => {
        if(!card) return;

        if(!user) return;

        if(card?.isVisible.includes(user.id)) {
            setImgSrc(`/images/svgtopng/${card?.rank}-${card?.suit}.png`);
        }
    }, []);


    return(
        <div>
            <img src={imgSrc}
                 alt={`${card?.rank} + ${card?.suit}`}
                 className={"h-28 w-20"}/>
        </div>
    );
};

export default Card;