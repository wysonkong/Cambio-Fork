import type {User} from "@/components/Interfaces.tsx";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "@/components/AuthProvider.tsx";

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const UserProvider = ({children}:{children: React.ReactNode}) => {
    const {userId} = useAuth()
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        console.log(userId)
        async function fetchUser(userId: number): Promise<User | null> {
            try {
                const res = await fetch("http://localhost:8080/api/getUser" + userId, {
                    method: "GET",
                });
                const data: User = await res.json();
                return data;
            } catch (err) {
                console.error("Error fetching items:", err);
                return null;
            }
        }
        fetchUser(Number(userId)).then(setUser);
    }, [userId]);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context; // returns { user, setUser }
};