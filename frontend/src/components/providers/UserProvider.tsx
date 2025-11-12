import type {User} from "@/components/Interfaces.tsx";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useAuth} from "@/components/providers/AuthProvider.tsx";

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    refreshUser: async () => {},
});

export const UserProvider = ({children}:{children: React.ReactNode}) => {
    const {userId} = useAuth()
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = useCallback(async () => {
        if (!userId) {
            console.log("User ID not ready yet:", userId);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/getUser${userId}`, {
                method: "GET",
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            const data: User = await res.json();
            setUser(data);
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    }, [userId]);

    useEffect(() => {

        if (!userId) {
            console.log("User ID not ready yet:", userId);
            return;
        }

        fetchUser();
    }, [userId, fetchUser]);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser])


    return <UserContext.Provider value={{ user, setUser, refreshUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};