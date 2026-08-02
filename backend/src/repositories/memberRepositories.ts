import pool from "../database/database.js";

async function getMembersByServer(serverId: number) {
    const result = await pool.query(`
        SELECT users.id, users.username, server_members.role
        FROM server_members
        JOIN users
        ON server_members.user_id = users.id
        WHERE server_members.server_id = $1;
        `,
        [serverId]
    );

    return result.rows;
}

export default {
    getMembersByServer
}