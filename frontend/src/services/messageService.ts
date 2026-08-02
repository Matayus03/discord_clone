import api from "./api";

export interface Message {
    id: number;
    content: string;
}

async function getMessagesByChannel(channelId: number): Promise<Message[]> {
    const { data } = await api.get(`/api/channels/${channelId}/messages`);

    return data;
}

export default {
    getMessagesByChannel
};