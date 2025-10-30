import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/components/providers/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";


const Home = () => {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    return (

        <div className={"bg-no-repeat bg-center bg-cover h-screen flex items-center justify-center"}>
            <div className={"rounded-lg text-center text-white opacity-75"}>
                <div className="sm:mb-8 sm:flex sm:justify-center">
                    <Button asChild
                            onClick={() => navigate("/Rules")}
                            className="relative rounded-full px-3 py-1 text-sm/6 text-primary-foreground ring-1 ring-white/10 hover:ring-white/20">
                        <span>Don't know how to play?</span>
                    </Button>
                </div>
                <h1 className={"text-6xl font-bold mb-4 text-primary"}>Cambio Card Game</h1>
                <p className={"text-xl text-background-foreground mb-4"}>Welcome to our Cambio site. Read the rules and enjoy a game</p>
                <div className={"flex flex-wrap items-center justify-center gap-2 mb-32"}>
                    <Button asChild className={"bg-primary"} onClick={() => navigate(isLoggedIn ? "/JoinGame" : "/Login")}>
                        <span>Play a Game</span>
                    </Button>
                </div>
            </div>

        </div>

    );
};

export default Home;