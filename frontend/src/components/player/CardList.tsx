import { useEffect, useState } from "react";

export function useCardThemes() {
    const [themes, setThemes] = useState<string[]>([]);

    useEffect(() => {
        fetch("/images/cardTheme/manifest.json")
            .then((res) => res.json())
            .then(setThemes)
            .catch((err) => console.error("Error loading cards:", err));
    }, []);

    return themes;
}
