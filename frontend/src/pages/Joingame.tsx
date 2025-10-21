import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";

const Joingame = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-card p-6 rounded-lg">
                <form className="space-y-4">
                    <div className={""}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button"
                                        className="mt-3 w-full rounded-md bg-accent py-2.5 text-center font-semibold hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 transition"
                                        id="join-game">
                                    Join a Game
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Label htmlFor="joinCode" className={"mb-2"}>Game code</Label>
                                <Input
                                    id="joinCode"
                                    placeholder="Enter your code"
                                    className="col-span-2 h-8"
                                />
                                <Button type="submit"
                                        className="mt-3 w-full rounded-md bg-accent py-2.5 text-center font-semibold hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 transition"
                                        id="join-submit"
                                        // onSubmit={}
                                >
                                    Join
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button type="button"
                            className="mt-3 w-full rounded-md bg-accent py-2.5 text-center font-semibold hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 transition"
                            id="create-game"
                            // onClick={}
                    >
                        Create a Game
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Joingame;