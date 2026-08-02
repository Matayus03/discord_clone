import ServerSidebar from "../components/layouts/ServerSidebar";
import ChannelSidebar from "../components/layouts/ChannelSidebar";
import ChatWindow from "../components/layouts/ChatWindow";
import "../styles/app.css";
import { useState } from "react";
import MemberSidebar from "../components/layouts/MemberSidebar";
import VoiceRoom from "../components/layouts/VoiceRoom";

function Home() {
    const [selectedServer, setSelectedServer] = useState<number | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
    const [selectedVoiceChannel, setSelectedVoiceChannel] = useState<number | null>(null);

    console.log("Voice", selectedVoiceChannel);

    return (
        <div className="app-container">
            <ServerSidebar 
                onSelectServer={setSelectedServer}
            />

            <ChannelSidebar 
                serverId={selectedServer}
                onSelectChannel={setSelectedChannel}
                onJoinVoiceChannel={setSelectedVoiceChannel}
            />

            <ChatWindow 
                channelId={selectedChannel}
            />

            <MemberSidebar 
                serverId={selectedServer}
            />

            <VoiceRoom
                channelId={selectedVoiceChannel}
            />
        </div>

    );
}

export default Home;