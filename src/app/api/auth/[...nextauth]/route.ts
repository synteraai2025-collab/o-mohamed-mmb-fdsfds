import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  employeeId?: string;
  language: 'en' | 'ar';
  password: string;
}

const users: User[] = [
  {
    id: '1',
    email: 'admin@hrplatform.com',
    firstName: 'System',
    lastName: 'Admin',
    role: 'super_admin',
    language: 'en',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
  },
  {
    id: '2',
    email: 'hr@hrplatform.com',
    firstName: 'HR',
    lastName: 'Manager',
    role: 'hr_manager',
    language: 'en',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
  },
];

const passwordResetTokens = new Map<string, {
  token: string;
  expiresAt: Date;
  used: boolean;
}>();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);
          
          const user = users.find(u => u.email === email);
          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isValidPassword = await compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            employeeId: user.employeeId,
            language: user.language,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
          }
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.employeeId = user.employeeId;
        token.language = user.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string;
        session.user.language = token.language as 'en' | 'ar';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

export async function requestPasswordReset(email: string): Promise<boolean> {
  const user = users.find(u => u.email === email);
  if (!user) {
    return false;
  }

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  passwordResetTokens.set(user.id, {
    token,
    expiresAt,
    used: false,
  });

  return true;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  for (const [userId, resetData] of passwordResetTokens.entries()) {
    if (resetData.token === token && !resetData.used && resetData.expiresAt > new Date()) {
      const user = users.find(u => u.id === userId);
      if (user) {
        user.password = await hash(newPassword, 10);
        resetData.used = true;
        return true;
      }
    }
  }
  return false;
}

import { hash } from 'bcryptjs';
