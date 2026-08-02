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

    return (
        <aside className="channel-sidebar">
            <h2>Channels</h2>
            
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