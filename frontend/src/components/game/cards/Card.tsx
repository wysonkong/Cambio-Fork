import type {CardType} from "@/components/Interfaces.tsx";
import {forwardRef, useEffect, useState} from 'react';
import {useUser} from "@/components/providers/UserProvider.tsx";
import {motion} from "framer-motion";


interface CardProp {
    card: CardType | null,
    cardIndex?: number,
    isDiscard?: boolean,
    handleClick?: (userId: number, index: number) => void;
    thisPlayerId?: number,
    isSelected?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProp>(({card, cardIndex, isDiscard, handleClick, thisPlayerId, isSelected}, ref) => {
    const [imgSrc, setImgSrc] = useState<string>("/images/svgtopng/card-back.png");
    const {user} = useUser();
    const [isFlipped, setIsFlipped] = useState(false);


    const me = Number(user?.id);


    useEffect(() => {
        if (ref && "current" in ref && ref.current) {
            console.log("Card mounted with ref:", ref.current);
        }
    }, [ref]);


    useEffect(() => {
        if (!card) return;

        if (!user) return;

        let shouldBeFlipped = false;

        if  ((card?.visible.includes(me) && card.visible.length === 1) || isDiscard) {
            setImgSrc(`/images/cardTheme/${user.card}/${card?.rank}-${card?.suit}.png`);
            shouldBeFlipped = true;
        } else if (card?.visible?.includes(me) && card.visible.length >= 2) {
            setImgSrc(`/images/cardTheme/${user.card}/${card?.rank}-${card?.suit}peek.png`)
            shouldBeFlipped = true;
        } else if (!card?.visible.includes(me) && card.visible.length >= 1 && thisPlayerId === user?.id) {
            setImgSrc(`/images/cardTheme/${user.card}/card-back-peek.png`)
            shouldBeFlipped = false;
        } else {
            setImgSrc(`/images/cardTheme/${user.card}/card-back.png`)
            shouldBeFlipped = false;
        }

        setIsFlipped(shouldBeFlipped);

    }, [card?.visible]);



    return (
        <motion.div
            ref={ref}
            className={`flex items-center justify-center h-30 w-22 hover:bg-secondary transition-colors cursor-pointer ${
                isSelected ? 'ring-4 ring-red-500 rounded-lg' : ''
            }`}
            onClick={() => {
                if (handleClick && thisPlayerId !== undefined && cardIndex !== undefined) {
                    handleClick(thisPlayerId, cardIndex);
                }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="relative h-28 w-20"
                initial={false}
                animate={{
                    rotateY: isFlipped ? 180 : 0,
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                }}
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Card Back */}
                <motion.img
                    src={imgSrc}
                    alt="card back"
                    className="absolute h-28 w-20"
                    style={{
                        backfaceVisibility: "hidden",
                    }}
                />

                {/* Card Front */}
                <motion.img
                    src={imgSrc}
                    alt={`${card?.rank} of ${card?.suit}`}
                    className="absolute h-28 w-20"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                />
            </motion.div>
        </motion.div>
    );

    }

);




