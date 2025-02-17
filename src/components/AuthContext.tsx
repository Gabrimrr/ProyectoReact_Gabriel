import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  username: string;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');

    const login = (username: string) => {
        setUsername(username);
    };

    const logout = () => {
        setUsername('');
    };

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};