import api from "./api.ts";

export interface LoginRequest {
    email: string,
    password: string;
}

export interface LoginResponse {
    message: string;
    user: {
        id: number;
        username: string;
    };
    token: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        username: string;
    };
    token: string;
}

async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    
    return data;
}

async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>("/auth/register", credentials);

    return data;
}

export default {
    login,
    register
}