import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

interface ParticipantsProps {
  roomId: string;
}

const Participants: React.FC<ParticipantsProps> = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !isConnected) return;
    const handlerParticipantsUpdate = (data: { participants: string[] }) => {
      setParticipants(data.participants);
    };
    socket.on('participants-update', handlerParticipantsUpdate);
    return () => {
      socket.off('participants-update', handlerParticipantsUpdate);
    };
  }, [socket, isConnected]);

  return (
    <div className="space-y-4">
      {participants.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant text-center py-4">No participants joined yet</p>
      ) : (
        participants.map((username) => (
          <div key={username} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center border border-outline-variant">
                  <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-surface-container-low pulse-live"></div>
              </div>
              <div>
                <p className="font-body-md text-body-md text-on-surface">{username}</p>
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-tighter">Connected</p>
              </div>
            </div>
            {username === user?.username && (
              <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-label-sm text-[10px] font-bold uppercase select-none">You</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Participants;