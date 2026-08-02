import messageRepositories from "../repositories/messageRepositories.js";
import serverRepositories from "../repositories/serverRepositories.js";

async function createMessage(userId: number, channelId: number, content: string) {

    const existingChannel = await messageRepositories.findChannelById(channelId);

    if (!existingChannel) {
        throw new Error("Channel not found");
    }

    const member = await serverRepositories.findMember(userId, existingChannel.server_id);

    if (!member) {
        throw new Error("Forbidden");
    }

    const message = await messageRepositories.createMessage(channelId, userId, content);

    if (!message) {
        throw new Error("Message creation failed");
    }

    return message;

}

async function getMessagesByChannel(userId: number, channelId: number) {
    const existingChannel = await messageRepositories.findChannelById(channelId);

    if (!existingChannel) {
        throw new Error("Channel not found");
    }

    const member = await serverRepositories.findMember(userId, existingChannel.server_id);

    if (!member) {
        throw new Error("Forbidden");
    }

    return messageRepositories.getMessagesByChannel(channelId);
}

export default {
    createMessage,
    getMessagesByChannel
}