import {Button} from "@/components/ui/button.tsx";
import {
    Sheet,
    SheetContent, SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";
import {useEffect, useRef, useState} from "react";
import type {ActionLog} from "@/components/Interfaces.tsx";
import {useWebSocket} from "@/components/providers/WebSocketProvider.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";

const ActionLog = () => {
    const [actionLogOpen, setActionLogOpen] = useState(false);
    const {stompClient, actionLogs} = useWebSocket();
    const {user} = useUser();
    const logEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!stompClient) return;

        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [actionLogs]);

    const formatActionMessage = (log: ActionLog) => {
        const username = log.username === user?.username ? "You" : log.username;

        switch (log.type) {
            case "START":
                return `${username} started the game`;

            case "CALL_CAMBIO":
                return `${username} called CAMBIO!`;

            case "DRAW_DECK":
                return `${username} drew from the deck`;

            case "SWAP":
                return `${username} swapped cards another player`;

            case "SWAP_PENDING":
                return `${username} swapped card to their hand`;

            case "DISCARD_PENDING":
                return `${username} discarded their card`;

            case "PEEK":
            case "PEEK_PLUS":
                return `${username} peeked at a card`;

            case "STICK":
                return `${username} stuck a card`;

            case "GIVE":
                return `${username} gave a card`;

            default:
                return `${username} performed an action`;
        }
    };

    return (
        <Sheet open={actionLogOpen} onOpenChange={setActionLogOpen}>
            <SheetTrigger asChild>
                <Button
                    className={"bg-chart-3 hover:bg-chart-3/80 focus:ring-chart-3/50"}
                        onClick={() => setActionLogOpen(prev => !prev)}
                >
                    Action Log
                </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={"action-log-description"}>
                <SheetHeader>
                    <SheetTitle>Action Log</SheetTitle>
                </SheetHeader>
                <SheetDescription/>

                <div id="action-log-description" className="sr-only">
                    Logs all recent user actions for reference.
                </div>

                <div className="bg-muted p-4 rounded-2xl shadow-lg flex-1 overflow-y-auto">
                    <div id="action-log" className="overflow-y-auto space-y-2 text-muted-foreground">
                        {actionLogs.length === 0 ? (
                            <p className="text-center text-muted-foreground/50">No actions yet</p>
                        ) : (
                            actionLogs.map((msg, index) => (
                                <p key={index}>
                                    {formatActionMessage(msg)}
                                </p>
                            ))
                        )}
                    </div>
                </div>
                <SheetFooter/>
            </SheetContent>
        </Sheet>
    );
};

export default ActionLog;