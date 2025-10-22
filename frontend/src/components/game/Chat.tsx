import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    Sheet,
    SheetClose,
    SheetContent, SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";
import {useState} from "react";

const Chat = () => {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <SheetTrigger asChild>
                <Button
                    onClick={() => setChatOpen(prev => !prev)}
                >
                    Chat
                </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={"chat-description"}>
                <SheetHeader>
                    <SheetTitle>Chat</SheetTitle>
                </SheetHeader>
                <SheetDescription/>
                <div id="chat-description" className="sr-only">
                    Logs all recent user's messages.
                </div>

                <div className="bg-muted p-4 rounded-2xl shadow-lg flex-1 overflow-y-auto">
                    <div id="chat-text" className="overflow-y-auto space-y-2 text-muted-foreground">
                        <p>Yes</p>
                    </div>
                </div>
                <SheetFooter className={"flex"}>
                    <Input type={"text"} className={"bg-foreground"}></Input>
                    <div className={"gap-4"}>
                        <Button>Submit</Button>
                        <SheetClose asChild>
                            <Button className={"bg-accent"}>Cancel</Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Chat;