import React from 'react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="authlayout">
      {children || 'AuthLayout Component'}
    </div>
  );
};

export default AuthLayout;
