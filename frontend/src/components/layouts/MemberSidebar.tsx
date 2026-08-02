import { useEffect, useState } from "react";
import memberService from "../../services/memberService";
import type { Member } from "../../services/memberService";

interface MemberSidebarProps {
    serverId: number | null;
}

function MemberSidebar({ serverId }: MemberSidebarProps) {
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        
        if (!serverId) {
            setMembers([]);
            return;
        }

        async function loadMembers() {
            try {
                const data = await  memberService.getMembersByServer(serverId!);

                console.log("MEMBERS:", data);

                setMembers(data);

            } catch (err) {
                console.error(err);
            }
        }

        loadMembers();

    }, [serverId]);

    return (
        <aside className="member-sidebar">
            <h2>Members</h2>

            {members.map(member => (
                <div
                    key={member.id}
                >
                    <span>
                        {member.username}
                    </span>
                    
                    <small>
                        {member.role}
                    </small>
                </div>
            ))}
        </aside>
    );
}

export default MemberSidebar;