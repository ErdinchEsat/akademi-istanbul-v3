import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/utils/constants';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (role: UserRole) => {
    let baseUser: User = MOCK_USERS.student; // Default

    if (role === UserRole.ADMIN) baseUser = MOCK_USERS.admin;
    else if (role === UserRole.INSTRUCTOR) baseUser = MOCK_USERS.instructor;
    else if (role === UserRole.TENANT_ADMIN) baseUser = MOCK_USERS.admin; // Simulate tenant admin

    const newUser: User = {
      ...baseUser,
      role: role,
    };

    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
