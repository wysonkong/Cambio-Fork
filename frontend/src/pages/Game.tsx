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
    const [bottomRightPlayers, setBottomRightPlayers] = useState<Player[]> ();
    const [bottomLeftPlayers, setBottomLeftPlayers] = useState<Player[]> ();
    const [currentPlayer, setCurrentPlayer] = useState<Player> ();

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
        let playersSorted = [];
        let bRPlayers = [];
        let bLPlayers = []
        let tPlayers = [];
        let me = null;
        let myIndex = 0;
        players.forEach((p : Player, index ) => {
            if(p.userId === user?.id) {
                myIndex = index
            }
        })
        players.forEach((p : Player, index) => {
            if(index >= myIndex) {
                playersSorted.push(p);
            }
        })
        players.forEach((p : Player, index ) => {
           if(index < myIndex) {
               playersSorted.push(p)
           }
        });

        me = playersSorted[0];
        playersSorted.splice(0, 1);
        console.log(me);
        console.log(playersSorted);
        switch(playersSorted.length) {
            case 1:
                tPlayers.push(playersSorted[0]);
                break;
            case 2:
                tPlayers.push(playersSorted[0]);
                tPlayers.push(playersSorted[1]);
                break;
            case 3:
                tPlayers.push(playersSorted[0]);
                tPlayers.push(playersSorted[1]);
                bRPlayers.push(playersSorted[2]);
                break;
            case 4:
                tPlayers.push(playersSorted[0]);
                tPlayers.push(playersSorted[1]);
                tPlayers.push(playersSorted[2]);
                bRPlayers.push(playersSorted[3]);
                break;
            case 5:
                bLPlayers.push(playersSorted[0]);
                tPlayers.push(playersSorted[1]);
                tPlayers.push(playersSorted[2]);
                tPlayers.push(playersSorted[3]);
                bRPlayers.push(playersSorted[4]);
                break;
        }
        console.log(me);
        setTopPlayers(tPlayers);
        setBottomRightPlayers(bRPlayers);
        setBottomLeftPlayers(bLPlayers);
        setCurrentPlayer(me);
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
                            <TopPlayers key={index} player={player} hand={topPlayers[index].hand}/>
                        </div>
                    ))}
                </div>

                <div className={"relative flex justify-center items-center flex-1 m-8"}>
                    <DeckArea discard={gameState?.gameStarted ? gameState?.prevCard : null} gameId={Number(gameId)}/>
                </div>
                <div className={"flex justify-center gap-8"}>
                    <div className={"flex justify-center gap-8"}>
                        {bottomLeftPlayers?.map((player, index) => (
                            <div className={""}>
                                <BottomPlayers key={index} player={player} hand={bottomLeftPlayers[index].hand}/>
                            </div>
                        ))}

                    </div>
                    <div className={"flex justify-center gap-8"}>
                        {currentPlayer && <div className={""}>
                                <BottomPlayers key={0} player={currentPlayer} hand={currentPlayer?.hand}/>
                            </div>}

                    </div>

                    <div className={"flex justify-center gap-8"}>
                        {bottomRightPlayers?.map((player, index) => (
                            <div className={""}>
                                <BottomPlayers key={index} player={player} hand={bottomRightPlayers[index].hand}/>
                            </div>
                        ))}

                    </div>
                </div>


                <div className={""}><GameControls gameId={Number(gameId)} handleStart={handleStart}/></div>
            </div>

        </div>
    );
};

export default Game;