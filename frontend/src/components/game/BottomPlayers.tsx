import CardHand from "@/components/game/cards/CardHand.tsx";
import type {Player, CardType} from "@/components/Interfaces.tsx";
import {useEffect, useState} from "react";

interface BottomPlayersProp {
    player: Player,
    hand: CardType[] | undefined,
}
const BottomPlayers = ({player, hand} : BottomPlayersProp) => {
    const [avatar, setAvatar] = useState("dog")

    useEffect(() => {
        async function fetchAvatar() {
            try {
                const response = await fetch("/api/getUser" + player.userId, {
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
    }, [player]);


    console.log(player)

    return (
        <div className={"bg-foreground rounded-lg p-2 border shadow flex flex-col items-center"}>
            <div className={"flex justify-center grid-flow-col grid-rows-1"}/>
            <div className="flex justify-center grid-flow-col grid-rows-1">
                <div id="${slotId}-cards"><CardHand initcards={hand}/></div>
                <div id="${slotId}-draw" className="flex justify-center"></div>
            </div>
            <div id="${slotId}-username" className="text-center font-bold mb-2 flex flex-col">
                <img src={`/images/avatars/${avatar}.png`} alt={`${player.userName}'s avatar`} className={"h-14 w-14"}/>{player.userName}
            </div>

        </div>
    );
};

export default BottomPlayers;