import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useState} from "react";

const Joingame = () => {
    const {user} = useUser();
    const {connect} = useWebSocket();
    const navigate = useNavigate();
    const [input, setInput] = useState("");

    async function handleCreateGame() {
        if (!user) {
            console.log("User not ready")
            return;
        }
        console.log("Clicked create a game")
        try {
            const response = await fetch("http://localhost:8080/api/games/create", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({userId: user.id})
            });

            const data = await response.json();
            const gameId = data.gameId;
            console.log("created game with id of: " + gameId);
            sessionStorage.setItem("currentGame", gameId);

            await fetch("http://localhost:8080/api/games/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    username: user.username,
                    gameId: gameId
                })
            });
            connect(gameId)
            navigate(`/Game?gameId=${gameId}`)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleJoinGame(gameId: string) {
        if (!user) {
            console.log("User not ready");
            return;
        }
        try {
            await fetch("http://localhost:8080/api/games/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    username: user.username,
                    gameId: gameId
                })
            })
            connect(Number(gameId))
            navigate(`/Game?gameId=${gameId}`)
        } catch (err) {
            console.error(err)
        } finally {
            sessionStorage.setItem("currentGame", gameId);
            console.log("Joined game: " + gameId);
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-card p-6 rounded-lg">
                <form className="space-y-4">
                    <div className={""}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button"
                                        className="mt-3 w-full rounded-md bg-accent py-2.5 text-center font-semibold hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 transition"
                                        id="join-game"
                                >
                                    Join a Game
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Label htmlFor="joinCode" className={"mb-2"}>Game code</Label>
                                <Input
                                    id="joinCode"
                                    placeholder="Enter your code"
                                    className="col-span-2 h-8"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <Button
                                        className="mt-3 w-full rounded-md bg-accent py-2.5 text-center font-semibold hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 transition"
                                        id="join-submit"
                                        onClick={ async () => {
                                            console.log("clicked")
                                            await handleJoinGame(input)}
                                        }
                                >
                                    Join
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button type="button"
                            className="mt-3 w-full rounded-md bg-accent py-2.5 text-center font-semibold hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 transition"
                            id="create-game"
                            onClick={ async () => {
                                console.log("clicked")
                                await handleCreateGame()
                            }}
                    >
                        Create a Game
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Joingame;