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
        return !!sessionStorage.getItem("sessionId")
    });
    const [userId, setUserId] = useState<string | null>(() => {
        return sessionStorage.getItem("userId");
    });

    useEffect(() => {
        const storedSessionId = sessionStorage.getItem("sessionId");
        const storedUserId: string | null = sessionStorage.getItem("userId");

        if (storedSessionId && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }

    }, []);


    const login = (sessionId: string, newUserId: string) => {
        sessionStorage.setItem("sessionId", sessionId);
        sessionStorage.setItem("userId", newUserId);
        setIsLoggedIn(true);
        setUserId(newUserId);
        console.log(newUserId)
    };

    const logout = () => {
        sessionStorage.removeItem("sessionId");
        sessionStorage.removeItem("userId");
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