import {useState} from "react";
import {Edit2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useUser} from "@/components/providers/UserProvider.tsx";
import {useCardThemes} from "@/components/player/CardList.tsx";

const Avatar = () => {
    const themes = useCardThemes();
    const [newTheme] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const {user, setUser} = useUser();


    async function handleNewTheme(selectedCardTheme: string){
        if (!user) return null;

            try {
                const updatedUser = {...user, card: selectedCardTheme}
                setUser(updatedUser)
                await fetch("http://localhost:8080/api/new_user", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updatedUser)
                })
            } catch (err) {
                console.error(err)
            }
            setEditDialogOpen(false);

    }




    return (
        <>
            <Button
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    setEditDialogOpen(true);
                }}
                className="gap-2"
            >
                <Edit2 size={16}/>
                Edit Cards
            </Button>
            <div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Card Theme</DialogTitle>
                            <DialogDescription/>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="cardTheme">Themes</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {themes.map((src, index) => (
                                            <img
                                                key={index}
                                                onClick={() => {
                                                    handleNewTheme(src);
                                                }}
                                                src={`/images/cardTheme/${src}/card-back.png`}
                                                alt={`Card Theme ${index + 1}`}
                                                className={`w-16 h-16 rounded-full cursor-pointer transition
                                                    hover:scale-105 border-2
                                                    ${newTheme === src ? "border-blue-500 ring-2 ring-blue-300" 
                                                    : "border-transparent"}`}
                                            />

                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="destructive" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default Avatar;