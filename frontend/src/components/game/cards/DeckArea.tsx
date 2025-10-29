// import {useState} from "react";
import Card from "@/components/game/cards/Card.tsx";

interface DeckAreaProps {
    discard: Card,
}

const DeckArea = ({discard} : DeckAreaProps) => {
    // const [showDiscard, setShowDiscard] = useState(false);


    return (
        <div className={"bg-accent rounded-lg"}>
            <div className={"grid grid-cols-2 gap-4 p-4"}>
                <Card card={null}/>
                <Card card={discard}/>
            </div>
        </div>
    );
};

export default DeckArea;