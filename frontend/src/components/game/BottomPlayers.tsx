import CardHand from "@/components/game/cards/CardHand.tsx";
import type {Player, CardType} from "@/components/Interfaces.tsx";
import {useEffect, useState} from "react";
import {Card} from "@/components/game/cards/Card.tsx";

interface BottomPlayersProp {
    player: Player,
    hand: CardType[] | undefined,
    handleClick: (userId: number, index: number) => void;
}
const BottomPlayers = ({player, hand, handleClick} : BottomPlayersProp) => {
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


    console.log(player)

    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-row items-center"}>
            <div className={"flex justify-center grid-flow-col grid-rows-1"}/>
            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id={"${slotId}-cards"}><CardHand initcards={hand} thisPlayer={player} handleClick={handleClick}/></div>
            </div>
            <div id="${slotId}-username" className="text-center font-bold mb-2 flex flex-col">
                <img src={`/images/avatars/${avatar}.png`} alt={`${player.userName}'s avatar`} className={"h-14 w-14"}/>
                {player.userName}
                {player.pending && <div id={"${slotId}-draw"} className="flex justify-center"><Card card={pending}/></div>}
            </div>

        </div>
    );
};

export default BottomPlayers;