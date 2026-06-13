import React from 'react';

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <div className="authprovider">
      {children || 'AuthProvider Component'}
    </div>
  );
};

export default AuthProvider;
