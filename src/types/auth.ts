import { z } from 'zod';

export const userRoleSchema = z.enum([
  'super-admin',
  'admin',
  'hr-manager',
  'hr-staff',
  'department-manager',
  'employee'
]);

export const userStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending']);

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  
  // Authentication
  password: z.string().min(8, 'Password must be at least 8 characters').optional(), // Optional for OAuth users
  emailVerified: z.date().optional(),
  
  // Profile
  avatar: z.string().url().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  
  // Role and permissions
  role: userRoleSchema.default('employee'),
  status: userStatusSchema.default('pending'),
  
  // Employee link (for HR users)
  employeeId: z.string().uuid().optional(),
  
  // Preferences
  language: z.enum(['en', 'ar']).default('en'),
  timezone: z.string().default('UTC'),
  
  // Security
  twoFactorEnabled: z.boolean().default(false),
  twoFactorSecret: z.string().optional(),
  
  // Password reset
  resetToken: z.string().optional(),
  resetTokenExpiry: z.date().optional(),
  
  // Last activity
  lastLoginAt: z.date().optional(),
  lastPasswordChange: z.date().optional(),
  
  // System fields
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({
  id: true,
  emailVerified: true,
  resetToken: true,
  resetTokenExpiry: true,
  lastLoginAt: true,
  lastPasswordChange: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateUserSchema = userSchema.partial().omit({
  id: true,
  email: true, // Email cannot be changed
  createdAt: true,
  updatedBy: true,
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: userRoleSchema.optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Session and JWT types
export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  employeeId?: string;
  language: string;
  avatar?: string;
}

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: UserRole;
  employeeId?: string;
  iat: number;
  exp: number;
}

// Permission types
export interface Permission {
  resource: string;
  actions: string[];
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  'super-admin': [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'employees', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'departments', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'positions', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'leaves', actions: ['create', 'read', 'update', 'delete', 'approve', 'manage'] },
    { resource: 'payroll', actions: ['create', 'read', 'update', 'delete', 'process', 'approve', 'manage'] },
    { resource: 'bonuses', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'reports', actions: ['create', 'read', 'export', 'manage'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete', 'manage'] },
  ],
  'admin': [
    { resource: 'users', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'employees', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'departments', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'positions', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'leaves', actions: ['create', 'read', 'update', 'approve', 'manage'] },
    { resource: 'payroll', actions: ['create', 'read', 'update', 'process', 'approve', 'manage'] },
    { resource: 'bonuses', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'reports', actions: ['create', 'read', 'export', 'manage'] },
  ],
  'hr-manager': [
    { resource: 'employees', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'departments', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'positions', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'leaves', actions: ['create', 'read', 'update', 'approve', 'manage'] },
    { resource: 'payroll', actions: ['read', 'update', 'process', 'manage'] },
    { resource: 'bonuses', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'reports', actions: ['create', 'read', 'export'] },
  ],
  'hr-staff': [
    { resource: 'employees', actions: ['read', 'update'] },
    { resource: 'leaves', actions: ['create', 'read', 'update', 'manage'] },
    { resource: 'payroll', actions: ['read'] },
    { resource: 'reports', actions: ['read', 'export'] },
  ],
  'department-manager': [
    { resource: 'employees', actions: ['read'] },
    { resource: 'leaves', actions: ['read', 'approve'] },
    { resource: 'reports', actions: ['read'] },
  ],
  'employee': [
    { resource: 'profile', actions: ['read', 'update'] },
    { resource: 'leaves', actions: ['create', 'read'] },
    { resource: 'payroll', actions: ['read'] },
  ],
};

// Utility functions
export function hasPermission(role: UserRole, resource: string, action: string): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.some(permission => 
    permission.resource === resource && 
    (permission.actions.includes(action) || permission.actions.includes('manage'))
  );
}

export function getRoleHierarchy(): UserRole[] {
  return ['employee', 'department-manager', 'hr-staff', 'hr-manager', 'admin', 'super-admin'];
}

export function isRoleHigher(role1: UserRole, role2: UserRole): boolean {
  const hierarchy = getRoleHierarchy();
  const index1 = hierarchy.indexOf(role1);
  const index2 = hierarchy.indexOf(role2);
  return index1 > index2;
}
