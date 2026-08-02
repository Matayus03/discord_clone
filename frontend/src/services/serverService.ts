import api from "./api";

export interface Server {
    id: number;
    name: string;
    role: string;
}

async function getServers(): Promise<Server[]> {
    const { data } = await api.get("/api/servers");

    return data;
}

async function createServer(name: string) {
    const { data } = await api.post("/api/servers", {
        name
    });

    return data;
}

export default {
    getServers,
    createServer
};