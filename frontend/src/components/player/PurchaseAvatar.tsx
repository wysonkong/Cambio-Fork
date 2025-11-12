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
import {useUser} from "@/components/providers/UserProvider.tsx";
import {ShoppingCart} from "lucide-react";
import type {User} from "@/components/Interfaces.tsx";
import {toast} from "sonner";

const PurchaseAvatar = () => {
    const [avatars, setAvatars] = useState<Map<string, number> | null>(null);
    const [newAvatar] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const {user, refreshUser} = useUser();
    const [avatarSale, setAvatarSale] = useState<string[]>([]);

    useEffect(() => {
        if (!avatars) {
            fetch("http://localhost:8080/api/getAvatarPrices")
                .then((res) => res.json())
                .then((data: Record<string, number>) => {
                    // Convert object to Map
                    const map = new Map(Object.entries(data));
                    setAvatars(map);
                })
                .catch((err) => console.error("Error loading avatars:", err));
        }
        if (!avatars) return;
        unOwnedAvatars();
    }, [avatars]);

    const unOwnedAvatars = () => {
        if (!user) return null;
        const ownedAvatars = user.ownedAvatars.split('-');
        const allAvatars = Array.from(avatars.keys());
        setAvatarSale(allAvatars.filter(avatar => !ownedAvatars.includes(avatar)))
    }


    async function handlePurchaseAvatar(selectedAvatar: string, user: User) {
        if (!user) return null;

        try {
            const res = await fetch(`http://localhost:8080/api/purchaseAvatar${selectedAvatar}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            })
            if (!res.ok) throw new Error("Failed to purchase")
            const data = await res.json();
            if (data) {
                toast.success("Purchased avatar");
            } else {
                toast.error("Not enough funds");
            }

        } catch (err) {
            console.error(err)
        }
        setEditDialogOpen(false);
        await refreshUser();
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
                                            <div className={"grid grid-row"} key={src}>
                                                <img
                                                    key={index}
                                                    onClick={() => {
                                                        if (user) handlePurchaseAvatar(src, user);
                                                    }}
                                                    src={`/images/avatars/${src}.png`}
                                                    alt={`Avatar ${index + 1}`}
                                                    className={`w-16 h-16 rounded-full cursor-pointer transition
                                                    hover:scale-105 ${user?.balance > (avatars.get(src) ?? 0) ? "" : "grayscale-100"}` }
                                                />
                                                <h3 className={`flex justify-center ${user?.balance > (avatars.get(src) ?? 0) ? "" : "text-red-500"}`}>{avatars.get(src)}</h3>
                                            </div>

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