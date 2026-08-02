import pool from "../database/database.js";

type ChannelType = "text" | "voice";

async function createChannel(serverId: number, name: string, type: ChannelType) {
    const result = await pool.query(`
        INSERT INTO channels (server_id, name, type)
        VALUES ($1, $2, $3)
        RETURNING id, name, type
        `,
        [serverId, name, type]
    )

    return result.rows[0] ?? null;
}

async function getChannelsByServer(serverId: number) {
    const result = await pool.query(`
        SELECT id, name, type
        FROM channels
        WHERE server_id = $1
        ORDER BY created_at ASC
        `,
        [serverId]
    )

    return result.rows;
}

export default {
    createChannel,
    getChannelsByServer
}