import pool from "../database/database.js";

type ServerRole = "owner" | "admin" | "member";

async function createServer(name: string) {
    const result = await pool.query(`
        INSERT INTO servers (name)
        VALUES ($1)
        RETURNING id, name;
        `,
        [name]
    );

    return result.rows[0] ?? null;
}

async function addMember(userId: number, serverId: number, role: ServerRole) {
    const result = await pool.query(`
        INSERT INTO server_members (user_id, server_id, role)
        VALUES ($1, $2, $3);
        `,
        [userId, serverId, role]
    );

}

async function getUserServers(userId: number) {
    const result = await pool.query(`
        SELECT servers.id, servers.name, server_members.role
        FROM servers
        JOIN server_members
        ON servers.id = server_members.server_id
        WHERE server_members.user_id = $1;
        `,
        [userId]
    )

    return result.rows;
}

async function findMember(userId: number, serverId: number) {
    const result = await pool.query(`
        SELECT *
        FROM server_members
        WHERE user_id = $1
        AND server_id = $2;
        `,
        [userId, serverId]
    )


    return result.rows[0] ?? null;
}

export default {
    createServer,
    addMember,
    getUserServers,
    findMember
}