import React from 'react';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  return (
    <div className="publicroute">
      {children || 'PublicRoute Component'}
    </div>
  );
};

export default PublicRoute;
