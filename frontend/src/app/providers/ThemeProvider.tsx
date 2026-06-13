import React from 'react';

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div className="themeprovider">
      {children || 'ThemeProvider Component'}
    </div>
  );
};

export default ThemeProvider;
