import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import {
    CodeChangeData,
    TypingData,
    UserJoinedData,
    CodeUpdateData,
    RoomParticipantsData,
    UserLeftData,
    UserTypingData
} from '../types';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (roomId: string) => void;
    sendCodeChange: (data: CodeChangeData) => void;
    sendTyping: (data: TypingData) => void;
    onCodeUpdate: (callback: (data: CodeUpdateData) => void) => void;
    onUserJoined: (callback: (data: UserJoinedData) => void) => void;
    onUserLeft: (callback: (data: UserLeftData) => void) => void;
    onUserTyping: (callback: (data: UserTypingData) => void) => void;
    onRoomParticipants: (callback: (data: RoomParticipantsData) => void) => void;
    off: (event: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log(' Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        };
    }, [user]);

    const joinRoom = (roomId: string): void => {
        if (!socket || !user) return;
        socket.emit('join-room', {
            roomId,
            username: user.username
        });
    };

    const sendCodeChange = (data: CodeChangeData): void => {
        if (!socket) return;
        socket.emit('code-change', data);
    };

    const sendTyping = (data: TypingData): void => {
        if (!socket) return;
        socket.emit('typing', data);
    };

    const onCodeUpdate = (callback: (data: CodeUpdateData) => void): void => {
        if (!socket) return;
        socket.on('code-update', callback);
    };

    const onUserJoined = (callback: (data: UserJoinedData) => void): void => {
        if (!socket) return;
        socket.on('user-joined', callback);
    };

    const onUserLeft = (callback: (data: UserLeftData) => void): void => {
        if (!socket) return;
        socket.on('user-left', callback);
    };

    const onUserTyping = (callback: (data: UserTypingData) => void): void => {
        if (!socket) return;
        socket.on('user-typing', callback);
    };

    const onRoomParticipants = (callback: (data: RoomParticipantsData) => void): void => {
        if (!socket) return;
        socket.on('room-participants', callback);
    };

    const off = (event: string): void => {
        if (!socket) return;
        socket.off(event);
    };

    const value: SocketContextType = {
        socket,
        isConnected,
        joinRoom,
        sendCodeChange,
        sendTyping,
        onCodeUpdate,
        onUserJoined,
        onUserLeft,
        onUserTyping,
        onRoomParticipants,
        off,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook
export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};