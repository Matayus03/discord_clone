import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./database/database.js";
import authRouter from "./routes/authRoutes.js";
import serverRouter from "./routes/serverRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import setupSocket from "./sockets/socket.js";
import memberRouter from "./routes/memberRoutes.js";

import { createServer } from "http";
import { Server } from "socket.io";

const port = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

setupSocket(io);

async function testDb() {
    await pool.query(`
        SELECT 1
        `
    );
}

app.use("/auth", authRouter);

app.use("/api", serverRouter);

app.use("/api", channelRouter);

app.use("/api", messageRouter);

app.use("/api", memberRouter);

async function start() {
    try {
        await testDb();

        httpServer.listen(port, "0.0.0.0", () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.error(err);
        console.log("Database not connected");
    }
}

start();