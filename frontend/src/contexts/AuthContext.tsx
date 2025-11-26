import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import api from '@/api/axios';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => Promise<void>; // Updated to Promise
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/users/me/');
      const userData = response.data;

      // Map backend response to frontend User type
      const mappedUser: User = {
        id: userData.id,
        name: (userData.first_name || userData.last_name) ? `${userData.first_name} ${userData.last_name}`.trim() : userData.username,
        role: userData.role as UserRole,
        avatar: 'https://ui-avatars.com/api/?name=' + ((userData.first_name || userData.last_name) ? `${userData.first_name}+${userData.last_name}` : userData.username), // Default avatar
        email: userData.email,
        tenantId: userData.tenant, // Assuming tenant ID is returned
      };

      setUser(mappedUser);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (role: UserRole) => {
    // Role argument is kept for compatibility but logic now relies on token
    // In a real flow, login() would take credentials, but here we assume 
    // the token is already set by AuthModal before calling this context login,
    // OR we can move the API call here. 
    // Given AuthModal handles the API call and sets token, we just need to fetch user.

    setLoading(true);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
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
