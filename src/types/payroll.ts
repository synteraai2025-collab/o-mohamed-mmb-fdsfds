import { z } from 'zod';

export const payrollStatusSchema = z.enum([
  'draft',
  'pending-approval',
  'approved',
  'processing',
  'paid',
  'cancelled',
  'rejected'
]);

export const payFrequencySchema = z.enum([
  'monthly',
  'bi-weekly',
  'weekly',
  'semi-monthly',
  'quarterly',
  'annually'
]);

export const paymentMethodSchema = z.enum([
  'bank-transfer',
  'cash',
  'cheque',
  'mobile-money',
  'crypto'
]);

export type PayrollStatus = z.infer<typeof payrollStatusSchema>;
export type PayFrequency = z.infer<typeof payFrequencySchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Payroll Period
export const payrollPeriodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Period name is required').max(100, 'Period name must be 100 characters or less'),
  payFrequency: payFrequencySchema.default('monthly'),
  
  // Date range
  startDate: z.date(),
  endDate: z.date(),
  payDate: z.date(), // Actual payment date
  
  // Status and processing
  status: payrollStatusSchema.default('draft'),
  isLocked: z.boolean().default(false), // Prevent modifications when locked
  
  // System fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type PayrollPeriod = z.infer<typeof payrollPeriodSchema>;

