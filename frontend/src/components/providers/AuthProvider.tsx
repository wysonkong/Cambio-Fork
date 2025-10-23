import { createContext, useContext, useState } from "react";



interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    login: (sessionId: string, userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const storedSessionId = localStorage.getItem("sessionId");
    const storedUserId: string | null = localStorage.getItem("userId");

    const [isLoggedIn, setIsLoggedIn] = useState(!!storedSessionId);
    const [userId, setUserId] = useState<string | null>(storedUserId);


    const login = (sessionId: string, userId: string) => {
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("userId", userId);
        setIsLoggedIn(true);
        console.log(userId)
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}