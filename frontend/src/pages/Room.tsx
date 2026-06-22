import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { roomService } from '../services/api';
import { Room as RoomType } from '../types';
import CodeEditor from '../components/Editor';
import toast from 'react-hot-toast';
import VideoCall from '../components/VideoCall';
import Chat from '../components/Chat';
import Participants from '../components/Participants';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'participants' | 'chat'>('participants');
  const [isVideoCallOpen, setIsVideoCallOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoom = async (): Promise<void> => {
      if (!roomId) {
        navigate('/dashboard');
        return;
      }
      try {
        const response = await roomService.get(roomId);
        setRoom(response.data.data);
      } catch {
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
    } catch {
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
      <div className="min-h-screen flex items-center justify-center bg-[#0b141c]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-on-surface-variant mt-4 font-body-md">Loading room workspace...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0b141c] text-on-surface select-none relative">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full px-margin-desktop h-panel-toolbar bg-surface-container border-b border-outline-variant z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-headline-md font-headline-md text-primary tracking-tight">{room.name}</h1>
          <div
            onClick={handleCopyRoomId}
            className="flex items-center bg-surface-container-high px-3 py-1 rounded-lg border border-outline-variant group cursor-pointer active:opacity-80 transition-all"
          >
            <span className="font-label-sm text-label-sm text-on-surface-variant mr-2 select-none">ROOM ID:</span>
            <span className="font-code-md text-code-md text-primary">{room.roomId}</span>
            <span className="material-symbols-outlined text-[16px] ml-2 text-on-surface-variant group-hover:text-primary transition-colors">content_copy</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-secondary ${isConnected ? 'pulse-live' : 'opacity-40'}`} />
            <span className="font-label-sm text-label-sm text-secondary tracking-widest">
              {isConnected ? 'LIVE' : 'CONNECTING'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoCallOpen(!isVideoCallOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-label-sm text-label-sm rounded-lg transition-colors cursor-pointer border ${
                isVideoCallOpen
                  ? 'bg-primary text-on-primary border-primary'
                  : 'text-on-surface-variant hover:bg-surface-variant border-outline-variant bg-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">video_chat</span>
              <span>Video Call</span>
            </button>
            <button
              onClick={handleLeaveRoom}
              className="flex items-center gap-2 px-4 py-1.5 bg-error-container text-on-error-container hover:bg-red-700 transition-all rounded-lg font-label-sm text-label-sm border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Leave Room
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant bg-surface-container-highest">
              <img className="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv-sva96iW-xvn20ATXQg5IYY43CFrooEBY5qa_jHRIbn8YdFHfIKR_lWwzxbM5etTGSkLUxG-ia-x8z2xy_m4s3VaEi71d9cTFuAYtAdDXxlt9MiqbgVyjclCtBizSJbhTef3oFAyXmG9-xb0QjsHJcRhtAi9teFba38-JXD5bRNf5Qxd_WcDVfIoJ3g6w2n1E49zBza9bOjP8RoJKKJauhXIkXQf8F3OT2N1H2s5F7HiR1M84OPnWmJwN-puhKus13plsJVGsbM" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Area (Flex Column to support Video Call overlay toggle) */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Main editor pane (70%) */}
        <section className="w-[70%] flex flex-col border-r border-outline-variant bg-surface">
          <CodeEditor
            roomId={room.roomId}
            initialCode={room.code}
            language={room.language}
            username={user?.username}
          />
        </section>

        {/* Right sidebar pane (30%) */}
        <aside className="w-[30%] flex flex-col bg-surface-container-low">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-outline-variant select-none">
            <button
              onClick={() => setActiveSidebarTab('participants')}
              className={`flex-1 py-3 text-center font-label-sm text-label-sm border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                activeSidebarTab === 'participants'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveSidebarTab('chat')}
              className={`flex-1 py-3 text-center font-label-sm text-label-sm border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                activeSidebarTab === 'chat'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Chat
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeSidebarTab === 'participants' ? (
              <Participants roomId={room.roomId} />
            ) : (
              <Chat roomId={room.roomId} />
            )}
          </div>
        </aside>

        {/* Video Call Modal/Overlay (if toggled open) */}
        {isVideoCallOpen && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0b141c]/95 backdrop-blur-md">
            {/* Close Video Overlay Banner */}
            <div className="flex justify-end p-4 bg-[#0b141c] border-b border-outline-variant">
              <button
                onClick={() => setIsVideoCallOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1 bg-surface-container border border-outline-variant hover:bg-surface-variant text-on-surface rounded-lg font-label-sm text-label-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                Return to Code Editor
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <VideoCall roomId={room.roomId} />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-6 bg-primary text-on-primary px-4 flex items-center justify-between font-label-sm text-[11px] font-medium z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            <span>Handshake Successful</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lan</span>
            <span>latency: 24ms</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-3">
            <span>Spaces: 4</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Prettier</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Room;