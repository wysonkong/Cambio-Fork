import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Home = () => {
    return (

        <div className={"bg-no-repeat bg-center bg-cover h-screen flex items-center justify-center"}>
            <div className={"rounded-lg text-center text-white opacity-75"}>
                <div className="sm:mb-8 sm:flex sm:justify-center">
                    <Button asChild className="relative rounded-full px-3 py-1 text-sm/6 text-primary-foreground ring-1 ring-white/10 hover:ring-white/20">
                        <Link to={"#"}>Don't know how to play?</Link>
                    </Button>
                </div>
                <h1 className={"text-6xl font-bold mb-4 text-primary"}>Cambio Card Game</h1>
                <p className={"text-xl text-background-foreground mb-4"}>Welcome to our Cambio site. Read the rules and enjoy a game</p>
                <div className={"flex flex-wrap items-center justify-center gap-2 mb-32"}>
                    <Button asChild className={"bg-primary"}>
                        <Link to={"#"} className={"text-primary-foreground"}>Play a Game</Link>
                    </Button>
                </div>
            </div>

        </div>

    );
};

export default Home;