import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

const Chat = () => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent className={"bg-foreground"}>
                <div className=" mx-auto h-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className={"text-background"}>Chat</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className={"flex"}>
                        <Input type={"text"} className={""}></Input>
                        <div className={"gap-4"}>
                            <Button>Submit</Button>
                            <DrawerClose asChild>
                                <Button className={"bg-accent"}>Cancel</Button>
                            </DrawerClose>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>

        </Drawer>
    );
};

export default Chat;