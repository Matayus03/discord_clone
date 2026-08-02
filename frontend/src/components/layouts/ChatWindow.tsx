import { useEffect, useState } from "react";
import messageService from "../../services/messageService";
import type { Message } from "../../services/messageService";
import socket from "../../socket/socket";

interface ChatWindowProps {
    channelId: number | null;
}

function ChatWindow ({ channelId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");

    function sendMessage() {
        if (!channelId) {
            return;
        }

        if (content.trim() === "") {
            return;
        }

        socket.emit("send_message", { channelId, content });

        setContent("");
    }

    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            return;
        }

        async function loadMessages() {
            try {
                const data = await messageService.getMessagesByChannel(channelId);

                setMessages(data);

            } catch (err) {
                console.error(err);
            }
        }

        loadMessages();

    }, [channelId]);

    useEffect(() => {
        if (!channelId) {
            return;
        }

        socket.emit("join_channel", channelId);

    }, [channelId]);

    useEffect(() => {
        function handleNewMessage(message: Message) {
            setMessages(prev => [
                ...prev,
                message
            ]);

        }

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        }

    }, []);

    return (
        <main className="chat-window">
            <h2>Chat</h2>

            {messages.map(message => (
                <div
                    key={message.id}
                >
                    {message.content}
                </div>
            ))}

            <input
                placeholder="Write a message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        sendMessage();
                    }
                }}
            />

            <button onClick={sendMessage}>Send</button>
        </main>
    );
}

export default ChatWindow;