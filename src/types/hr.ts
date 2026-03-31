import { z } from 'zod';

// Employee Types
export const employeeStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED', 'ON_LEAVE', 'PROBATION']);
export const employmentTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'PROBATION']);
export const documentTypeSchema = z.enum(['PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE', 'VISA', 'CONTRACT', 'CERTIFICATE', 'OTHER']);

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const bankDetailsSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  iban: z.string().optional(),
  swiftCode: z.string().optional(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Emergency contact phone is required'),
  email: z.string().email('Invalid email format').optional(),
});

export const leaveBalanceSchema = z.object({
  annual: z.number().min(0, 'Annual leave balance cannot be negative'),
  sick: z.number().min(0, 'Sick leave balance cannot be negative'),
  personal: z.number().min(0, 'Personal leave balance cannot be negative'),
  unpaid: z.number().min(0, 'Unpaid leave balance cannot be negative'),
  lastUpdated: z.date(),
});

export const employeeDocumentSchema = z.object({
  id: z.string(),
  type: documentTypeSchema,
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
  uploadedAt: z.date(),
  expiresAt: z.date().optional(),
});

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Department name is required'),
  managerId: z.string().optional(),
  description: z.string().optional(),
});

export const employeeSchema = z.object({
  id: z.string(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.date(),
  nationality: z.string().min(1, 'Nationality is required'),
  department: departmentSchema,
  position: z.string().min(1, 'Position is required'),
  hireDate: z.date(),
  employmentType: employmentTypeSchema,
  status: employeeStatusSchema,
  salary: z.number().min(0, 'Salary cannot be negative'),
  bankDetails: bankDetailsSchema,
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  leaveBalance: leaveBalanceSchema,
  documents: z.array(employeeDocumentSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  employeeId: true,
  department: true,
  leaveBalance: true,
  documents: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  departmentId: z.string().min(1, 'Department is required'),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  id: z.string(),
  status: employeeStatusSchema.optional(),
  leaveBalance: leaveBalanceSchema.optional(),
});

// Position Types
export const positionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Position title is required'),
  departmentId: z.string().min(1, 'Department is required'),
  description: z.string().optional(),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  salaryRange: z.object({
    min: z.number().min(0, 'Minimum salary cannot be negative'),
    max: z.number().min(0, 'Maximum salary cannot be negative'),
  }).refine((data) => data.min <= data.max, {
    message: 'Minimum salary must be less than or equal to maximum salary',
    path: ['min'],
  }),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPositionSchema = positionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePositionSchema = createPositionSchema.partial().extend({
  id: z.string(),
});

// Leave Types
export const leaveTypeSchema = z.enum(['ANNUAL', 'SICK', 'PERSONAL', 'UNPAID', 'MATERNITY', 'PATERNITY', 'BEREAVEMENT']);
export const leaveStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);

export const leaveRequestSchema = z.object({
  id: z.string(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  leaveType: leaveTypeSchema,
  startDate: z.date(),
  endDate: z.date(),
  days: z.number().min(0.5, 'Leave days must be at least 0.5'),
  reason: z.string().min(1, 'Leave reason is required'),
  status: leaveStatusSchema,
  requestedBy: z.string(),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional(),
  rejectionReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export const createLeaveRequestSchema = leaveRequestSchema.omit({
  id: true,
  status: true,
  requestedBy: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeaveRequestSchema = z.object({
  id: z.string(),
  status: leaveStatusSchema,
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export const leaveTypeConfigSchema = z.object({
  id: z.string(),
  type: leaveTypeSchema,
  name: z.string().min(1, 'Leave type name is required'),
  description: z.string().optional(),
  defaultDays: z.number().min(0, 'Default days cannot be negative'),
  isPaid: z.boolean(),
  requiresApproval: z.boolean(),
  maxConsecutiveDays: z.number().optional(),
  carryForward: z.boolean(),
  carryForwardLimit: z.number().optional(),
  isActive: z.boolean(),
});

// Payroll Types
export const payrollStatusSchema = z.enum(['DRAFT', 'PENDING', 'APPROVED', 'PAID', 'CANCELLED']);
export const paymentMethodSchema = z.enum(['BANK_TRANSFER', 'CASH', 'CHECK']);

export const payrollItemSchema = z.object({
  id: z.string(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  payrollId: z.string().min(1, 'Payroll ID is required'),
  baseSalary: z.number().min(0, 'Base salary cannot be negative'),
  allowances: z.object({
    housing: z.number().min(0, 'Housing allowance cannot be negative'),
    transport: z.number().min(0, 'Transport allowance cannot be negative'),
    food: z.number().min(0, 'Food allowance cannot be negative'),
    other: z.number().min(0, 'Other allowance cannot be negative'),
  }),
  deductions: z.object({
    tax: z.number().min(0, 'Tax deduction cannot be negative'),
    socialSecurity: z.number().min(0, 'Social security deduction cannot be negative'),
    healthInsurance: z.number().min(0, 'Health insurance deduction cannot be negative'),
    other: z.number().min(0, 'Other deduction cannot be negative'),
  }),
  bonuses: z.object({
    performance: z.number().min(0, 'Performance bonus cannot be negative'),
    overtime: z.number().min(0, 'Overtime bonus cannot be negative'),
    holiday: z.number().min(0, 'Holiday bonus cannot be negative'),
    other: z.number().min(0, 'Other bonus cannot be negative'),
  }),
  grossPay: z.number().min(0, 'Gross pay cannot be negative'),
  netPay: z.number().min(0, 'Net pay cannot be negative'),
  paymentMethod: paymentMethodSchema,
  paymentDate: z.date().optional(),
  notes: z.string().optional(),
});

export const payrollSchema = z.object({
  id: z.string(),
  payrollPeriod: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }).refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }),
  name: z.string().min(1, 'Payroll name is required'),
  description: z.string().optional(),
  status: payrollStatusSchema,
  totalEmployees: z.number().min(0, 'Total employees cannot be negative'),
  totalGrossPay: z.number().min(0, 'Total gross pay cannot be negative'),
  totalNetPay: z.number().min(0, 'Total net pay cannot be negative'),
  totalDeductions: z.number().min(0, 'Total deductions cannot be negative'),
  items: z.array(payrollItemSchema),
  createdBy: z.string(),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPayrollSchema = payrollSchema.omit({
  id: true,
  status: true,
  totalEmployees: true,
  totalGrossPay: true,
  totalNetPay: true,
  totalDeductions: true,
  items: true,
  createdBy: true,
  approvedBy: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePayrollSchema = z.object({
  id: z.string(),
  status: payrollStatusSchema,
  approvedBy: z.string().optional(),
});

// Type exports
export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type Department = z.infer<typeof departmentSchema>;
export type Position = z.infer<typeof positionSchema>;
export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
export type LeaveRequest = z.infer<typeof leaveRequestSchema>;
export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;
export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestSchema>;
export type LeaveTypeConfig = z.infer<typeof leaveTypeConfigSchema>;
export type Payroll = z.infer<typeof payrollSchema>;
export type PayrollItem = z.infer<typeof payrollItemSchema>;
export type CreatePayrollInput = z.infer<typeof createPayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;

export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
export type DocumentType = z.infer<typeof documentTypeSchema>;
export type LeaveType = z.infer<typeof leaveTypeSchema>;
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;
export type PayrollStatus = z.infer<typeof payrollStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
