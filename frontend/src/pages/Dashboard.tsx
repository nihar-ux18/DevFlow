import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/api';
import { CreateRoomData } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateRoom = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const roomData: CreateRoomData = {
        name: roomName || `Room-${Date.now()}`,
        language,
      };
      const response = await roomService.create(roomData);
      const room = response.data.data;
      toast.success('Room created! 🚀');
      navigate(`/room/${room.roomId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!joinRoomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    setLoading(true);
    try {
      await roomService.join(joinRoomId.trim());
      toast.success('Joined room! 🤝');
      navigate(`/room/${joinRoomId.trim()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-500">DevCollab</h1>
            <p className="text-gray-400">Welcome back, {user?.username}! 👋</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Create Room */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Room</h2>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Name (Optional)
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
                className="input-field"
                placeholder="My Awesome Project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
                className="input-field"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : '🚀 Create Room'}
            </button>
          </form>
        </div>

        {/* Join Room */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Join Existing Room</h2>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={joinRoomId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setJoinRoomId(e.target.value)}
                className="input-field"
                placeholder="Enter room ID (e.g., abc123)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Joining...' : '🤝 Join Room'}
            </button>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Share the Room ID with your teammates to collaborate</li>
            <li>• Code changes sync in real-time</li>
            <li>• Video calling is available inside the room</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;