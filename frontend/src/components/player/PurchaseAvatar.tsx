import {useEffect, useState} from "react";
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
import {useUser} from "@/components/providers/UserProvider.tsx";
import {ShoppingCart} from "lucide-react";

const PurchaseAvatar = () => {
    const avatars = useAvatarList();
    const [newAvatar] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const {user, setUser} = useUser();
    const [avatarSale, setAvatarSale] = useState<string[]>([]);

    useEffect(() => {
        unOwnedAvatars();
    }, [user]);

    const unOwnedAvatars = () => {
        if (!user) return null;

        const ownedAvatars = user.avatar.split('-');
        setAvatarSale(avatars.filter(avatar => !ownedAvatars.includes(avatar)))
    }


    async function handlePurchaseAvatar(selectedAvatar: string){
        if (!user) return null;

            try {
                const updatedUser = {...user, avatar: selectedAvatar}
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
                <ShoppingCart size={16}/>
                Purchase New Avatar
            </Button>
            <div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Buy a new Avatar</DialogTitle>
                            <DialogDescription/>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="avatar">Avatar Shop</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {avatarSale.map((src, index) => (
                                            <img
                                                key={index}
                                                onClick={() => {
                                                    handlePurchaseAvatar(src);
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

export default PurchaseAvatar;