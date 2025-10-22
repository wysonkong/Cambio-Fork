import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";

const Chat = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Chat</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Chat</SheetTitle>
                </SheetHeader>
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