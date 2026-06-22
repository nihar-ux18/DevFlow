import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

interface ChatProps {
  roomId: string;
}

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !isConnected || !user) return;
    const handleNewMessage = (data: { username: string; message: string; timestamp: number }) => {
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        username: data.username,
        message: data.message,
        timestamp: data.timestamp
      }]);
    };

    const handlePreviousMessage = (data: ChatMessage[]) => {
      setMessages(data);
    };

    socket.on('chat-message', handleNewMessage);
    socket.on('previous-message', handlePreviousMessage);

    return () => {
      socket.off('chat-message', handleNewMessage);
      socket.off('previous-message', handlePreviousMessage);
    };
  }, [socket, isConnected, user, roomId]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !isConnected || !user) return;
    const messageData = {
      roomId,
      username: user.username,
      message: inputMessage.trim(),
      timeStamp: Date.now()
    };
    socket.emit('chat-message', messageData);
    setInputMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low">
      {/* Chat Message Feed */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-on-surface-variant text-sm py-8 opacity-60">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.username === user?.username;
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-baseline gap-2">
                  {!isMe ? (
                    <>
                      <span className="font-label-sm text-primary font-bold">{msg.username}</span>
                      <span className="text-[10px] text-outline">{formatTime(msg.timestamp)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-outline">{formatTime(msg.timestamp)}</span>
                      <span className="font-label-sm text-secondary font-bold">You</span>
                    </>
                  )}
                </div>
                <p
                  className={`text-body-md font-body-md p-2 rounded-lg ${
                    isMe
                      ? 'bg-secondary-container text-on-secondary-container rounded-tr-none'
                      : 'bg-surface-container-highest text-on-surface rounded-tl-none border border-outline-variant'
                  }`}
                >
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Form */}
      <form onSubmit={sendMessage} className="p-4 border-t border-outline-variant bg-[#0b141c]">
        <div className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="w-full bg-[#0d1117] border border-outline-variant rounded-lg pl-4 pr-10 py-2 text-body-md font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="absolute right-2 top-1.5 text-primary hover:text-primary-fixed transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;