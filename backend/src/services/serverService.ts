import serverRepositories from "../repositories/serverRepositories.js";

async function createServer(userId: number, name: string) {
    const server = await serverRepositories.createServer(name);

    if (!server) {
        throw new Error("Server creation failed");
    }

    await serverRepositories.addMember(userId, server.id, "owner");

    return server;
}

async function getUserServers(userId: number) {
    return serverRepositories.getUserServers(userId);
}

export default {
    createServer,
    getUserServers
}