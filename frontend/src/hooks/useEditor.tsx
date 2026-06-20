import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { CodeUpdateData, UserTypingData } from '../types';
import toast from 'react-hot-toast';

interface UseEditorProps {
    roomId: string;
    username?: string;
    initialCode?: string;
}

export const useEditor = ({ roomId, username, initialCode = '' }: UseEditorProps) => {
    const [code, setCode] = useState<string>(initialCode);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [participants, setParticipants] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
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
    } = useSocket();

    useEffect(() => {
        if (isConnected) {
            joinRoom(roomId);
        }
    }, [isConnected, roomId, joinRoom]);

    useEffect(() => {
        const handleCodeUpdate = (data: CodeUpdateData) => {
            if (data.from !== username) {
                setCode(data.code);
            }
        };

        onCodeUpdate(handleCodeUpdate);

        return () => {
            off('code-update');
        };
    }, [onCodeUpdate, off, username]);

    useEffect(() => {
        const handleUserJoined = (data: { username: string; message: string }) => {
            toast.success(data.message);
        };

        const handleUserLeft = (data: { username: string; message: string }) => {
            toast.error(data.message);
        };

        const handleUserTyping = (data: UserTypingData) => {
            setTypingUsers(prev => {
                if (data.isTyping) {
                    if (!prev.includes(data.username)) {
                        return [...prev, data.username];
                    }
                    return prev;
                } else {
                    return prev.filter(name => name !== data.username);
                }
            });
        };

        const handleRoomParticipants = (data: { participants: string[] }) => {
            setParticipants(data.participants);
        };

        onUserJoined(handleUserJoined);
        onUserLeft(handleUserLeft);
        onUserTyping(handleUserTyping);
        onRoomParticipants(handleRoomParticipants);

        return () => {
            off('user-joined');
            off('user-left');
            off('user-typing');
            off('room-participants');
        };
    }, [onUserJoined, onUserLeft, onUserTyping, onRoomParticipants, off]);

    const handleCodeChange = useCallback((newCode: string) => {
        setCode(newCode);
        sendCodeChange({ roomId, code: newCode });
    }, [roomId, sendCodeChange]);

    const handleTyping = useCallback((isTypingNow: boolean) => {
        if (isTypingNow !== isTyping) {
            setIsTyping(isTypingNow);
            sendTyping({ roomId, isTyping: isTypingNow });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (isTypingNow) {
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                sendTyping({ roomId, isTyping: false });
            }, 3000);
        }
    }, [roomId, isTyping, sendTyping]);

    return {
        code,
        setCode: handleCodeChange,
        handleTyping,
        participants,
        typingUsers,
        isConnected,
    };
};