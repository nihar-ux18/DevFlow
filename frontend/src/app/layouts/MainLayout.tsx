import React from 'react';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="mainlayout">
      {children || 'MainLayout Component'}
    </div>
  );
};

export default MainLayout;
