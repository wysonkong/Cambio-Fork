import CardHand from "@/components/game/cards/CardHand.tsx";
import type {Player, CardType} from "@/components/Interfaces.tsx";
import {type RefObject, useEffect, useState} from "react";
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
    cardRefs: RefObject<Map<string, HTMLDivElement>>;
    pendingRefs: RefObject<Map<string, HTMLDivElement>>;
    avatarRefs: RefObject<Map<string, HTMLDivElement>>
}

const BottomPlayers = ({player, hand, handleClick, selectedCard, cardRefs, pendingRefs, avatarRefs}: BottomPlayersProp) => {
    const [avatar, setAvatar] = useState("dog")
    const [pending, setPending] = useState(player.pending);
    const {chatMessages} = useWebSocket();
    const {user} = useUser();
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
    }, [player, chatMessages]);

    // useEffect(() => {
    //     if (!player.pending) return;
    //
    //     // wait until next frame to ensure refs are ready
    //     const id = requestAnimationFrame(() => {
    //         console.log("drawRef: ", drawRef)
    //         if (drawRef?.current && avatarRef.current) {
    //             const deckPos = drawRef.current.getBoundingClientRect();
    //             const avatarPos = avatarRef.current.getBoundingClientRect();
    //             console.log("animation firing");
    //
    //             setAnimationStart({
    //                 x: deckPos.left - avatarPos.left,
    //                 y: deckPos.top - avatarPos.top,
    //             });
    //         } else {
    //             console.warn("Refs not ready yet:", drawRef?.current, avatarRef.current);
    //         }
    //     });
    //
    //     return () => cancelAnimationFrame(id);
    // }, [player.pending]);

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
            const avatarPos = avatarRefs.current.get(`${player.userId}-avatar`)?.getBoundingClientRect();

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
            <div className="flex justify-center grid-flow-col grid-rows-1" id={"${slotId}-cards"}>
                        <CardHand cardRefs={cardRefs} initcards={hand} thisPlayer={player} handleClick={handleClick}
                                  selectedCard={selectedCard}
                                  topPlayer={false}
                        />
            </div>
            <div ref={(el) => {
            if(el) avatarRefs.current.set(`${player.userId}-avatar`, el)
            else avatarRefs.current.delete(`${player.userId}-avatar`)}} id="${slotId}-username" className="text-center font-bold mb-2 flex flex-col">
                <img src={`/images/avatars/${avatar}.png`} alt={`${player.userName}'s avatar`} className={"h-14 w-14"}/>
                {player.userName}
                {player.pending &&
                    <div id={"${slotId}-draw"} className="flex justify-center">
                                    <Card ref={(el) => {
                                        if(el) pendingRefs.current.set(`${player.userId}-pending`, el);
                                        else pendingRefs.current.delete(`${player.userId}-pending`);
                                    }} card={pending} cardIndex={999} thisPlayerId={player.userId}/>
                    </div>}
            </div>

        </div>
    );
};

export default BottomPlayers;