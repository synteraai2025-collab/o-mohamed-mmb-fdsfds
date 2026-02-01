import { z } from 'zod';

// Employee Status and Types
export const employeeStatusSchema = z.enum(['active', 'inactive', 'terminated', 'on_leave']);
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;

export const employmentTypeSchema = z.enum(['full_time', 'part_time', 'contract', 'internship']);
export type EmploymentType = z.infer<typeof employmentTypeSchema>;

// User Roles and Status
export const userRoleSchema = z.enum(['super_admin', 'admin', 'hr_manager', 'manager', 'employee']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending']);
export type UserStatus = z.infer<typeof userStatusSchema>;

// Department and Position Status
export const departmentStatusSchema = z.enum(['active', 'inactive']);
export type DepartmentStatus = z.infer<typeof departmentStatusSchema>;

export const positionLevelSchema = z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive']);
export type PositionLevel = z.infer<typeof positionLevelSchema>;

export const positionStatusSchema = z.enum(['active', 'inactive']);
export type PositionStatus = z.infer<typeof positionStatusSchema>;

// Leave Types and Status
export const leaveTypeSchema = z.enum(['annual', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'emergency', 'unpaid']);
export type LeaveType = z.infer<typeof leaveTypeSchema>;

export const leaveStatusSchema = z.enum(['pending', 'approved', 'rejected', 'cancelled']);
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;

// Payroll Status and Frequency
export const payrollStatusSchema = z.enum(['draft', 'pending', 'approved', 'paid', 'locked']);
export type PayrollStatus = z.infer<typeof payrollStatusSchema>;

export const payrollFrequencySchema = z.enum(['monthly', 'bi_weekly', 'weekly']);
export type PayrollFrequency = z.infer<typeof payrollFrequencySchema>;

// Bonus Types
export const bonusTypeSchema = z.enum(['performance', 'attendance', 'referral', 'holiday', 'project', 'retention', 'other']);
export type BonusType = z.infer<typeof bonusTypeSchema>;

export const bonusCalculationTypeSchema = z.enum(['fixed', 'percentage']);
export type BonusCalculationType = z.infer<typeof bonusCalculationTypeSchema>;

export const bonusFrequencySchema = z.enum(['one_time', 'monthly', 'quarterly', 'annually']);
export type BonusFrequency = z.infer<typeof bonusFrequencySchema>;

export const bonusStatusSchema = z.enum(['active', 'inactive', 'draft']);
export type BonusStatus = z.infer<typeof bonusStatusSchema>;

// User Interface
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: userRoleSchema.default('employee'),
  status: userStatusSchema.default('pending'),
  emailVerified: z.boolean().default(false),
  emailVerifiedAt: z.string().datetime().optional(),
  lastLoginAt: z.string().datetime().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.string().datetime().optional(),
  profilePhoto: z.string().url().optional(),
  phoneNumber: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  employeeId: z.string().optional(),
  preferences: z.object({
    language: z.enum(['en', 'ar']).default('en'),
    timezone: z.string().default('Asia/Riyadh'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      sms: z.boolean().default(false),
    }).default({}),
  }).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type User = z.infer<typeof userSchema>;

// Employee Interface
export const employeeSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  userId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  hireDate: z.string().datetime(),
  terminationDate: z.string().datetime().optional(),
  departmentId: z.string().uuid(),
  positionId: z.string().uuid(),
  managerId: z.string().uuid().optional(),
  employmentType: employmentTypeSchema,
  status: employeeStatusSchema.default('active'),
  salary: z.number().positive('Salary must be positive'),
  currency: z.string().default('SAR'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default('SA'),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  bankDetails: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
  }).optional(),
  profilePhoto: z.string().url().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Employee = z.infer<typeof employeeSchema>;

// Department Interface
export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.object({
    en: z.string().min(1, 'Department name (English) is required'),
    ar: z.string().min(1, 'Department name (Arabic) is required'),
  }),
  code: z.string().min(1, 'Department code is required').max(10, 'Department code must be 10 characters or less'),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  managerId: z.string().uuid().optional(),
  parentDepartmentId: z.string().uuid().optional(),
  status: departmentStatusSchema.default('active'),
  budget: z.number().positive().optional(),
  currency: z.string().default('SAR'),
  location: z.string().optional(),
  employeeCount: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type Department = z.infer<typeof departmentSchema>;

