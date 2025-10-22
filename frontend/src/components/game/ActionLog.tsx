import {Button} from "@/components/ui/button.tsx";
import {
    Sheet,
    SheetContent, SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";
import {useState} from "react";

const ActionLog = () => {
    const [actionLogOpen, setActionLogOpen] = useState(false);

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
                        <p>Yes</p>
                    </div>
                </div>
                <SheetFooter/>
            </SheetContent>
        </Sheet>
    );
};

export default ActionLog;