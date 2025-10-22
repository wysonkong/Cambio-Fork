import { createContext, useContext, useState, useEffect } from "react";



const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
        setIsLoggedIn(!!sessionId);
    }, []);

    const login = (sessionId: string, userId: string) => {
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("userId", userId);
        setIsLoggedIn(true);
        setUserId(userId);
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

export const useAuth = () => useContext(AuthContext);