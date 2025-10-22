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
import avatarList from "@/components/player/avatarList.tsx";

const Avatar = () => {
    const avatars = avatarList();
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                    e.stopPropagation();
                    setNewAvatar(avatar);
                    setEditDialogOpen(true);
                }}
                className="gap-2"
            >
                <Edit2 size={16} />
                Edit Avatar
            </Button>
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
                                            src={src}
                                            alt={`Avatar ${index + 1}`}
                                            // className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                                            //     // selectedAvatar === src ? "border-blue-500" : "border-transparent"
                                            // }`}
                                            // onClick={() => onSelect(src)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button >
                            Update Avatar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Avatar;