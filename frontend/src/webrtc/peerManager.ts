class PeerManager {
    private peers = new Map<string, RTCPeerConnection>();

    createPeer(socketId: string) {
        const existingPeer = this.peers.get(socketId);

        if (existingPeer) {
            return existingPeer;
        }
        
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.1.google.com:19302"
                }
            ]
        });

        this.peers.set(socketId, peer);

        return peer;
    }

    getPeer(socketId: string) {
        return this.peers.get(socketId);
    }

    removePeer(socketId: string) {
        const peer = this.peers.get(socketId);

        if (peer) {
            peer.close();
            this.peers.delete(socketId);
        }
    }

    closeAll() {
        this.peers.forEach(peer => {
            peer.close();
        });

        this.peers.clear();
    }
}

export default new PeerManager();