import { createContext } from "react";
import { useState } from "react";
import type { ReactNode } from "react";
import authService from "../services/authService";
import { useEffect } from "react";
import socket from "../socket/socket";

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    user: User | null;

    token: string | null;

    login: (email: string, password: string) => Promise<void>;

    logout: () => void;

}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken) {
            setToken(savedToken);
        }

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    async function login(email: string, password: string) {
        const response = await authService.login({ email, password });
        
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        setUser(response.user);
        setToken(response.token);

        socket.auth = {
            token: response.token
        };

        socket.connect();
    }

    function logout() {
        socket.disconnect();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };
export default AuthContext;