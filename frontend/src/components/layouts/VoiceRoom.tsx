import { useEffect,useState, useRef } from "react";
import socket from "../../socket/socket";
import peerManager from "../../webrtc/peerManager";

interface VoiceRoomProps {
    channelId: number | null;
}

interface VoiceUser {
    id: number;
    username: string;
    socketId: string;
}

function VoiceRoom({ channelId }: VoiceRoomProps) {
    const [joined, setJoined] = useState(false);
    const [users, setUsers] = useState<VoiceUser[]>([]);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [muted, setMuted] = useState(false);
    const localStreamRef = useRef<MediaStream | null>(null);

    function toggleMute() {
        
        if (!localStream) {
            return;
        }

        const audioTrack = localStream.getAudioTracks()[0];

        if (!audioTrack) {
            return;
        }

        audioTrack.enabled = !audioTrack.enabled;

        setMuted(!audioTrack.enabled);
    }

    async function joinVoice() {
        
        console.log("CLICK JOIN");

        if (!channelId) {
            console.log("CHANNEL ID MANCANTE");
            return;
        }

        try {

            console.log("RICHIESTA MICROFONO");

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            console.log("MICROFONO OK");

            setLocalStream(stream);
            localStreamRef.current = stream;

            console.log("EMIT JOIN VOICE", channelId);

            socket.emit("join_voice", channelId);

            setJoined(true);

            console.log("JOIN COMPLETATO");

        } catch (err) {
            console.error("Microphone error:", err);
        }
    }

    function leaveVoice() {
        
        if (!channelId) {
            return;
        }

        socket.emit("leave_voice", channelId);

        peerManager.closeAll();

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        setLocalStream(null);
        localStreamRef.current = null;
        setUsers([]);
        setMuted(false);
        setJoined(false);
    }

    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => { track.stop(); });
            
            }
        };

    }, [localStream]);

    useEffect(() => {

        peerManager.closeAll();

        setJoined(false);
        setUsers([]);
        setMuted(false);
    }, [channelId]);

    useEffect(() => {
        async function handleVoiceUsers(users: VoiceUser[]) {
            setUsers(users);

            for (const user of users) {
                if (!peerManager.getPeer(user.socketId)) {
                    await createOffer(user.socketId);
                }
            }
        }

        function handleUserJoined(user: VoiceUser) {
            setUsers(prev => [
                ...prev,
                user
            ]);
        }

        function handleUserLeft(user: VoiceUser) {
            setUsers(prev => prev.filter(item => item.id !== user.id));

            peerManager.removePeer(user.socketId);
        }

        socket.on("voice_users", handleVoiceUsers);

        socket.on("user_joined_voice", handleUserJoined);

        socket.on("user_left_voice", handleUserLeft);

        socket.on("voice_offer", handleVoiceOffer);

        socket.on("voice_answer", handleVoiceAnswer);

        socket.on("ice_candidate", handleIceCandidate);

        return () => {
            socket.off("voice_users", handleVoiceUsers);

            socket.off("user_joined_voice", handleUserJoined);

            socket.off("user_left_voice", handleUserLeft);

            socket.off("voice_offer", handleVoiceOffer);

            socket.off("voice_answer", handleVoiceAnswer);

            socket.off("ice_candidate", handleIceCandidate);

        }
    }, []);

    async function createOffer(socketId: string) {
        const stream = localStreamRef.current;

        if (!stream) {
            return;
        }

        let peer = peerManager.getPeer(socketId);

        if (peer) {
            console.log("Peer già esistente:", socketId);
            return;
        }
            
        peer = peerManager.createPeer(socketId);

        stream.getTracks().forEach(track => {
            peer!.addTrack(track, stream);
        });
        

        peer.onicecandidate = (event) => {

            if (!event.candidate) {
                return;
            }

            socket.emit("ice_candidate", {
                targetId: socketId,
                candidate: event.candidate
            });
        }

        peer.ontrack = (event) => {
            const audio = new Audio();

            audio.srcObject = event.streams[0];

            audio.play().catch(console.error);
        };

        const offer = await peer.createOffer();

        await peer.setLocalDescription(offer);

        socket.emit("voice_offer", {
            targetId: socketId,
            offer
        });
    }

    async function handleVoiceOffer(data: {
        senderId: string;
        offer: RTCSessionDescriptionInit;
    }) {
        const stream = localStreamRef.current;

        if (!stream) {
            return;
        }

        let peer = peerManager.getPeer(data.senderId);

        if (!peer) {
            peer = peerManager.createPeer(data.senderId);
        
            stream.getTracks().forEach(track => {
                peer!.addTrack(track, stream);
            });
            

            peer.onicecandidate = (event) => {

                if (!event.candidate) {
                    return;
                }

                socket.emit("ice_candidate", {
                    targetId: data.senderId,
                    candidate: event.candidate
                });
            }

            peer.ontrack = (event) => {
                const audio = new Audio();

                audio.srcObject = event.streams[0];

                audio.play().catch(console.error);
            };
        }

        await peer.setRemoteDescription(data.offer);

        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        socket.emit("voice_answer", {
            targetId: data.senderId,
            answer
        });
    }

    async function handleVoiceAnswer(data: {
        senderId: string;
        answer: RTCSessionDescriptionInit;
    }) {
        const peer = peerManager.getPeer(data.senderId);

        if (!peer) {
            console.log("Peer non trovato");
            return;
        }

        if (peer.signalingState !== "have-local-offer") {
            console.log("Answer ignorato, stato attuale:", peer.signalingState);
            return;
        }

        await peer.setRemoteDescription(data.answer);
    }

    async function handleIceCandidate(data: {
        senderId: string;
        candidate: RTCIceCandidateInit;
    }) {
        const peer = peerManager.getPeer(data.senderId);

        if (!peer) {
            console.log("Peer non trovato");
            return;
        }

        try {
            await peer.addIceCandidate(data.candidate);
        
        } catch (err) {
            console.error("ICE candidate error:", err);
        }
    }

    if (!channelId) {
        return null;
    }

    

    return (
        <aside className="voice-room">
            <h2>Voice Room</h2>

            <p>
                Channel: {channelId}
            </p>

            {
                !joined ? (
                    <button
                        onClick={joinVoice}
                    >
                        Join
                    </button>
                ) : (
                    <button 
                        className="leave-button"
                        onClick={leaveVoice}
                    >
                        Leave
                    </button>
                )
            }

            <h3>Users</h3>

            {
                users.map(user => (
                    <div
                        key={user.id}
                    >
                        {user.username}
                    </div>
                ))
            }

            {
                joined && (
                    <button
                        className="mute-button"
                        onClick={toggleMute}
                    >
                        {
                            muted
                                ? "Unmute"
                                : "Mute"
                        }
                    </button>
                )
            }
        </aside>
    )
}

export default VoiceRoom;