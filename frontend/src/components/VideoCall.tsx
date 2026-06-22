import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
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

    const handleSignal = (data: { signalData: Peer.SignalData; fromUsername: string }) => {
      if (data.fromUsername === user.username) return;
      if (!isCallActive || !localStream) return;

      let peer: Peer.Instance;
      const existingPeer = peers.get(data.fromUsername);

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
    <div className="flex flex-col h-full bg-[#0b141c] text-on-surface relative">
      {/* Header Info Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant bg-surface-container">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container">
            <span className={`w-2 h-2 bg-secondary rounded-full ${isCallActive ? 'animate-pulse' : ''}`}></span>
            <span className="font-label-sm text-label-sm">
              {isCallActive ? 'LIVE: Collaborative Conference' : 'Video Conference Idle'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-highest/50 px-3 py-1 rounded-full select-none">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>{isCallActive ? peers.size + 1 : 0} Connected</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isCallActive ? (
            <button
              onClick={startCall}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-on-primary hover:opacity-90 transition-all rounded-lg font-label-sm text-label-sm border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              Start Call
            </button>
          ) : (
            <button
              onClick={stopCall}
              className="flex items-center gap-2 px-4 py-1.5 bg-error-container text-on-error-container hover:bg-red-700 transition-all rounded-lg font-label-sm text-label-sm border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">call_end</span>
              End Call
            </button>
          )}
        </div>
      </div>

      {/* Main Video Grid Section */}
      <div className="flex-grow flex items-center justify-center p-6 min-h-[300px]">
        {isCallActive ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
            {/* Peers Video Blocks */}
            {Array.from(peers.entries()).map(([username, data]) => (
              <div key={username} className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-highest border border-outline-variant group">
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
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-surface-container/80 backdrop-blur px-2 py-1 rounded border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[14px]">mic</span>
                  <span className="text-label-sm font-label-sm">{username}</span>
                </div>
              </div>
            ))}
            
            {peers.size === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-surface-container-low rounded-xl border border-dashed border-outline-variant py-12">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-60 mb-2">hourglass_empty</span>
                <p className="font-body-md text-body-md text-on-surface-variant">Waiting for other participants to join the call...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant max-w-md select-none">
            <span className="material-symbols-outlined text-[64px] text-primary opacity-80 mb-3" style={{ fontVariationSettings: "'FILL' 0" }}>video_call</span>
            <h3 className="font-headline-md text-headline-md mb-2 text-on-surface">Start Conferencing</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">Click "Start Call" to activate your media devices and begin pair-programming over WebRTC.</p>
            <p className="text-xs text-outline">Note: Camera and microphone access permissions are required.</p>
          </div>
        )}
      </div>

      {/* Local Floating Video Preview (Bottom Right) */}
      {isCallActive && (
        <div className="absolute bottom-28 right-8 w-48 aspect-video rounded-lg overflow-hidden border-2 border-outline shadow-2xl z-50 bg-black">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <span className="text-[10px] font-label-sm bg-surface-container/60 px-2 py-0.5 rounded text-on-surface uppercase tracking-wider">
              You {!isVideoEnabled && '(Camera Off)'}
            </span>
          </div>
        </div>
      )}

      {/* Control Bar */}
      {isCallActive && (
        <div className="h-24 flex items-center justify-center gap-4 px-6 pb-4">
          <div className="flex items-center gap-3 bg-surface-container-highest/40 backdrop-blur-xl px-6 py-3 rounded-full border border-outline-variant/50">
            {/* Toggle Audio */}
            <button
              onClick={toggleAudio}
              className="group flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${isAudioEnabled ? 'bg-surface-variant hover:bg-outline-variant' : 'bg-error-container'}`}>
                <span className={`material-symbols-outlined ${isAudioEnabled ? 'text-on-surface group-hover:text-primary' : 'text-error'}`}>
                  {isAudioEnabled ? 'mic' : 'mic_off'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                {isAudioEnabled ? 'Mute' : 'Unmute'}
              </span>
            </button>

            {/* Toggle Video */}
            <button
              onClick={toggleVideo}
              className="group flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${isVideoEnabled ? 'bg-surface-variant hover:bg-outline-variant' : 'bg-error-container'}`}>
                <span className={`material-symbols-outlined ${isVideoEnabled ? 'text-on-surface group-hover:text-primary' : 'text-error'}`}>
                  {isVideoEnabled ? 'videocam' : 'videocam_off'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                {isVideoEnabled ? 'Stop Cam' : 'Start Cam'}
              </span>
            </button>

            <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>

            {/* End Call */}
            <button
              onClick={stopCall}
              className="group flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer"
            >
              <div className="w-16 h-12 rounded-full bg-error flex items-center justify-center hover:bg-error/80 transition-all duration-200 active:scale-95 px-4 shadow-lg shadow-error/20">
                <span className="material-symbols-outlined text-on-error" style={{ fontVariationSettings: "'FILL' 1" }}>call_end</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-error">End Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;