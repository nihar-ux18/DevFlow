import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { roomService } from '../services/api';
import { Room as RoomType } from '../types';
import CodeEditor from '../components/Editor';
import toast from 'react-hot-toast';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useSocket();
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

  const handleCopyRoomId = (): void => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied!');
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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary-500">{room.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Room ID:</span>
              <code className="bg-gray-700 px-2 py-1 rounded text-sm text-primary-400">
                {room.roomId}
              </code>
              <button
                onClick={handleCopyRoomId}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition"
              >
                📋 Copy
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Live' : 'Connecting...'}
              </span>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          <div className="lg:col-span-3 h-[calc(100vh-200px)]">
            <div className="card h-full p-0 overflow-hidden">
              <CodeEditor
                roomId={room.roomId}
                initialCode={room.code}
                language={room.language}
                username={user?.username}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Participants</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
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

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Room Info</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Language</span>
                  <span className="text-white">{room.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-white">
                    {new Date(room.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Host</span>
                  <span className="text-white">
                    {typeof room.host === 'string' ? room.host : room.host?.username}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">⌨️ Shortcuts</h3>
              <div className="space-y-1 text-xs text-gray-400">
                <div><kbd className="bg-gray-700 px-1 py-0.5 rounded">Ctrl+S</kbd> Save</div>
                <div><kbd className="bg-gray-700 px-1 py-0.5 rounded">Ctrl+Z</kbd> Undo</div>
                <div><kbd className="bg-gray-700 px-1 py-0.5 rounded">Ctrl+Y</kbd> Redo</div>
                <div><kbd className="bg-gray-700 px-1 py-0.5 rounded">Ctrl+F</kbd> Find</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;