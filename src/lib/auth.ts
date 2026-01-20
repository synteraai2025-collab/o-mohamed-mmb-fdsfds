/**
 * NextAuth configuration for HR Management Platform
 * Implements email/password authentication with role-based access control
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Mock database - replace with actual Prisma client
const mockUsers = [
  {
    id: "1",
    email: "admin@hrplatform.com",
    firstName: "System",
    lastName: "Admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "SUPER_ADMIN",
    employeeId: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "hr@hrplatform.com",
    firstName: "HR",
    lastName: "Manager",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "HR_MANAGER",
    employeeId: "EMP001",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "employee@hrplatform.com",
    firstName: "John",
    lastName: "Doe",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "EMPLOYEE",
    employeeId: "EMP002",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Uncomment when Prisma is set up
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials);

          // Find user in mock database
          const user = mockUsers.find((u) => u.email === email);
          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error("Account is deactivated. Please contact HR.");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            employeeId: user.employeeId,
            isActive: user.isActive,
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.employeeId = user.employeeId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string | null;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Log successful login
      console.log(`User ${user.email} signed in`);
    },
    async signOut({ token }) {
      // Log logout
      console.log(`User signed out`);
    },
  },
};

/**
 * Role-based access control helpers
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HR_ADMIN: "HR_ADMIN",
  HR_MANAGER: "HR_MANAGER",
  DEPARTMENT_MANAGER: "DEPARTMENT_MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export const PERMISSIONS = {
  // Employee management
  VIEW_EMPLOYEES: "VIEW_EMPLOYEES",
  CREATE_EMPLOYEES: "CREATE_EMPLOYEES",
  UPDATE_EMPLOYEES: "UPDATE_EMPLOYEES",
  DELETE_EMPLOYEES: "DELETE_EMPLOYEES",
  
  // Department management
  VIEW_DEPARTMENTS: "VIEW_DEPARTMENTS",
  CREATE_DEPARTMENTS: "CREATE_DEPARTMENTS",
  UPDATE_DEPARTMENTS: "UPDATE_DEPARTMENTS",
  DELETE_DEPARTMENTS: "DELETE_DEPARTMENTS",
  
  // Position management
  VIEW_POSITIONS: "VIEW_POSITIONS",
  CREATE_POSITIONS: "CREATE_POSITIONS",
  UPDATE_POSITIONS: "UPDATE_POSITIONS",
  DELETE_POSITIONS: "DELETE_POSITIONS",
  
  // Leave management
  VIEW_LEAVES: "VIEW_LEAVES",
  CREATE_LEAVES: "CREATE_LEAVES",
  APPROVE_LEAVES: "APPROVE_LEAVES",
  UPDATE_LEAVES: "UPDATE_LEAVES",
  DELETE_LEAVES: "DELETE_LEAVES",
  
  // Payroll management
  VIEW_PAYROLL: "VIEW_PAYROLL",
  CREATE_PAYROLL: "CREATE_PAYROLL",
  APPROVE_PAYROLL: "APPROVE_PAYROLL",
  UPDATE_PAYROLL: "UPDATE_PAYROLL",
  DELETE_PAYROLL: "DELETE_PAYROLL",
  
  // Reports
  VIEW_REPORTS: "VIEW_REPORTS",
  GENERATE_REPORTS: "GENERATE_REPORTS",
  EXPORT_DATA: "EXPORT_DATA",
  
  // User management
  VIEW_USERS: "VIEW_USERS",
  CREATE_USERS: "CREATE_USERS",
  UPDATE_USERS: "UPDATE_USERS",
  DELETE_USERS: "DELETE_USERS",
  
  // Settings
  VIEW_SETTINGS: "VIEW_SETTINGS",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.HR_ADMIN]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.CREATE_EMPLOYEES,
    PERMISSIONS.UPDATE_EMPLOYEES,
    PERMISSIONS.VIEW_DEPARTMENTS,
    PERMISSIONS.VIEW_POSITIONS,
    PERMISSIONS.VIEW_LEAVES,
    PERMISSIONS.CREATE_LEAVES,
    PERMISSIONS.UPDATE_LEAVES,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.UPDATE_USERS,
  ],
  [ROLES.HR_MANAGER]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.CREATE_EMPLOYEES,
    PERMISSIONS.UPDATE_EMPLOYEES,
    PERMISSIONS.VIEW_DEPARTMENTS,
    PERMISSIONS.CREATE_DEPARTMENTS,
    PERMISSIONS.UPDATE_DEPARTMENTS,
    PERMISSIONS.VIEW_POSITIONS,
    PERMISSIONS.CREATE_POSITIONS,
    PERMISSIONS.UPDATE_POSITIONS,
    PERMISSIONS.VIEW_LEAVES,
    PERMISSIONS.CREATE_LEAVES,
    PERMISSIONS.APPROVE_LEAVES,
    PERMISSIONS.UPDATE_LEAVES,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.CREATE_PAYROLL,
    PERMISSIONS.APPROVE_PAYROLL,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.EXPORT_DATA,
  ],
  [ROLES.DEPARTMENT_MANAGER]: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_LEAVES,
    PERMISSIONS.CREATE_LEAVES,
    PERMISSIONS.APPROVE_LEAVES,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_LEAVES,
    PERMISSIONS.CREATE_LEAVES,
    PERMISSIONS.VIEW_PAYROLL,
  ],
} as const;

/**
 * Check if user has specific permission
 */
export function hasPermission(userRole: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return permissions ? permissions.includes(permission as any) : false;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(userRole: string, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(userRole: string, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get user role hierarchy level (higher number = higher authority)
 */
export function getRoleLevel(role: string): number {
  const hierarchy = {
    [ROLES.EMPLOYEE]: 1,
    [ROLES.DEPARTMENT_MANAGER]: 2,
    [ROLES.HR_ADMIN]: 3,
    [ROLES.HR_MANAGER]: 4,
    [ROLES.SUPER_ADMIN]: 5,
  };
  return hierarchy[role as keyof typeof hierarchy] || 0;
}

/**
 * Check if user role is higher than or equal to target role
 */
export function hasRoleLevel(userRole: string, targetRole: string): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(targetRole);
}
