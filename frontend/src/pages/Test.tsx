import DeckArea from "@/components/game/DeckArea.tsx";
import BottomPlayers from "@/components/game/BottomPlayers.tsx";
import GameControls from "@/components/game/GameControls.tsx";
import TopPlayers from "@/components/game/TopPlayers.tsx";
import {useState} from 'react';

const Test = () => {
    const [players, setPlayers] = useState([1, 2, 3, 4, 5, 6]);
    const [chatOpen, setChatOpen] = useState(false);

    const middleIndex = Math.ceil(players.length / 2);
    const topPlayers = players.slice(0, middleIndex);
    const bottomPlayers = players.slice(middleIndex);


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className={"flex-1 flex flex-col items-center justify-start overflow-y-auto relative"}>
                <div className={"flex justify-center gap-8"}>
                    {topPlayers.map((_player, index) => (
                        <div className={""}>
                            <TopPlayers key={index}/>
                        </div>
                    ))}
                </div>

                <div className={"relative flex justify-center items-center flex-1 m-8"}>
                    <DeckArea/>
                </div>

                <div className={"flex justify-center gap-8"}>
                    {bottomPlayers.map((_player, index) => (
                        <div className={""}>
                            <BottomPlayers key={index}/>
                        </div>
                    ))}

                </div>



                <div className={""}><GameControls/></div>
            </div>

        </div>
    );
};

export default Test;