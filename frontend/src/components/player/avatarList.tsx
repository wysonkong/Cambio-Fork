import { useEffect, useState } from "react";

export function useAvatarList() {
    const [avatars, setAvatars] = useState<string[]>([]);

    useEffect(() => {
        fetch("/images/avatars/manifest.json")
            .then((res) => res.json())
            .then(setAvatars)
            .catch((err) => console.error("Error loading avatars:", err));
    }, []);

    return avatars;
}
