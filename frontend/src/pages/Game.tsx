import DeckArea from "@/components/game/cards/DeckArea.tsx";
import BottomPlayers from "@/components/game/BottomPlayers.tsx";
import GameControls from "@/components/game/GameControls.tsx";
import TopPlayers from "@/components/game/TopPlayers.tsx";
import {useEffect, useState} from 'react';
import type {GameState, Player} from "@/components/Interfaces.tsx";
import { useWebSocket } from '@/components/providers/WebSocketProvider';
import {useUser} from "@/components/providers/UserProvider.tsx";


const Game = () => {

    const { gameState, sendAction} = useWebSocket();
    const gameId = sessionStorage.getItem("currentGame");
    const [topPlayers, setTopPlayers] = useState<Player[]>();
    const [bottomPlayers, setBottomPlayers] = useState<Player[]> ();
    const {user} = useUser();


    useEffect(() => {
        if (gameState) {
            console.log('Game state updated!', gameState);
            render(gameState);
        }
    }, [gameState]);


    const handleAction = (actionType: string, payload: Map<string, Object>) => {
        sendAction(Number(gameId), actionType, payload);
    };


    const render = (gameState: GameState) => {
        let players = gameState.players;
        let myIndex = null;
        let me = null;
        gameState.players.forEach((p : Player, index: number) => {
          if(p.userId === user?.id) {
              myIndex = index;
          }
        })
        if(myIndex) {
            me = players[myIndex];
            players.splice(myIndex,1)
        }
        const middleIndex = Math.ceil(players.length / 2);
        let tPlayers = players.slice(0, middleIndex);
        let bPlayers = players.slice(middleIndex);
        if(me) bPlayers.push(me);
        setTopPlayers(tPlayers);
        setBottomPlayers(bPlayers);

        console.log(gameState)
    }

    const handleStart = () => {
        console.log("Start game pushed");
        const payload = new Map<string, Object>();
        handleAction("START", payload);
    }


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className={"flex-1 flex flex-col items-center justify-start overflow-y-auto relative"}>
                <div className={"flex justify-center gap-8"}>
                    {topPlayers?.map((player, index) => (
                        <div className={""}>
                            <TopPlayers key={index} player={player} hand={gameState?.players[index].hand}/>
                        </div>
                    ))}
                </div>

                <div className={"relative flex justify-center items-center flex-1 m-8"}>
                    <DeckArea discard={gameState?.gameStarted ? gameState?.prevCard : null} gameId={Number(gameId)}/>
                </div>

                <div className={"flex justify-center gap-8"}>
                    {bottomPlayers?.map((player, index) => (
                        <div className={""}>
                            <BottomPlayers key={index} player={player} hand={gameState?.players[index].hand}/>
                        </div>
                    ))}

                </div>


                <div className={""}><GameControls gameId={Number(gameId)} handleStart={handleStart}/></div>
            </div>

        </div>
    );
};

export default Game;