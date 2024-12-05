'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const {data:session, status} = useSession();
  const isAuthenticated = status == 'authenticated';
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if(session){
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = () => signIn();
  const logout = () => signOut();

  return (
    <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Add this hook to export the useAuth function
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}