// import {useState} from "react";
import {Card} from "@/components/game/cards/Card.tsx";
import type {CardType} from "@/components/Interfaces.tsx";
import {type Ref, useEffect, useState} from "react";
import {useUser} from "@/components/providers/UserProvider.tsx";

interface DeckAreaProps {
    drawRef: Ref<HTMLImageElement>,
    discard: CardType | null,
    gameId: number,
}

const DeckArea = ({drawRef, discard, gameId} : DeckAreaProps) => {
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

    const deckCard: CardType = {
        rank: "back",
        suit: "back",
        visible: []
    };


    return (
        <div className={"bg-accent rounded-lg"}>
            <span>Game Code: {gameId}</span>
            <div className={"grid grid-cols-2 gap-4 p-4"}>
                <Card ref={drawRef} card={deckCard} cardIndex={-1} thisPlayerId={-1}/>
                <Card card={showDiscard} isDiscard={isDiscard} cardIndex={-2} thisPlayerId={-2}/>
            </div>
        </div>
    );
};

export default DeckArea;