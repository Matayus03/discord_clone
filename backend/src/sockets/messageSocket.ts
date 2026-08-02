import type { Server, Socket } from "socket.io";
import messageService from "../services/messageService.js";

function setupMessageSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        
        socket.on("join_channel", (channelId) => {

            const id = Number(channelId);

            if (isNaN(id)) {
                return socket.emit("error", {
                    message: "Invalid channel id"
                });
            }

            if (socket.data.channelId) {
                socket.leave(`channel_${socket.data.channelId}`);
            }

            socket.join(`channel_${id}`);

            socket.data.channelId = id;

            console.log(`${socket.id} joined channel ${id}`);
        });
        
        
        socket.on("send_message", async (data) => {
            try {
                if (!socket.user) {
                    return;
                }

                const {
                    channelId,
                    content
                } = data;

                if (!channelId || !content || content.trim().length === 0) {
                    return socket.emit("error", {
                        message: "Invalid message data"
                    });
                }

                const id = Number(channelId);

                if (isNaN(id)) {
                    return socket.emit("error", {
                        message: "Invalid channel id"
                    });
                }

                const cleanContent = content.trim();

                const message = await messageService.createMessage(socket.user.id, id, cleanContent);

                io.to(`channel_${id}`)
                    .emit("new_message", message);

            } catch (err) {
                console.error(err);

                socket.emit("error", {
                    message: "Message creation failed"
                });
            }
        });
    });
}

export default setupMessageSocket;