import { z } from 'zod';

export const payrollStatusSchema = z.enum(['draft', 'pending', 'approved', 'paid', 'locked']);
export type PayrollStatus = z.infer<typeof payrollStatusSchema>;

export const payrollFrequencySchema = z.enum(['monthly', 'bi_weekly', 'weekly']);
export type PayrollFrequency = z.infer<typeof payrollFrequencySchema>;

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

export const salaryStructureSchema = z.object({
  id: z.string().uuid(),
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
  currency: z.string().default('SAR'),
  effectiveDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SalaryStructure = z.infer<typeof salaryStructureSchema>;
