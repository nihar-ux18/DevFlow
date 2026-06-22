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
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
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

export interface UserLeftData {
  username: string;
  message: string;
}

export interface UserTypingData {
  username: string;
  isTyping: boolean;
}

export interface EditorProps {
  roomId: string;
  initialCode?: string;
  language?: string;
  username?: string;
}