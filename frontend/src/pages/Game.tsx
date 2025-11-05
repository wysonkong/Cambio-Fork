import DeckArea from "@/components/game/cards/DeckArea.tsx";
import BottomPlayers from "@/components/game/BottomPlayers.tsx";
import GameControls from "@/components/game/GameControls.tsx";
import TopPlayers from "@/components/game/TopPlayers.tsx";
import React, {useEffect, useRef, useState} from 'react';
import type {endPlayer, GameState, Player, SwapState} from "@/components/Interfaces.tsx";
import {useWebSocket} from '@/components/providers/WebSocketProvider';
import {useUser} from "@/components/providers/UserProvider.tsx";
import ConfettiPos from "@/components/Confetti.tsx";
import {Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet} from "@/components/ui/field.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useNavigate} from "react-router-dom";


const Game = () => {

    const {gameState, sendAction} = useWebSocket();
    const gameId = Number(sessionStorage.getItem("currentGame"));
    const [topPlayers, setTopPlayers] = useState<Player[]>();
    const [bottomRightPlayers, setBottomRightPlayers] = useState<Player[]>();
    const [bottomLeftPlayers, setBottomLeftPlayers] = useState<Player[]>();
    const [currentPlayer, setCurrentPlayer] = useState<Player>();
    const [selectedCard, setSelectedCard] = useState<{ userId: number, index: number } | null>(null);
    const [instructions, setInstructions] = useState<string | null>(null)
    const [winnerIds, setWinnerIds] = useState<number[]>([]);
    const [showGameOverDialog, setShowGameOverDialog] = useState(false);



    const navigate = useNavigate();
    const {user} = useUser();

    const [swapModeActive, setSwapModeActive] = useState(false);
    const [stickModeActive, setStickModeActive] = useState(false);
    const [peekPlusActive, setPeekPlusActive] = useState(false);
    const [giveModeActive, setGiveModeActive] = useState(false);
    const [swapPendingModeActive, setSwapPendingModeActive] = useState(false);
    const [peekMeActive, setPeekMeActive] = useState(false);
    const [peekAnyActive, setPeekAnyActive] = useState(false);
    const [lastStickPlayer, setLastStickPlayer] = useState<number | null>(null);
    const [cambioPlayer, setCambioPlayer] = useState<Player | null>(null);
    const drawRef = useRef<HTMLImageElement>(null);

    const [swapState, setSwapState] = useState<SwapState>({
        originIndex: null,
        originUserId: null,
        destinationIndex: null,
        destinationUserId: null
    });


    useEffect(() => {
        if (gameState) {
            console.log('Game state updated!', gameState);
            render(gameState);
            setModes(gameState)
        }

        if (gameState?.winners && gameState.winners.length > 0) {
            const ids = gameState.winners.map((winner: endPlayer) => winner.id);
            setWinnerIds(ids);
            setShowGameOverDialog(true);
        }
    }, [gameState]);


    const handleAction = (actionType: string, payload: Map<string, Object>) => {
        sendAction(Number(gameId), actionType, payload);
    };

    const render = (gameState: GameState) => {
        let players = gameState.players;
        let playersSorted: any[] = [];
        let bRPlayers = [];
        let bLPlayers = []
        let tPlayers = [];
        let me = null;
        let myIndex = 0;
        players.forEach((p: Player, index) => {
            if (p.userId === user?.id) {
                myIndex = index
            }
        })
        players.forEach((p: Player, index) => {
            if (index >= myIndex) {
                playersSorted.push(p);
            }
        })
        players.forEach((p: Player, index) => {
            if (index < myIndex) {
                playersSorted.push(p)
            }
        });

        me = playersSorted[0];
        playersSorted.splice(0, 1);
        switch (playersSorted.length) {
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
        setTopPlayers(tPlayers);
        setBottomRightPlayers(bRPlayers);
        setBottomLeftPlayers(bLPlayers);
        setCurrentPlayer(me);
    }


    const setModes = (gameState: GameState) => {
        setCambioPlayer(gameState.cambioPlayer)
        if (swapPendingModeActive) {
            console.log("swap pending active")
        }
        let myIndex = 0;
        gameState.players.forEach((p: Player, index) => {
            if (p.userId === user?.id) {
                myIndex = index
            }
        })
        if (myIndex === gameState.currentTurn) {
            switch (gameState.specialMove) {
                case 1:
                    setInstructions("Played a 7 or 8, choose one of your cards to peek");
                    setPeekMeActive(true);
                    break;
                case 2:
                    setInstructions("Played a 9 or 10, choose someone else's card to peek");
                    setPeekAnyActive(true);
                    break;
                case 3:
                    setInstructions("Played a Jack or Queen, select card you want to swap");
                    setSwapModeActive(true);
                    break;
                case 4:
                    setInstructions("Played a King, first select a card to peek");
                    setPeekPlusActive(true);
                    break;
            }
            if (gameState.tempTurn) {
                setInstructions("Good stick! Pick one of your cards to gice!");
                setGiveModeActive(true);
            }
        }
    }


    const handleCardClick = (userId: number, index: number) => {
        let retry = false;

        if (userId === cambioPlayer?.userId) {
            retry = true;
        }

        if (!retry) {
            if (swapModeActive && !stickModeActive && !peekPlusActive) {
                if (swapState.originIndex === null) {
                    setSwapState({...swapState, originUserId: userId, originIndex: index});
                    setSelectedCard({userId, index})
                    console.log("Origin card:", index, "User:", userId);
                    return;
                }
                if (swapState.destinationIndex === null) {
                    sendAction(gameId, "SWAP", {
                        origin: swapState.originIndex,
                        originUserId: swapState.originUserId,
                        destination: index,
                        destinationUserId: userId
                    });
                    setSelectedCard(null);
                }
            } else if (stickModeActive) {
                if (swapState.originIndex === null) {
                    setSwapState({...swapState, originUserId: userId, originIndex: index});
                    console.log("Stick card:", index, "User:", userId);
                    setLastStickPlayer(userId);
                    sendAction(gameId, "STICK", {origin: index, originUserId: userId});
                }
            } else if (giveModeActive) {
                if (swapState.originIndex === null) {
                    setSwapState({
                        ...swapState,
                        originUserId: userId,
                        originIndex: index,
                        destinationUserId: lastStickPlayer
                    });
                    if (userId === user?.id) {
                        sendAction(gameId, "GIVE", {
                            origin: index,
                            originUserId: userId,
                            destinationUserId: lastStickPlayer
                        });
                    } else retry = true;
                }
            } else if (swapPendingModeActive) {
                if (swapState.destinationIndex === null) {
                    if (userId === user?.id) {
                        sendAction(gameId, "SWAP_PENDING", {
                            destination: index,
                            destinationUserId: userId
                        });
                    } else {
                        setInstructions("You can only swap your pending card with one of your cards, try again.");
                        retry = true;
                    }
                }
            } else if (peekMeActive) {
                if (userId === user?.id) {
                    sendAction(gameId, "PEEK", {id: userId, idx: index});
                    console.log("Peeked card", index, "for userId", userId);
                } else {
                    setInstructions("You can only peek your own cards.");
                }
            } else if (peekAnyActive) {
                sendAction(gameId, "PEEK", {id: userId, idx: index});
            } else if (peekPlusActive) {
                sendAction(gameId, "PEEK_PLUS", {id: userId, idx: index});
            }
        }

        // Reset state after the click
        setSwapState({
            originIndex: null,
            originUserId: null,
            destinationIndex: null,
            destinationUserId: null
        });

        // End turn if not retrying
        if (!retry) {
            if (!peekPlusActive) {
                endTurn();
                setInstructions("")
            } else {
                endTurn();
                setSwapModeActive(true);
                setInstructions("Choose a card to swap");
            }
        } else {
            setInstructions("Illegal move, try again.");
        }
    };

    const endTurn = () => {
        setPeekMeActive(false);
        setPeekAnyActive(false);
        setPeekPlusActive(false);
        setSwapModeActive(false);
        setStickModeActive(false);
        setSwapPendingModeActive(false);
        setGiveModeActive(false);
    }


    const handleStart = () => {
        console.log("Start game pushed");
        const payload = new Map<string, Object>();
        handleAction("START", payload);
    }

    const handleDraw = () => {
        console.log("Drew from deck");
        const payload = new Map<string, Object>();
        handleAction("DRAW_DECK", payload);
    }

    const handleDiscard = () => {
        console.log("discarded");
        const payload = new Map<string, Object>();
        handleAction("DISCARD_PENDING", payload);
    }

    const handleSwap = () => {
        setSwapPendingModeActive(true)
    }

    const handleCambio = () => {
        console.log("called Cambio");
        const payload = new Map<string, Object>();
        handleAction("CALL_CAMBIO", payload);
    }

    const handleStick = () => {
        setStickModeActive(true);
    }


    return (
        <>
            {(gameState?.winners && winnerIds.length > 0) && (
                <>
                    {winnerIds.includes(user?.id as number) && <ConfettiPos/>}
                    <Dialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
                        <FieldGroup>
                            <DialogTitle>End Game Dialog</DialogTitle>
                            <DialogContent aria-describedby={"Game Ended"} onEscapeKeyDown={() => setShowGameOverDialog(false)}>
                                <DialogHeader>{winnerIds.includes(user?.id as number) ? "You Won!" : "You Lost"}</DialogHeader>
                                <FieldSet>
                                    <FieldSeparator/>
                                        <FieldSet>
                                            <span>Your Stats:</span>
                                            <span>{`Total Wins: ${user?.wins}`}</span>
                                            <span>{`Total Losses: ${user?.loses}`}</span>
                                        </FieldSet>
                                </FieldSet>
                                <FieldSeparator/>
                                <Field orientation="horizontal">
                                    <Button onClick={() => navigate("/JoinGame")}>Play Again</Button>
                                </Field>
                            </DialogContent>
                        </FieldGroup>
                    </Dialog>
                </>
            )}
            <div className="w-screen h-screen flex items-center justify-center">
                <div className={"flex-1 flex flex-col items-center justify-start overflow-y-auto relative"}>
                    <div className={"flex justify-center gap-8"}>
                        {topPlayers?.map((player, index) => (
                            <TopPlayers key={index} player={player}
                                        hand={topPlayers[index].hand}
                                        handleClick={handleCardClick}
                                        selectedCard={selectedCard}
                            />
                        ))}
                    </div>

                    <div className={"relative flex justify-center items-center flex-1 m-8"}>
                        <DeckArea drawRef={drawRef} discard={gameState?.gameStarted ? gameState?.prevCard : null}
                                  gameId={Number(gameId)}/>
                    </div>
                    <div className={"flex justify-center gap-8"}>
                        <div className={"flex justify-center gap-8"}>
                            {bottomLeftPlayers?.map((player, index) => (
                                <BottomPlayers key={index} player={player}
                                               hand={bottomLeftPlayers[index].hand}
                                               handleClick={handleCardClick}
                                               selectedCard={selectedCard}
                                               drawRef={d}
                                />
                            ))}

                        </div>
                        <div className={"flex justify-center gap-8"}>
                            {currentPlayer && <div className={""}>
                                <BottomPlayers key={0} player={currentPlayer}
                                               hand={currentPlayer?.hand}
                                               handleClick={handleCardClick}
                                               selectedCard={selectedCard}
                                />
                            </div>}

                        </div>

                        <div className={"flex justify-center gap-8"}>
                            {bottomRightPlayers?.map((player, index) => (
                                <div className={""}>
                                    <BottomPlayers key={index} player={player}
                                                   hand={bottomRightPlayers[index].hand}
                                                   handleClick={handleCardClick}
                                                   selectedCard={selectedCard}
                                    />
                                </div>
                            ))}

                        </div>
                    </div>
                    <span className={"bg-foreground"}>{instructions}</span>


                    <div className={""}><GameControls gameId={Number(gameId)}
                                                      handleStart={handleStart}
                                                      handleDraw={handleDraw}
                                                      handleDiscard={handleDiscard}
                                                      handleSwap={handleSwap}
                                                      handleCambio={handleCambio}
                                                      handleStick={handleStick}/>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Game;