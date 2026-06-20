import { Server, Socket } from 'socket.io';

// Types
interface SocketUser {
  socketId: string;
  username: string;
  roomId: string;
}

interface CodeChangeData {
  roomId: string;
  code: string;
}

interface TypingData {
  roomId: string;
  isTyping: boolean;
}

interface JoinRoomData {
  roomId: string;
  username: string;
}

// Store connected users
const users: Map<string, SocketUser> = new Map();

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join Room
    socket.on('join-room', (data: JoinRoomData) => {
      const { roomId, username } = data;
      
      // Leave all previous rooms
      const previousRoom = users.get(socket.id)?.roomId;
      if (previousRoom) {
        socket.leave(previousRoom);
      }

      // Join new room
      socket.join(roomId);
      
      // Store user data
      users.set(socket.id, { socketId: socket.id, username, roomId });
      
      console.log(`👤 ${username} joined room: ${roomId}`);

      // Notify others in room
      socket.to(roomId).emit('user-joined', {
        username,
        message: `${username} has joined the room!`,
        participants: getRoomParticipants(io, roomId)
      });

      // Send current participants to the new user
      socket.emit('room-participants', {
        participants: getRoomParticipants(io, roomId)
      });
    });

    // Code Change (Real-time Sync)
    socket.on('code-change', (data: CodeChangeData) => {
      const { roomId, code } = data;
      const user = users.get(socket.id);
      
      if (user) {
        socket.to(roomId).emit('code-update', {
          code,
          from: user.username,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Typing Indicator
    socket.on('typing', (data: TypingData) => {
      const { roomId, isTyping } = data;
      const user = users.get(socket.id);
      
      if (user) {
        socket.to(roomId).emit('user-typing', {
          username: user.username,
          isTyping
        });
      }
    });

    // Cursor Position
    socket.on('cursor-move', (data: { roomId: string; position: { lineNumber: number; column: number } }) => {
      const { roomId, position } = data;
      const user = users.get(socket.id);
      
      if (user) {
        socket.to(roomId).emit('cursor-update', {
          username: user.username,
          position
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      const user = users.get(socket.id);
      if (user) {
        const { username, roomId } = user;
        console.log(`${username} disconnected from ${roomId}`);
        
        socket.to(roomId).emit('user-left', {
          username,
          message: `${username} has left the room.`,
          participants: getRoomParticipants(io, roomId)
        });
        
        users.delete(socket.id);
      }
    });
  });
};

// Helper: Get all participants in a room
const getRoomParticipants = (io: Server, roomId: string): string[] => {
  const room = io.sockets.adapter.rooms.get(roomId);
  const participants: string[] = [];
  
  if (room) {
    room.forEach((socketId) => {
      const user = users.get(socketId);
      if (user) {
        participants.push(user.username);
      }
    });
  }
  
  return participants;
};