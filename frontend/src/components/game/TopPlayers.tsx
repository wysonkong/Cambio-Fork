import CardHand from "@/components/game/cards/CardHand.tsx";
import type {CardType, Player} from "@/components/Interfaces.tsx";
import {type Ref, useEffect, useRef, useState} from "react";
import {Card} from "@/components/game/cards/Card.tsx";
import {motion, AnimatePresence} from "framer-motion";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";
import {toast} from "sonner";

interface TopPlayersProp {
    player: Player,
    hand: CardType[],
    handleClick: (userId: number, index: number) => void,
    selectedCard: { userId: number, index: number } | null;
    drawRef: Ref<HTMLImageElement>
}

const TopPlayers = ({player, hand, handleClick, selectedCard, drawRef}: TopPlayersProp) => {
    const [avatar, setAvatar] = useState("dog")
    const [pending, setPending] = useState(player.pending);
    const {chatMessages} = useWebSocket();
    const {user} = useUser();
    const avatarRef = useRef<HTMLImageElement>(null);
    const [lastMessageId, setLastMessageId] = useState<string | null>(null);



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

    useEffect(() => {
        if (chatMessages.length === 0) return;

        const latestMessage = chatMessages[chatMessages.length - 1]

        const messageId = `${latestMessage.timestamp}-${latestMessage.sender}-${latestMessage.content}`;

        // Skip if we already showed this message
        if (messageId === lastMessageId) {
            return;
        }

        const isFromThisPlayer = latestMessage.sender === player.userName;
        const isFromCurrentUser = latestMessage.sender === user?.username;


        if (!isFromCurrentUser && isFromThisPlayer) {
            setLastMessageId(messageId)
            const avatarPos = avatarRef.current?.getBoundingClientRect();

            if (!avatarPos) return;
            toast.custom(
                () => (
                    <div
                        style={{
                            position: "fixed",
                            top: `${avatarPos.top - 50}px`,
                            left: `${avatarPos.left - 350}px`,
                            zIndex: 9999,
                            pointerEvents: "none",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-3 w-44 select-none"
                        >
                            <div className="flex items-start gap-2">
                                <img
                                    src={`/images/avatars/${avatar}.png`}
                                    alt={latestMessage.sender}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{latestMessage.sender}</p>
                                    <p className="text-sm text-muted-foreground break-words">
                                        {latestMessage.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ),
                {
                    duration: 2000,
                    position: "top-center",
                }
            );
        }
    }, [chatMessages, user?.username, avatar, lastMessageId, player.userName]);

    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-row items-center"}>
            <div id="${slotId}-username" className="text-center font-bold mb-2">
                <img ref={avatarRef} src={`/images/avatars/${avatar}.png`} alt={`${player.userName}'s avatar`} className={"h-14 w-14"}/>
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
                                  selectedCard={selectedCard}
                                  topPlayer={true}  />
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
};

export default TopPlayers;