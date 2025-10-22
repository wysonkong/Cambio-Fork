import {Button} from "@/components/ui/button.tsx";
import {
    Sheet,
    SheetContent, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";

const ActionLog = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className={"bg-chart-3 hover:bg-chart-3/80 focus:ring-chart-3/50"}>Action Log</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Action Log</SheetTitle>
                </SheetHeader>
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