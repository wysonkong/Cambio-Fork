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
import React, {useEffect, useState} from "react";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";
import type {ChatMessage} from "@/components/Interfaces.tsx";


interface ChatProps {
    gameId?: number | null
}

const Chat = ({gameId}: ChatProps) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const {stompClient, chatMessages, sendMessage} = useWebSocket();
    const {user} = useUser();
      const {chatMessages, sendMessage} = useWebSocket();

    useEffect(() => {
        if (!stompClient) return;


        setMessages(chatMessages)


    }, [chatMessages]);

    // Chat.tsx
    const handleInput = (e:React.FormEvent) => {
        e.preventDefault()
        if (!stompClient || !input.trim() || !gameId) return;

        sendMessage(gameId, input);

        setInput("");
    };



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
                        {messages?.map((msg, index) => (
                            <p key={index}>
                                {msg.sender === user?.username ? "You: " : `${msg.sender}: `}{msg.content}
                            </p>
                        ))}
                    </div>
                </div>
                <SheetFooter className={"flex"}>
                    <form onSubmit={handleInput}>
                    <Input
                        type={"text"}
                        className={"bg-foreground"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></Input>
                    <div className={"gap-4"}>
                        <Button>Submit</Button>
                        <SheetClose asChild>
                            <Button className={"bg-accent"}>Cancel</Button>
                        </SheetClose>
                    </div>
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Chat;