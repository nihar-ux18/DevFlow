import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface VideoCallProps {
    roomId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId }) => {
    const [peers, setPeers] = useState<Map<string, { peer: Peer.Instance; username: string; stream: MediaStream }>>(new Map());
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isCallActive, setIsCallActive] = useState(false);

    const { socket, isConnected } = useSocket();
    const { user } = useAuth();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const peerRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

    const startCall = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            setIsCallActive(true);
            toast.success('Camera and microphone activated');
        } catch (error) {
            toast.error('Failed to access camera/microphone');
            console.error('Media error:', error);
        }
    }, []);

    const stopCall = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        peers.forEach(({ peer }) => {
            peer.destroy();
        });
        setPeers(new Map());
        setIsCallActive(false);
        toast('Call ended');
    }, [localStream, peers]);

    const toggleVideo = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    }, [localStream]);

    const toggleAudio = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    }, [localStream]);

    useEffect(() => {
        if (!socket || !isConnected || !user) return;

        const handleUserJoined = (data: { username: string }) => {
            if (data.username === user.username) return;
            if (!isCallActive || !localStream) return;

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: localStream,
            });

            peer.on('signal', (signalData) => {
                socket.emit('signal', {
                    roomId,
                    signalData,
                    targetUsername: data.username,
                    fromUsername: user.username,
                });
            });

            peer.on('stream', (stream) => {
                setPeers(prev => {
                    const newMap = new Map(prev);
                    newMap.set(data.username, { peer, username: data.username, stream });
                    return newMap;
                });
            });

            peer.on('error', (err) => {
                console.error('Peer error:', err);
            });
        };

        const handleSignal = (data: { signalData: any; fromUsername: string }) => {
            if (data.fromUsername === user.username) return;
            if (!isCallActive || !localStream) return;

            let peer: Peer.Instance;
            let existingPeer = peers.get(data.fromUsername);

            if (existingPeer) {
                peer = existingPeer.peer;
                peer.signal(data.signalData);
            } else {
                peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: localStream,
                });

                peer.on('signal', (signalData) => {
                    socket.emit('signal', {
                        roomId,
                        signalData,
                        targetUsername: data.fromUsername,
                        fromUsername: user.username,
                    });
                });

                peer.on('stream', (stream) => {
                    setPeers(prev => {
                        const newMap = new Map(prev);
                        newMap.set(data.fromUsername, { peer, username: data.fromUsername, stream });
                        return newMap;
                    });
                });

                peer.signal(data.signalData);
            }
        };

        const handleUserLeft = (data: { username: string }) => {
            if (data.username === user.username) return;
            const peerData = peers.get(data.username);
            if (peerData) {
                peerData.peer.destroy();
                setPeers(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(data.username);
                    return newMap;
                });
                toast(`${data.username} left the call`);
            }
        };

        socket.on('user-joined', handleUserJoined);
        socket.on('signal', handleSignal);
        socket.on('user-left', handleUserLeft);

        return () => {
            socket.off('user-joined', handleUserJoined);
            socket.off('signal', handleSignal);
            socket.off('user-left', handleUserLeft);
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            peers.forEach(({ peer }) => peer.destroy());
        };
    }, [socket, isConnected, user, roomId, isCallActive, localStream, peers]);

    useEffect(() => {
        if (peers.size > 0) {
            peers.forEach((data, username) => {
                const videoElement = peerRefs.current.get(username);
                if (videoElement) {
                    videoElement.srcObject = data.stream;
                }
            });
        }
    }, [peers]);

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Video Call</h3>
                <div className="flex items-center space-x-2">
                    {!isCallActive ? (
                        <button
                            onClick={startCall}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition flex items-center space-x-2"
                        >
                            <FaVideo /> <span>Start Call</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopCall}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition flex items-center space-x-2"
                        >
                            <FaPhoneSlash /> <span>End Call</span>
                        </button>
                    )}
                </div>
            </div>

            {isCallActive && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                                You {!isVideoEnabled && '(Camera Off)'}
                            </div>
                        </div>

                        {Array.from(peers.entries()).map(([username, data]) => (
                            <div key={username} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                                <video
                                    ref={(el) => {
                                        if (el) {
                                            peerRefs.current.set(username, el);
                                            el.srcObject = data.stream;
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                                    {username}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full transition ${isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {isVideoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
                        </button>
                        <button
                            onClick={toggleAudio}
                            className={`p-3 rounded-full transition ${isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {isAudioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
                        </button>
                        <button
                            onClick={stopCall}
                            className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition"
                        >
                            <FaPhoneSlash size={20} />
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                        {peers.size === 0 ? 'Waiting for others to join...' : `${peers.size} participant(s) in call`}
                    </div>
                </div>
            )}

            {!isCallActive && (
                <div className="text-center py-8 text-gray-400">
                    <p className="text-4xl mb-2">📹</p>
                    <p>Click "Start Call" to begin video conferencing</p>
                    <p className="text-xs mt-2">Camera and microphone access required</p>
                </div>
            )}
        </div>
    );
};

export default VideoCall;