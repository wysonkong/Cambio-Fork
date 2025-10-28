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
import {useEffect, useState} from "react";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";

interface ChatMessage {
    id: number;
    sender: number;
    message: string;
    timestamp?: Date;
}

interface ChatProps {
    gameId?: number | null
}

const Chat = ({gameId}: ChatProps) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const {stompClient, sendAction} = useWebSocket();
    const {user} = useUser();

    useEffect(() => {
        if (!stompClient) return;

        const sub = stompClient.subscribe(`/topic/game.${gameId}.chat`, (message) => {
            const chatMsg: ChatMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, chatMsg])
        });

        return () => sub.unsubscribe();
    }, [stompClient, gameId]);

    const handleInput = () => {
        if (!stompClient || !input.trim()) return;
        console.log(input);
        sendAction(gameId, "CHAT", {message: input})
    }


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
                        {messages.map((msg, index) => (
                            <p key={index}>{msg.sender === user?.id ? `You` : `${msg.sender}: `} {msg.message}</p>
                        ))}
                    </div>
                </div>
                <SheetFooter className={"flex"}>
                    <Input
                        type={"text"}
                        className={"bg-foreground"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></Input>
                    <div className={"gap-4"}>
                        <Button onClick={handleInput}>Submit</Button>
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