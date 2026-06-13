import React from 'react';

interface SocketProviderProps {
  children?: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <div className="socketprovider">
      {children || 'SocketProvider Component'}
    </div>
  );
};

export default SocketProvider;
