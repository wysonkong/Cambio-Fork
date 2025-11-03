// import {useState} from "react";
import {Card} from "@/components/game/cards/Card.tsx";
import type {CardType} from "@/components/Interfaces.tsx";
import {useEffect, useState} from "react";
import {useUser} from "@/components/providers/UserProvider.tsx";

interface DeckAreaProps {
    discard: CardType | null,
    gameId: number
}

const DeckArea = ({discard, gameId} : DeckAreaProps) => {
    // const [showDiscard, setShowDiscard] = useState(false);
    const [showDiscard, setShowDiscard] = useState<CardType | null>(discard)
    const [isDiscard, setIsDiscard] = useState(false);
    const {user} = useUser();

    useEffect(() => {
        console.log("useEffect from deck area");
        if (discard) {
            const updatedDiscard = {
                ...discard,
                visible: [...(discard.visible ?? []), user?.id ?? -1]
            };
            setIsDiscard(true);
            setShowDiscard(updatedDiscard);
        } else {
            setShowDiscard(null);
        }
    },[discard])


    return (
        <div className={"bg-accent rounded-lg"}>
            <span>Game Code: {gameId}</span>
            <div className={"grid grid-cols-2 gap-4 p-4"}>
                <Card card={null}/>
                <Card card={showDiscard} isDiscard={isDiscard}/>
            </div>
        </div>
    );
};

export default DeckArea;