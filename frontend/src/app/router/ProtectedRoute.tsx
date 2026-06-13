import React from 'react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <div className="protectedroute">
      {children || 'ProtectedRoute Component'}
    </div>
  );
};

export default ProtectedRoute;
