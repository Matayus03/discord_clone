import pool from "../database/database.js";

async function findByEmail(email: string) {
    const result = await pool.query(`
        SELECT *
        FROM users
        WHERE email = $1;  
        `,
        [email]
    );

    return result.rows[0] ?? null;
}

async function createUser(username: string, email: string, passwordHash: string) {
    const result = await pool.query(`
        INSERT INTO users (username, email, hash_password)
        VALUES ($1, $2, $3)
        RETURNING id, username;
        `,
        [username, email, passwordHash]
    );

    return result.rows[0] ?? null;
}

export default {
    findByEmail,
    createUser
}