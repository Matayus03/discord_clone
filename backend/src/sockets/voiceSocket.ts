import type { Server, Socket } from "socket.io";

function setupVoiceSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        socket.on("join_voice", async (channelId) => {
            const id = Number(channelId);

            if (isNaN(id)) {
                return;
            }

            const room = `voice_${id}`;

            const clients = io.sockets.adapter.rooms.get(room);

            const users = [];

            if (clients) {
                for (const socketId of clients) {
                    const clientSocket = io.sockets.sockets.get(socketId);

                    if (clientSocket?.user) {
                        users.push({
                            ...clientSocket.user,
                            socketId: clientSocket.id
                        });
                    }
                }
            }

            if (socket.data.voiceChannel) {
                socket.leave(`voice_${socket.data.voiceChannel}`);
            }

            socket.join(room);

            socket.data.voiceChannel = id;

            socket.emit("voice_users", users);

            socket.to(room)
                .emit("user_joined_voice", {
                    ...socket.user,
                    socketId: socket.id
                });

            console.log(`${socket.id} joined voice ${id}`);
        });

        socket.on("leave_voice", (channelId) => {
            const id = Number(channelId);

            socket.leave(`voice_${id}`);

            socket.to(`voice_${id}`)
                .emit("user_left_voice", {
                    ...socket.user,
                    socketId: socket.id
                });

            socket.data.voiceChannel = null;

            console.log(`${socket.id} left voice ${id}`);
        });

        socket.on("voice_offer", ({ targetId, offer }) => {
            const targetSocket = io.sockets.sockets.get(targetId);

            if (!targetSocket) {
                return;
            }

            targetSocket.emit("voice_offer", {
                senderId: socket.id,
                offer
            });
        });

        socket.on("voice_answer", ({ targetId, answer }) => {
            const targetSocket = io.sockets.sockets.get(targetId);

            if (!targetSocket) {
                return;
            }

            targetSocket.emit("voice_answer", {
                senderId: socket.id,
                answer
            });
        });

        socket.on("ice_candidate", ({ targetId, candidate }) => {
            const targetSocket = io.sockets.sockets.get(targetId);

            if (!targetSocket) {
                return;
            }

            targetSocket.emit("ice_candidate", {
                senderId: socket.id,
                candidate
            });
        });

        socket.on("disconnect", () => {
            const channelId = socket.data.voiceChannel;

            if (!channelId) {
                return;
            }

            socket.to(`voice_${channelId}`)
                .emit("user_left_voice", {
                    ...socket.user,
                    socketId: socket.id
                });

            socket.data.voiceChannel = null;

            console.log(`${socket.id} disconnected from voice`);
        });
    });
}

export default setupVoiceSocket;