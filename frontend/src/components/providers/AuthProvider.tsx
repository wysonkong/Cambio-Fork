import {createContext, useContext, useEffect, useState} from "react";



interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    login: (sessionId: string, userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem("sessionId")
    });
    const [userId, setUserId] = useState<string | null>(() => {
        return localStorage.getItem("userId");
    });

    useEffect(() => {
        const storedSessionId = localStorage.getItem("sessionId");
        const storedUserId: string | null = localStorage.getItem("userId");

        if (storedSessionId && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }

    }, []);


    const login = (sessionId: string, newUserId: string) => {
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("userId", newUserId);
        setIsLoggedIn(true);
        setUserId(newUserId);
        console.log(newUserId)
    };

    const logout = () => {
        localStorage.removeItem("sessionId");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}