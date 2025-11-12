import {useEffect, useState} from "react";
import {ShoppingCart} from "lucide-react";
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
import type {User} from "@/components/Interfaces.tsx";
import {toast} from "sonner";

const Avatar = () => {
    const [newTheme] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const {user, refreshUser} = useUser();
    const [cardSale, setCardSale] = useState<string[]>([])
    const [themes, setThemes] = useState<Map<string, number> | null>(null);


    useEffect(() => {
        if (!themes) {

            fetch("http://localhost:8080/api/getCardThemePrices")
                .then((res) => res.json())
                .then((data: Record<string, number>) => {
                    // Convert object to Map
                    const map = new Map(Object.entries(data));
                    setThemes(map);
                })
                .catch((err) => console.error("Error loading cards:", err));
        }
        if (!themes) return;
        unOwnedCards();
    }, [themes]);

    const unOwnedCards = () => {
        if (!user) return null;

        const ownedCards = user.ownedCards.split('-');
        const allThemes = Array.from(themes.keys());
        setCardSale(allThemes.filter(theme => !ownedCards.includes(theme)))
    }

    async function handlePurchaseCard(selectedCard: string, user: User) {
        if (!user) return null;

        try {
            const res = await fetch(`http://localhost:8080/api/purchaseCards${selectedCard}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            })
            if (!res.ok) throw new Error("Failed to purchase")
            const data = await res.json();
            if (data) {
                toast.success("Purchased cards");
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
                Purchase Cards
            </Button>
            <div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Card Shop</DialogTitle>
                            <DialogDescription/>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="cardTheme">Themes</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {cardSale.map((src, index) => (
                                            <div className={"grid grid-row"} key={src}>
                                                <img
                                                    key={index}
                                                    onClick={() => {
                                                        if (user) handlePurchaseCard(src, user);
                                                    }}
                                                    src={`/images/cardTheme/cardThemes/${src}.png`}
                                                    alt={`Card Theme ${index + 1}`}
                                                    className={`w-16 h-16 rounded-full cursor-pointer transition
                                                    hover:scale-105 ${user?.balance > (themes.get(src) ?? 0) ? "" : "grayscale-100"}`}

                                                />
                                                <h3 className={`flex justify-center ${user?.balance > (themes.get(src) ?? 0) ? "" : "text-red-500"}`}>{themes.get(src)}</h3>
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

export default Avatar;