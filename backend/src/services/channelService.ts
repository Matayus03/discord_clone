import channelRepositories from "../repositories/channelRepositories.js";
import serverRepositories from "../repositories/serverRepositories.js";

type ChannelType = "text" | "voice";

async function createChannel(userId: number, serverId: number, name: string, type: ChannelType) {
    const member = await serverRepositories.findMember(userId, serverId);

    if (!member) {
        throw new Error("Forbidden");
    }
    
    const channel = await channelRepositories.createChannel(serverId, name, type);

    if (!channel) {
        throw new Error("Channel creation failed");
    }

    return channel;
} 

async function getChannelsByServer(serverId: number, userId: number) {
    const member = await serverRepositories.findMember(userId, serverId);

    if (!member) {
        throw new Error("Forbidden");
    }
    
    const channels = await channelRepositories.getChannelsByServer(serverId);

    return channels;
}

export default {
    createChannel,
    getChannelsByServer
}