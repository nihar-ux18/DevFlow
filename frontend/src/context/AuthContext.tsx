import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import { User, LoginCredentials, RegisterData } from '../types';
import toast from 'react-hot-toast';

// Define Context Type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props Type
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Load user on mount
  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data.data);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Register
  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.register(userData);
      const { token, ...user } = response.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast.success('Registration successful! 🎉');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login(credentials);
      const { token, ...user } = response.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast.success('Welcome back! 👋');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    loading,
    token,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with type safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};