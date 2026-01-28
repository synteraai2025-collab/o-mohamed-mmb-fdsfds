'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType, Language } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      const userData: User = {
        id: session.user.id,
        email: session.user.email!,
        firstName: session.user.firstName as string,
        lastName: session.user.lastName as string,
        role: session.user.role as any,
        isActive: true,
        employeeId: session.user.employeeId as string,
        profileImage: session.user.profileImage as string,
        language: session.user.language as Language,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(userData);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [session, status]);

  const login = async (credentials: { email: string; password: string }) => {
    // This is handled by NextAuth signIn in the login page
    throw new Error('Use NextAuth signIn directly');
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const register = async (data: any) => {
    throw new Error('Registration not implemented in this context');
  };

  const updateProfile = async (data: Partial<User>) => {
    // This would typically call an API endpoint
    throw new Error('Profile update not implemented in this context');
  };

  const changeLanguage = async (language: Language) => {
    // This would typically call an API endpoint to update user preference
    throw new Error('Language change not implemented in this context');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    changeLanguage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
