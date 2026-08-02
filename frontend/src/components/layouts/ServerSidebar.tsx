import { useEffect, useState } from "react";
import serverService from "../../services/serverService";
import type { Server } from "../../services/serverService";

interface ServerSidebarProps {
    onSelectServer: (serverId: number) => void;
}

function ServerSidebar({ onSelectServer }: ServerSidebarProps) {
    const [servers, setServers] = useState<Server[]>([]);

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
    
    return (
        <aside className="server-sidebar">
            <h2>Servers</h2>

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