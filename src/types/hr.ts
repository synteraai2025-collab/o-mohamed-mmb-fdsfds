import { z } from 'zod';

// Employee Types
export const EmploymentStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  TERMINATED: 'TERMINATED',
  ON_LEAVE: 'ON_LEAVE',
  PROBATION: 'PROBATION',
} as const;

export type EmploymentStatus = typeof EmploymentStatus[keyof typeof EmploymentStatus];

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const MaritalStatus = {
  SINGLE: 'SINGLE',
  MARRIED: 'MARRIED',
  DIVORCED: 'DIVORCED',
  WIDOWED: 'WIDOWED',
} as const;

export type MaritalStatus = typeof MaritalStatus[keyof typeof MaritalStatus];

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  hireDate: Date;
  terminationDate?: Date;
  employmentStatus: EmploymentStatus;
  departmentId: string;
  positionId: string;
  managerId?: string;
  salary: number;
  bankName?: string;
  bankAccountNumber?: string;
  iban?: string;
  passportNumber?: string;
  passportExpiryDate?: Date;
  visaNumber?: string;
  visaExpiryDate?: Date;
  profilePhoto?: string;
  notes?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const employeeSchema = z.object({
  id: z.string().uuid(),
  employeeNumber: z.string().min(1, 'Employee number is required').max(20, 'Employee number must be less than 20 characters'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  dateOfBirth: z.date().optional(),
  gender: z.nativeEnum(Gender).optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  nationality: z.string().max(50, 'Nationality must be less than 50 characters').optional(),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  city: z.string().max(50, 'City must be less than 50 characters').optional(),
  country: z.string().max(50, 'Country must be less than 50 characters').optional(),
  postalCode: z.string().max(20, 'Postal code must be less than 20 characters').optional(),
  emergencyContactName: z.string().max(100, 'Emergency contact name must be less than 100 characters').optional(),
  emergencyContactPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid emergency contact phone').optional(),
  emergencyContactRelationship: z.string().max(50, 'Relationship must be less than 50 characters').optional(),
  hireDate: z.date(),
  terminationDate: z.date().optional(),
  employmentStatus: z.nativeEnum(EmploymentStatus),
  departmentId: z.string().uuid('Invalid department ID'),
  positionId: z.string().uuid('Invalid position ID'),
  managerId: z.string().uuid().optional(),
  salary: z.number().positive('Salary must be positive'),
  bankName: z.string().max(100, 'Bank name must be less than 100 characters').optional(),
  bankAccountNumber: z.string().max(50, 'Account number must be less than 50 characters').optional(),
  iban: z.string().max(34, 'IBAN must be less than 34 characters').optional(),
  passportNumber: z.string().max(20, 'Passport number must be less than 20 characters').optional(),
  passportExpiryDate: z.date().optional(),
  visaNumber: z.string().max(20, 'Visa number must be less than 20 characters').optional(),
  visaExpiryDate: z.date().optional(),
  profilePhoto: z.string().url().optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  userId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEmployeeSchema = employeeSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Department Types
export interface Department {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  managerId?: string;
  parentDepartmentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Department name is required').max(100, 'Department name must be less than 100 characters'),
  nameAr: z.string().min(1, 'Arabic department name is required').max(100, 'Arabic department name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  descriptionAr: z.string().max(500, 'Arabic description must be less than 500 characters').optional(),
  managerId: z.string().uuid().optional(),
  parentDepartmentId: z.string().uuid().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDepartmentSchema = departmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDepartmentSchema = departmentSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Position Types
export interface Position {
  id: string;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  departmentId: string;
  level: number;
  minSalary: number;
  maxSalary: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const positionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Position title is required').max(100, 'Position title must be less than 100 characters'),
  titleAr: z.string().min(1, 'Arabic position title is required').max(100, 'Arabic position title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  descriptionAr: z.string().max(500, 'Arabic description must be less than 500 characters').optional(),
  departmentId: z.string().uuid('Invalid department ID'),
  level: z.number().int().min(1, 'Level must be at least 1').max(10, 'Level must be at most 10'),
  minSalary: z.number().positive('Minimum salary must be positive'),
  maxSalary: z.number().positive('Maximum salary must be positive'),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine((data) => data.maxSalary >= data.minSalary, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['maxSalary'],
});

export const createPositionSchema = positionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePositionSchema = positionSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Leave Types
export const LeaveType = {
  ANNUAL: 'ANNUAL',
  SICK: 'SICK',
  PERSONAL: 'PERSONAL',
  MATERNITY: 'MATERNITY',
  PATERNITY: 'PATERNITY',
  BEREAVEMENT: 'BEREAVEMENT',
  JURY_DUTY: 'JURY_DUTY',
  UNPAID: 'UNPAID',
  COMPENSATORY: 'COMPENSATORY',
} as const;

export type LeaveType = typeof LeaveType[keyof typeof LeaveType];

export const LeaveStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type LeaveStatus = typeof LeaveStatus[keyof typeof LeaveStatus];

export interface Leave {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: LeaveStatus;
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const leaveSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid('Invalid employee ID'),
  leaveType: z.nativeEnum(LeaveType),
  startDate: z.date(),
  endDate: z.date(),
  days: z.number().int().positive('Days must be positive'),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
  status: z.nativeEnum(LeaveStatus),
  requestedBy: z.string().uuid('Invalid requested by user ID'),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.date().optional(),
  rejectionReason: z.string().max(500, 'Rejection reason must be less than 500 characters').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export const createLeaveSchema = leaveSchema.omit({
  id: true,
  status: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeaveSchema = leaveSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Payroll Types
export interface Payroll {
  id: string;
  employeeId: string;
  payrollPeriod: string; // YYYY-MM format
  basicSalary: number;
  housingAllowance: number;
  transportationAllowance: number;
  foodAllowance: number;
  otherAllowances: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimeAmount: number;
  grossSalary: number;
  socialInsurance: number;
  healthInsurance: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  bonusAmount: number;
  leaveDeduction: number;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  processedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const payrollSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid('Invalid employee ID'),
  payrollPeriod: z.string().regex(/^\d{4}-\d{2}$/, 'Payroll period must be in YYYY-MM format'),
  basicSalary: z.number().positive('Basic salary must be positive'),
  housingAllowance: z.number().min(0, 'Housing allowance cannot be negative'),
  transportationAllowance: z.number().min(0, 'Transportation allowance cannot be negative'),
  foodAllowance: z.number().min(0, 'Food allowance cannot be negative'),
  otherAllowances: z.number().min(0, 'Other allowances cannot be negative'),
  overtimeHours: z.number().min(0, 'Overtime hours cannot be negative'),
  overtimeRate: z.number().positive('Overtime rate must be positive'),
  overtimeAmount: z.number().min(0, 'Overtime amount cannot be negative'),
  grossSalary: z.number().positive('Gross salary must be positive'),
  socialInsurance: z.number().min(0, 'Social insurance cannot be negative'),
  healthInsurance: z.number().min(0, 'Health insurance cannot be negative'),
  tax: z.number().min(0, 'Tax cannot be negative'),
  otherDeductions: z.number().min(0, 'Other deductions cannot be negative'),
  totalDeductions: z.number().min(0, 'Total deductions cannot be negative'),
  netSalary: z.number().positive('Net salary must be positive'),
  bonusAmount: z.number().min(0, 'Bonus amount cannot be negative'),
  leaveDeduction: z.number().min(0, 'Leave deduction cannot be negative'),
  status: z.enum(['DRAFT', 'PROCESSED', 'PAID']),
  processedAt: z.date().optional(),
  paidAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPayrollSchema = payrollSchema.omit({
  id: true,
  grossSalary: true,
  overtimeAmount: true,
  totalDeductions: true,
  netSalary: true,
  status: true,
  processedAt: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePayrollSchema = payrollSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Bonus Types
export const BonusType = {
  PERFORMANCE: 'PERFORMANCE',
  ANNUAL: 'ANNUAL',
  PROJECT: 'PROJECT',
  REFERRAL: 'REFERRAL',
  RETENTION: 'RETENTION',
  HOLIDAY: 'HOLIDAY',
  OTHER: 'OTHER',
} as const;

export type BonusType = typeof BonusType[keyof typeof BonusType];

export interface Bonus {
  id: string;
  employeeId: string;
  bonusType: BonusType;
  amount: number;
  currency: string;
  description?: string;
  descriptionAr?: string;
  payrollPeriod?: string; // YYYY-MM format
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const bonusSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid('Invalid employee ID'),
  bonusType: z.nativeEnum(BonusType),
  amount: z.number().positive('Bonus amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  descriptionAr: z.string().max(500, 'Arabic description must be less than 500 characters').optional(),
  payrollPeriod: z.string().regex(/^\d{4}-\d{2}$/, 'Payroll period must be in YYYY-MM format').optional(),
  isPaid: z.boolean(),
  paidAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBonusSchema = bonusSchema.omit({
  id: true,
  isPaid: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBonusSchema = bonusSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
export type CreateBonusInput = z.infer<typeof createBonusSchema>;
export type UpdateBonusInput = z.infer<typeof updateBonusSchema>;
