import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";

const Error = () => {
    return (
        <div className={"bg-no-repeat bg-center bg-cover h-screen flex items-center justify-center"}>
            <div className={"rounded-lg text-center text-white opacity-75"}>
                <h1 className={"text-6xl font-bold mb-4 text-primary"}>Sorry this page is not currently working</h1>
                <p className={"text-xl text-background-foreground mb-4"}>Let us know</p>
                <div className={"flex flex-wrap items-center justify-center gap-2 mb-32"}>
                    <Button asChild className={"bg-primary"}>
                        <Link to={"/"} className={"text-primary-foreground"}>Return Home</Link>
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default Error;