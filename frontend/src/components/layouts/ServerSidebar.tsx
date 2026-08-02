import { useEffect, useState } from "react";
import serverService from "../../services/serverService";
import type { Server } from "../../services/serverService";

interface ServerSidebarProps {
    onSelectServer: (serverId: number) => void;
}

function ServerSidebar({ onSelectServer }: ServerSidebarProps) {
    const [servers, setServers] = useState<Server[]>([]);
    const [newServerName, setNewServerName] = useState("");

    useEffect(() => {
        async function loadServers() {
            try {
                const data = await serverService.getServers();

                console.log(data);

                setServers(data);

            } catch (err) {
                console.error(err);
            }
        }

        loadServers();

    }, []);

    async function handleCreateServer() {
        if (!newServerName.trim()) return;

        try {
            const response = await serverService.createServer(newServerName);

            setServers(prev => [
                ...prev,
                response.server
            ]);

            setNewServerName("");

            onSelectServer(response.server.id);

        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <aside className="server-sidebar">
            <h2>Servers</h2>

            <input
                type="text"
                placeholder="Server name"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
            />

            <button onClick={handleCreateServer}>
                + Create server
            </button>

            {servers.map(server => (
                <button
                    key={server.id}
                    onClick={() => onSelectServer(server.id)}
                >
                    {server.name}
                </button>
            ))}
        </aside>
    );
}

export default ServerSidebar;