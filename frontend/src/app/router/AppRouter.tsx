import React from 'react';

interface AppRouterProps {
  children?: React.ReactNode;
}

export const AppRouter: React.FC<AppRouterProps> = ({ children }) => {
  return (
    <div className="approuter">
      {children || 'AppRouter Component'}
    </div>
  );
};

export default AppRouter;
