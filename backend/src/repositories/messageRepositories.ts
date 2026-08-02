import pool from "../database/database.js";

async function createMessage(channelId: number, authorId: number, content: string) {
    const result = await pool.query(`
        INSERT INTO messages (channel_id, author_id, content)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
        [channelId, authorId, content]
    );

    const messageId = result.rows[0].id;

    const message = await pool.query(`
        SELECT messages.id, messages.content, messages.created_at, users.id AS author_id, users.username
        FROM messages
        LEFT JOIN users
        ON messages.author_id = users.id
        WHERE messages.id = $1;
        `,
        [messageId]
    );

    return message.rows[0] ?? null;
}

async function getMessagesByChannel(channelId: number) {
    const result = await pool.query(`
        SELECT messages.id, messages.content, messages.created_at, users.id AS author_id, users.username
        FROM messages
        LEFT JOIN users
        ON messages.author_id = users.id
        WHERE messages.channel_id = $1
        ORDER BY messages.created_at ASC;
        `,
        [channelId]
    )

    return result.rows;
}

async function findChannelById(channelId: number) {
    const result = await pool.query(`
        SELECT id, server_id
        FROM channels
        WHERE id = $1;
        `,
        [channelId]
    );

    return result.rows[0] ?? null;
}

export default {
    createMessage,
    getMessagesByChannel,
    findChannelById
}