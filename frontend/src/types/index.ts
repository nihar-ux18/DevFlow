// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  currentRoom?: string | null;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  confirmPassword?: string;
}

// Room Types
export interface Room {
  _id: string;
  roomId: string;
  name: string;
  host: User | string;
  participants: User[];
  code: string;
  language: string;
  isActive: boolean;
  maxParticipants: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomData {
  name?: string;
  language?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// Socket Types
export interface SocketUser {
  socketId: string;
  username: string;
  roomId: string;
}

export interface CodeChangeData {
  roomId: string;
  code: string;
}

export interface TypingData {
  roomId: string;
  isTyping: boolean;
}

export interface UserJoinedData {
  username: string;
  message: string;
}

export interface CodeUpdateData {
  code: string;
  from: string;
}

export interface RoomParticipantsData {
  participants: string[];
}