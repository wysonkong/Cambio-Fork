import CardHand from "@/components/game/cards/CardHand.tsx";
import type {CardType, Player} from "@/components/Interfaces.tsx";
import {useEffect, useState} from "react";
import {Card} from "@/components/game/cards/Card.tsx";
import {motion, AnimatePresence} from "framer-motion";

interface TopPlayersProp {
    player: Player,
    hand: CardType[],
    handleClick: (userId: number, index: number) => void,
    selectedCard: { userId: number, index: number } | null;
}

const TopPlayers = ({player, hand, handleClick, selectedCard}: TopPlayersProp) => {
    const [avatar, setAvatar] = useState("dog")
    const [pending, setPending] = useState(player.pending);


    useEffect(() => {
        async function fetchAvatar() {
            try {
                const response = await fetch("http://localhost:8080/api/getUser" + player.userId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user");

                const user = await response.json();
                setAvatar(user.avatar);


            } catch (err) {
                console.error("Error fetching avatar:", err);
            }
        }

        fetchAvatar();
        setPending(player.pending);

    }, [player]);

    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-row items-center"}>
            <div id="${slotId}-username" className="text-center font-bold mb-2">
                <img src={`/images/avatars/${avatar}.png`} alt={`${player.userName}'s avatar`} className={"h-14 w-14"}/>
                {player.userName}
                {player.pending &&
                    <div id="${slotId}-draw" className="flex justify-center">
                        <AnimatePresence>
                            <motion.div
                                initial={{x: -200, opacity: 0, scale: 0.5}}
                                animate={{x: 0, opacity: 1, scale: 1}}
                                exit={{x: 200, opacity: 0, scale: 0.5}}
                                transition={{duration: 0.5, type: "spring"}}
                            >
                                <Card card={pending} cardIndex={999} thisPlayerId={player.userId}/>
                            </motion.div>
                        </AnimatePresence>
                    </div>}

            </div>

            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id="${slotId}-cards">
                    <AnimatePresence>
                        <CardHand initcards={[...hand].reverse()} handleClick={handleClick} thisPlayer={player}
                                  selectedCard={selectedCard}/>
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
};

export default TopPlayers;