// Payroll Record (Individual Employee)
export const payrollRecordSchema = z.object({
  id: z.string().uuid(),
  payrollPeriodId: z.string().uuid('Payroll period ID is required'),
  employeeId: z.string().uuid('Employee ID is required'),
  
  // Basic salary and allowances
  basicSalary: z.number().min(0, 'Basic salary must be non-negative'),
  housingAllowance: z.number().min(0, 'Housing allowance must be non-negative').default(0),
  transportAllowance: z.number().min(0, 'Transport allowance must be non-negative').default(0),
  foodAllowance: z.number().min(0, 'Food allowance must be non-negative').default(0),
  otherAllowances: z.number().min(0, 'Other allowances must be non-negative').default(0),
  
  // Overtime and bonuses
  overtimeHours: z.number().min(0, 'Overtime hours must be non-negative').default(0),
  overtimeRate: z.number().min(0, 'Overtime rate must be non-negative').default(0),
  overtimeAmount: z.number().min(0, 'Overtime amount must be non-negative').default(0),
  
  performanceBonus: z.number().min(0, 'Performance bonus must be non-negative').default(0),
  attendanceBonus: z.number().min(0, 'Attendance bonus must be non-negative').default(0),
  otherBonuses: z.number().min(0, 'Other bonuses must be non-negative').default(0),
  
  // Gross calculations
  grossSalary: z.number().min(0, 'Gross salary must be non-negative'),
  
  // Deductions
  incomeTax: z.number().min(0, 'Income tax must be non-negative').default(0),
  socialSecurity: z.number().min(0, 'Social security must be non-negative').default(0),
  healthInsurance: z.number().min(0, 'Health insurance must be non-negative').default(0),
  pension: z.number().min(0, 'Pension must be non-negative').default(0),
  unionDues: z.number().min(0, 'Union dues must be non-negative').default(0),
  loanDeductions: z.number().min(0, 'Loan deductions must be non-negative').default(0),
  advanceDeductions: z.number().min(0, 'Advance deductions must be non-negative').default(0),
  otherDeductions: z.number().min(0, 'Other deductions must be non-negative').default(0),
  
  // Total deductions
  totalDeductions: z.number().min(0, 'Total deductions must be non-negative'),
  
  // Net salary
  netSalary: z.number().min(0, 'Net salary must be non-negative'),
  
  // Payment details
  paymentMethod: paymentMethodSchema.default('bank-transfer'),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  
  // Status and processing
  status: payrollStatusSchema.default('draft'),
  processedAt: z.date().optional(),
  paidAt: z.date().optional(),
  
  // Notes and remarks
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional(),
  
  // System fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type PayrollRecord = z.infer<typeof payrollRecordSchema>;

// Payroll Summary
export const payrollSummarySchema = z.object({
  id: z.string().uuid(),
  payrollPeriodId: z.string().uuid('Payroll period ID is required'),
  
  // Employee counts
  totalEmployees: z.number().int().min(0, 'Total employees must be non-negative'),
  processedEmployees: z.number().int().min(0, 'Processed employees must be non-negative').default(0),
  paidEmployees: z.number().int().min(0, 'Paid employees must be non-negative').default(0),
  
  // Financial summary
  totalBasicSalary: z.number().min(0, 'Total basic salary must be non-negative'),
  totalAllowances: z.number().min(0, 'Total allowances must be non-negative'),
  totalOvertime: z.number().min(0, 'Total overtime must be non-negative'),
  totalBonuses: z.number().min(0, 'Total bonuses must be non-negative'),
  totalGrossSalary: z.number().min(0, 'Total gross salary must be non-negative'),
  
  totalDeductions: z.number().min(0, 'Total deductions must be non-negative'),
  totalNetSalary: z.number().min(0, 'Total net salary must be non-negative'),
  
  // Tax and social security
  totalIncomeTax: z.number().min(0, 'Total income tax must be non-negative'),
  totalSocialSecurity: z.number().min(0, 'Total social security must be non-negative'),
  totalHealthInsurance: z.number().min(0, 'Total health insurance must be non-negative'),
  totalPension: z.number().min(0, 'Total pension must be non-negative'),
  
  // Status
  status: payrollStatusSchema.default('draft'),
  
  // System fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type PayrollSummary = z.infer<typeof payrollSummarySchema>;

// Payroll Adjustment
export const payrollAdjustmentSchema = z.object({
  id: z.string().uuid(),
  payrollRecordId: z.string().uuid('Payroll record ID is required'),
  employeeId: z.string().uuid('Employee ID is required'),
  
  // Adjustment details
  type: z.enum(['addition', 'deduction']),
  category: z.enum([
    'salary-correction',
    'bonus',
    'allowance',
    'deduction',
    'overtime',
    'leave-without-pay',
    'advance',
    'loan',
    'other'
  ]),
  amount: z.number().min(0, 'Amount must be non-negative'),
  
  // Reason and justification
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason must be 500 characters or less'),
  supportingDocument: z.string().url().optional(),
  
  // Approval
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.date().optional(),
  approvalNotes: z.string().max(500, 'Approval notes must be 500 characters or less').optional(),
  
  // System fields
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type PayrollAdjustment = z.infer<typeof payrollAdjustmentSchema>;

// Tax Configuration
export const taxConfigurationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Tax name is required'),
  description: z.string().optional(),
  
  // Tax calculation
  type: z.enum(['percentage', 'fixed']),
  rate: z.number().min(0, 'Tax rate must be non-negative'),
  
  // Income brackets (for progressive tax)
  brackets: z.array(z.object({
    minIncome: z.number().min(0),
    maxIncome: z.number().min(0).optional(),
    rate: z.number().min(0).max(100),
  })).optional(),
  
  // Applicability
  applicableTo: z.enum(['all', 'residents', 'non-residents']),
  minIncome: z.number().min(0).default(0),
  maxIncome: z.number().min(0).optional(),
  
  // Status
  isActive: z.boolean().default(true),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
  
  // System fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type TaxConfiguration = z.infer<typeof taxConfigurationSchema>;

// Input schemas for operations
export const createPayrollPeriodSchema = payrollPeriodSchema.omit({
  id: true,
  status: true,
  isLocked: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updatePayrollPeriodSchema = payrollPeriodSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedBy: true,
});

export const createPayrollAdjustmentSchema = payrollAdjustmentSchema.omit({
  id: true,
  approvedBy: true,
  approvedAt: true,
  approvalNotes: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type CreatePayrollPeriodInput = z.infer<typeof createPayrollPeriodSchema>;
export type UpdatePayrollPeriodInput = z.infer<typeof updatePayrollPeriodSchema>;
export type CreatePayrollAdjustmentInput = z.infer<typeof createPayrollAdjustmentSchema>;

// Relations and extended types
export interface PayrollRecordWithRelations extends PayrollRecord {
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
  };
  payrollPeriod?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    payDate: Date;
  };
}

export interface PayrollPeriodWithRelations extends PayrollPeriod {
  payrollRecords?: PayrollRecordWithRelations[];
  summary?: PayrollSummary;
}

export interface PayrollReport {
  period: PayrollPeriod;
  summary: PayrollSummary;
  records: PayrollRecordWithRelations[];
  adjustments: PayrollAdjustment[];
}
