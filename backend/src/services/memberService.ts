import memberRepositories from "../repositories/memberRepositories.js";

async function getMembersByServer(serverId: number) {
    return memberRepositories.getMembersByServer(serverId);
}

export default {
    getMembersByServer
}