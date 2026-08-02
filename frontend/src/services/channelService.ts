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

async function createChannel(serverId: number, name: string, type: string) {
    const { data } = await api.post(`/api/servers/${serverId}/channels`, {
        name,
        type
    });

    return data;
}

export default {
    getChannelsByServer,
    createChannel
};