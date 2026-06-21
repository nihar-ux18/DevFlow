import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

interface ParticipantsProps { roomId: string; }

const Participants: React.FC<ParticipantsProps> = () => {
    const [participants, setParticipants] = useState<string[]>([]);
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket || !isConnected) return;
        const handlerParticipantsUpadte = (data: { participants: string[] }) => { setParticipants(data.participants) };
        socket.on('participants-update', handlerParticipantsUpadte);
        return () => {
            socket.off('participants-update', handlerParticipantsUpadte);
        };
    }, [socket, isConnected]);

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Participants</h3>
            <div className="space-y-2">
                {participants.length === 0 ? (
                    <p className="text-sm text-gray-400">No Participants joined yet</p>
                ) : (
                    participants.map((username) => (
                        <div key={username} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm">
                                {username}
                                {username === user?.username && (
                                    <span className="text-xs text-primary-500 ml-2">(You)</span>
                                )}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
                <span className="text-xs text-gray-400">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''} online
                </span>
            </div>
        </div>
    );
};

export default Participants;