import api from "./api";

export interface Channel {
    id: number;
    name: string;
    type: string;
}

async function getChannelsByServer(serverId: number): Promise<Channel[]> {
    const { data } = await api.get(`/api/servers/${serverId}/channels`);
    
    return data;
}

export default {
    getChannelsByServer
};