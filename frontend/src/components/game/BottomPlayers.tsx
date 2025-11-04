import CardHand from "@/components/game/cards/CardHand.tsx";
import type {Player, CardType, ChatMessage} from "@/components/Interfaces.tsx";
import {useEffect, useState} from "react";
import {Card} from "@/components/game/cards/Card.tsx";
import {motion, AnimatePresence} from "framer-motion";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";
import {toast} from "sonner";

interface BottomPlayersProp {
    player: Player,
    hand: CardType[] | undefined,
    handleClick: (userId: number, index: number) => void;
    selectedCard: { userId: number, index: number } | null;
}

const BottomPlayers = ({player, hand, handleClick, selectedCard}: BottomPlayersProp) => {
    const [avatar, setAvatar] = useState("dog")
    const [pending, setPending] = useState(player.pending);
    const {chatMessages} = useWebSocket();
    const [chatMessage, setChatMessage] = useState<ChatMessage | null>(null)
    const {user} = useUser();


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
        setChatMessage(chatMessages[chatMessages.length - 1])
    }, [player, chatMessages]);


    console.log(player)

    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-row items-center"}>
            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id={"${slotId}-cards"}>
                    <AnimatePresence>
                        <CardHand initcards={hand} thisPlayer={player} handleClick={handleClick}
                                  selectedCard={selectedCard}
                        />
                    </AnimatePresence></div>
            </div>
            <div id="${slotId}-username" className="text-center font-bold mb-2 flex flex-col">
                <img src={`/images/avatars/${avatar}.png`} alt={`${player.userName}'s avatar`} className={"h-14 w-14"}/>
                {player.userName}
                {(chatMessage?.sender !== user?.username) && toast(`${chatMessage?.content}`, {className: "bg-card text-card-foreground border-border"})}
                {player.pending &&
                    <div id={"${slotId}-draw"} className="flex justify-center">
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

        </div>
    );
};

export default BottomPlayers;