// Position Interface
export const positionSchema = z.object({
  id: z.string().uuid(),
  title: z.object({
    en: z.string().min(1, 'Position title (English) is required'),
    ar: z.string().min(1, 'Position title (Arabic) is required'),
  }),
  code: z.string().min(1, 'Position code is required').max(10, 'Position code must be 10 characters or less'),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  departmentId: z.string().uuid(),
  level: positionLevelSchema.default('mid'),
  status: positionStatusSchema.default('active'),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  currency: z.string().default('SAR'),
  reportsTo: z.string().uuid().optional(),
  employeeCount: z.number().int().nonnegative().default(0),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type Position = z.infer<typeof positionSchema>;

// Leave Request Interface
export const leaveRequestSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  leaveType: leaveTypeSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  daysRequested: z.number().positive('Days requested must be positive'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  status: leaveStatusSchema.default('pending'),
  requestedAt: z.string().datetime(),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
  rejectionReason: z.string().optional(),
  comments: z.string().optional(),
  isPaid: z.boolean().default(true),
  emergencyContact: z.string().optional(),
  handoverNotes: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

// Leave Balance Interface
export const leaveBalanceSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  year: z.number().int().positive(),
  leaveType: leaveTypeSchema,
  totalDays: z.number().positive('Total days must be positive'),
  usedDays: z.number().nonnegative('Used days cannot be negative').default(0),
  remainingDays: z.number().nonnegative('Remaining days cannot be negative'),
  carriedOverDays: z.number().nonnegative().default(0),
  expiryDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveBalance = z.infer<typeof leaveBalanceSchema>;

// Payroll Interface
export const payrollItemSchema = z.object({
  id: z.string().uuid(),
  payrollId: z.string().uuid(),
  employeeId: z.string().uuid(),
  basicSalary: z.number().positive('Basic salary must be positive'),
  allowances: z.object({
    housing: z.number().nonnegative().default(0),
    transportation: z.number().nonnegative().default(0),
    food: z.number().nonnegative().default(0),
    other: z.number().nonnegative().default(0),
  }).default({}),
  deductions: z.object({
    tax: z.number().nonnegative().default(0),
    socialInsurance: z.number().nonnegative().default(0),
    healthInsurance: z.number().nonnegative().default(0),
    loan: z.number().nonnegative().default(0),
    other: z.number().nonnegative().default(0),
  }).default({}),
  bonuses: z.object({
    performance: z.number().nonnegative().default(0),
    attendance: z.number().nonnegative().default(0),
    referral: z.number().nonnegative().default(0),
    other: z.number().nonnegative().default(0),
  }).default({}),
  overtime: z.object({
    hours: z.number().nonnegative().default(0),
    rate: z.number().nonnegative().default(0),
    amount: z.number().nonnegative().default(0),
  }).default({}),
  grossPay: z.number().positive('Gross pay must be positive'),
  totalDeductions: z.number().nonnegative().default(0),
  netPay: z.number().positive('Net pay must be positive'),
  currency: z.string().default('SAR'),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PayrollItem = z.infer<typeof payrollItemSchema>;

export const payrollSchema = z.object({
  id: z.string().uuid(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  payDate: z.string().datetime(),
  status: payrollStatusSchema.default('draft'),
  frequency: payrollFrequencySchema.default('monthly'),
  totalEmployees: z.number().int().nonnegative().default(0),
  totalGrossPay: z.number().nonnegative().default(0),
  totalDeductions: z.number().nonnegative().default(0),
  totalNetPay: z.number().nonnegative().default(0),
  currency: z.string().default('SAR'),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
  lockedBy: z.string().uuid().optional(),
  lockedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(payrollItemSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type Payroll = z.infer<typeof payrollSchema>;

// Bonus Interface
export const bonusRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.object({
    en: z.string().min(1, 'Bonus rule name (English) is required'),
    ar: z.string().min(1, 'Bonus rule name (Arabic) is required'),
  }),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  bonusType: bonusTypeSchema,
  calculationType: bonusCalculationTypeSchema,
  frequency: bonusFrequencySchema.default('one_time'),
  amount: z.number().positive('Bonus amount must be positive'),
  percentage: z.number().positive().max(100, 'Percentage cannot exceed 100').optional(),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  departmentIds: z.array(z.string().uuid()).optional(),
  positionIds: z.array(z.string().uuid()).optional(),
  employmentTypes: z.array(employmentTypeSchema).optional(),
  minServiceYears: z.number().nonnegative().default(0),
  status: bonusStatusSchema.default('draft'),
  effectiveDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type BonusRule = z.infer<typeof bonusRuleSchema>;

// Input Schemas
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
  emailVerifiedAt: true,
  lastLoginAt: true,
  resetPasswordToken: true,
  resetPasswordExpires: true,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const createDepartmentSchema = departmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  employeeCount: true,
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const createPositionSchema = positionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  employeeCount: true,
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;

export const createLeaveRequestSchema = leaveRequestSchema.omit({
  id: true,
  requestedAt: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;

export const createPayrollSchema = payrollSchema.omit({
  id: true,
  status: true,
  totalEmployees: true,
  totalGrossPay: true,
  totalDeductions: true,
  totalNetPay: true,
  approvedBy: true,
  approvedAt: true,
  lockedBy: true,
  lockedAt: true,
  items: true,
  createdAt: true,
  updatedAt: true,
});

export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;

export const createBonusRuleSchema = bonusRuleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  isActive: true,
});

export type CreateBonusRuleInput = z.infer<typeof createBonusRuleSchema>;

// Update Schemas
export const updateUserSchema = createUserSchema.partial().omit({ password: true });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export const updateDepartmentSchema = createDepartmentSchema.partial();
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

export const updatePositionSchema = createPositionSchema.partial();
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;

export const updateLeaveRequestSchema = createLeaveRequestSchema.partial();
export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestSchema>;

export const updatePayrollSchema = createPayrollSchema.partial();
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;

export const updateBonusRuleSchema = createBonusRuleSchema.partial();
export type UpdateBonusRuleInput = z.infer<typeof updateBonusRuleSchema>;

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: userRoleSchema.default('employee'),
  departmentId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

// Leave Approval Schema
export const leaveApprovalSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  comments: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type LeaveApprovalInput = z.infer<typeof leaveApprovalSchema>;
