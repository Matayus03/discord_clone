import api from "./api";

export interface Member {
    id: number;
    username: string;
    role: string;
}

async function getMembersByServer(serverId: number): Promise<Member[]> {
    const { data } = await api.get(`/api/servers/${serverId}/members`);

    return data;
}

export default {
    getMembersByServer
};