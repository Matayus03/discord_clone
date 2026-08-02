import { useEffect, useState } from "react";
import channelService from "../../services/channelService";
import type { Channel } from "../../services/channelService";

interface ChannelSidebarProps {
    serverId: number | null;
    onSelectChannel: (channelId: number) => void;
    onJoinVoiceChannel: (channelId: number) =>  void;
}

function ChannelSidebar({ serverId, onSelectChannel, onJoinVoiceChannel }: ChannelSidebarProps) {
const [channels, setChannels] = useState<Channel[]>([]);
const [newChannelName, setNewChannelName] = useState("");
const [channelType, setChannelType] = useState("text");

useEffect(() => {
    if (!serverId) {
        setChannels([]);
        return;
    }

    async function loadChannels()  {
        try {
            const data = await channelService.getChannelsByServer(serverId!);

            setChannels(data);

        } catch (err) {
            console.error(err);
        }
        
    }

    loadChannels();

}, [serverId]);

const textChannels = channels.filter(channel => channel.type === "text");

const voiceChannels = channels.filter(channel => channel.type === "voice");

async function handleCreateChannel() {
    
    if (!serverId || !newChannelName.trim()) return;

    try {
        const response = await channelService.createChannel(
            serverId,
            newChannelName,
            channelType
        );

        setChannels(prev => [
            ...prev,
            response.channel
        ]);

        setNewChannelName("");

    } catch (err) {
        console.error(err);
    }
}

    return (
        <aside className="channel-sidebar">
            <h2>Channels</h2>

            <input
                type="text"
                placeholder="Channel name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
            />

            <select
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
            >
                <option value="text">
                    Text
                </option>

                <option value="voice">
                    Voice
                </option>
            </select>

            <button
                onClick={handleCreateChannel}
                disabled={!serverId}
            >
                + Create channel
            </button>
            
            <h3>Text Channels</h3>

            {textChannels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                >
                    # {channel.name}
                </button>
            ))}     

            <h3>Voice Channels</h3>

            {voiceChannels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onJoinVoiceChannel(channel.id)}
                >
                     🔊 {channel.name}
                </button>
            ))}
        </aside>
    );
}

export default ChannelSidebar;