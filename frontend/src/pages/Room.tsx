import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/api';
import { Room as RoomType } from '../types';
import toast from 'react-hot-toast';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoom = async (): Promise<void> => {
      if (!roomId) {
        navigate('/dashboard');
        return;
      }

      try {
        const response = await roomService.get(roomId);
        setRoom(response.data.data);
      } catch (error) {
        toast.error('Room not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, navigate]);

  const handleLeaveRoom = async (): Promise<void> => {
    if (!roomId) return;
    
    try {
      await roomService.leave(roomId);
      toast.success('Left room');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to leave room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-primary-500">{room.name}</h1>
            <p className="text-sm text-gray-400">Room ID: {room.roomId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              👥 {room.participants?.length || 0} participants
            </span>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Will be filled in Day 4 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Editor Area */}
          <div className="lg:col-span-2">
            <div className="card min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Code Editor</h2>
                <span className="text-sm text-gray-400">{room.language}</span>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] flex items-center justify-center text-gray-500">
                <p>📝 Code Editor (Coming in Day 4)</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Participants</h3>
              <div className="space-y-2">
                {room.participants?.map((participant) => (
                  <div key={participant._id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">
                      {participant.username}
                      {typeof room.host !== 'string' && participant._id === room.host?._id && (
                        <span className="text-xs text-primary-500 ml-2">(Host)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Chat</h3>
              <div className="bg-gray-900 rounded-lg p-4 min-h-[100px] flex items-center justify-center text-gray-500">
                <p>💬 Chat (Coming in Day 4)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;