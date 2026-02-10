import { z } from 'zod';

export const userRoleSchema = z.enum(['super_admin', 'hr_admin', 'hr_manager', 'hr_staff', 'manager', 'employee']);
export const userStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending']);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  role: userRoleSchema.default('employee'),
  status: userStatusSchema.default('pending'),
  
  // Profile Information
  phone: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
  language: z.enum(['en', 'ar']).default('en'),
  timezone: z.string().default('UTC'),
  
  // Security
  emailVerified: z.boolean().default(false),
  emailVerifiedAt: z.string().datetime().optional().nullable(),
  lastLoginAt: z.string().datetime().optional().nullable(),
  lastLoginIp: z.string().optional().nullable(),
  passwordResetToken: z.string().optional().nullable(),
  passwordResetExpires: z.string().datetime().optional().nullable(),
  
  // Employee Link
  employeeId: z.string().uuid().optional().nullable(),
  
  // System Fields
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  emailVerified: true,
  emailVerifiedAt: true,
  lastLoginAt: true,
  lastLoginIp: true,
  passwordResetToken: true,
  passwordResetExpires: true,
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  role: userRoleSchema.default('employee'),
  departmentId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
  token: z.string().optional(), // For invitation acceptance
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
  language: z.enum(['en', 'ar']).default('en'),
  timezone: z.string().default('UTC'),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;

// User with relations
export interface UserWithRelations extends User {
  employee?: {
    id: string;
    employeeNumber: string;
    department?: {
      id: string;
      name: string;
      nameAr?: string;
    };
    position?: {
      id: string;
      title: string;
      titleAr?: string;
    };
  };
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// User permissions and roles
export interface UserPermissions {
  canViewEmployees: boolean;
  canCreateEmployees: boolean;
  canUpdateEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  canViewDepartments: boolean;
  canManageDepartments: boolean;
  canViewPositions: boolean;
  canManagePositions: boolean;
  canViewLeaves: boolean;
  canManageLeaves: boolean;
  canViewPayroll: boolean;
  canManagePayroll: boolean;
  canViewReports: boolean;
  canExportReports: boolean;
  canViewSettings: boolean;
  canManageSettings: boolean;
}

// User search and filter types
export interface UserSearchParams {
  query?: string;
  role?: UserRole;
  status?: UserStatus;
  departmentId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'role' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchResult {
  users: UserWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  super_admin: {
    canViewEmployees: true,
    canCreateEmployees: true,
    canUpdateEmployees: true,
    canDeleteEmployees: true,
    canViewUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: true,
    canViewDepartments: true,
    canManageDepartments: true,
    canViewPositions: true,
    canManagePositions: true,
    canViewLeaves: true,
    canManageLeaves: true,
    canViewPayroll: true,
    canManagePayroll: true,
    canViewReports: true,
    canExportReports: true,
    canViewSettings: true,
    canManageSettings: true,
  },
  hr_admin: {
    canViewEmployees: true,
    canCreateEmployees: true,
    canUpdateEmployees: true,
    canDeleteEmployees: false,
    canViewUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: false,
    canViewDepartments: true,
    canManageDepartments: true,
    canViewPositions: true,
    canManagePositions: true,
    canViewLeaves: true,
    canManageLeaves: true,
    canViewPayroll: true,
    canManagePayroll: true,
    canViewReports: true,
    canExportReports: true,
    canViewSettings: true,
    canManageSettings: false,
  },
  hr_manager: {
    canViewEmployees: true,
    canCreateEmployees: true,
    canUpdateEmployees: true,
    canDeleteEmployees: false,
    canViewUsers: true,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewDepartments: true,
    canManageDepartments: false,
    canViewPositions: true,
    canManagePositions: false,
    canViewLeaves: true,
    canManageLeaves: true,
    canViewPayroll: true,
    canManagePayroll: false,
    canViewReports: true,
    canExportReports: true,
    canViewSettings: false,
    canManageSettings: false,
  },
  hr_staff: {
    canViewEmployees: true,
    canCreateEmployees: false,
    canUpdateEmployees: true,
    canDeleteEmployees: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewDepartments: true,
    canManageDepartments: false,
    canViewPositions: true,
    canManagePositions: false,
    canViewLeaves: true,
    canManageLeaves: false,
    canViewPayroll: false,
    canManagePayroll: false,
    canViewReports: true,
    canExportReports: false,
    canViewSettings: false,
    canManageSettings: false,
  },
  manager: {
    canViewEmployees: true,
    canCreateEmployees: false,
    canUpdateEmployees: false,
    canDeleteEmployees: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewDepartments: true,
    canManageDepartments: false,
    canViewPositions: true,
    canManagePositions: false,
    canViewLeaves: true,
    canManageLeaves: true,
    canViewPayroll: false,
    canManagePayroll: false,
    canViewReports: true,
    canExportReports: false,
    canViewSettings: false,
    canManageSettings: false,
  },
  employee: {
    canViewEmployees: false,
    canCreateEmployees: false,
    canUpdateEmployees: false,
    canDeleteEmployees: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewDepartments: false,
    canManageDepartments: false,
    canViewPositions: false,
    canManagePositions: false,
    canViewLeaves: true,
    canManageLeaves: false,
    canViewPayroll: false,
    canManagePayroll: false,
    canViewReports: false,
    canExportReports: false,
    canViewSettings: false,
    canManageSettings: false,
  },
};

// Helper function to check permissions
export const hasPermission = (userRole: UserRole, permission: keyof UserPermissions): boolean => {
  return ROLE_PERMISSIONS[userRole]?.[permission] || false;
};

// Helper function to get user display name
export const getUserDisplayName = (user: User | UserWithRelations): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Helper function to get user initials
export const getUserInitials = (user: User | UserWithRelations): string => {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};
