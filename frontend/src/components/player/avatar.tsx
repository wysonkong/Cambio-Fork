import {useEffect, useState} from "react";
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
import {useAvatarList} from "@/components/player/avatarList.tsx";
import type {User} from "@/components/Interfaces.tsx";

const Avatar = () => {
    const avatars = useAvatarList();
    const userId = localStorage.getItem("userId")
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);


    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch("http://localhost:8080/api/getUser" + userId, {
                    method: "GET",
                });
                const item = await response.json();
                setUser(item);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        }
        if(user) fetchProfile();
    }, []);

    async function handleNewAvatar(){
        if (newAvatar && user) {
            user.avatar = newAvatar
            try {
                await fetch("http://localhost:8080/api/new_user", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(user)
                })
                window.location.reload();
            } catch (err) {
                console.error(err)
            }
            setEditDialogOpen(false);
        }
    }




    return (
        <>
            <Button
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    //setNewAvatar(avatar);
                    setEditDialogOpen(true);
                }}
                className="gap-2"
            >
                <Edit2 size={16}/>
                Edit Avatar
            </Button>
            <div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Your Avatar</DialogTitle>
                            <DialogDescription/>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="avatar">Avatar</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {avatars.map((src, index) => (
                                            <img
                                                key={index}
                                                onClick={() => {
                                                    setNewAvatar(src);
                                                    handleNewAvatar();
                                                }}
                                                src={`/images/avatars/${src}.png`}
                                                alt={`Avatar ${index + 1}`}
                                                className={`w-16 h-16 rounded-full cursor-pointer transition
                                                    hover:scale-105 border-2
                                                    ${newAvatar === src ? "border-blue-500 ring-2 ring-blue-300" 
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