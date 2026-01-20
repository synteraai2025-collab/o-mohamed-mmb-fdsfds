/**
 * Payroll entity types for HR Management Platform
 */

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PayrollFrequency {
  MONTHLY = 'MONTHLY',
  BIWEEKLY = 'BIWEEKLY',
  WEEKLY = 'WEEKLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  CHECK = 'CHECK',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
}

export interface Payroll {
  id: string;
  employeeId: string;
  payrollPeriod: {
    startDate: Date;
    endDate: Date;
  };
  payDate: Date;
  status: PayrollStatus;
  frequency: PayrollFrequency;
  paymentMethod: PaymentMethod;
  
  // Earnings
  basicSalary: number;
  allowances: PayrollAllowance[];
  overtime: PayrollOvertime[];
  bonuses: PayrollBonus[];
  commissions: PayrollCommission[];
  
  // Deductions
  deductions: PayrollDeduction[];
  taxes: PayrollTax[];
  
  // Totals
  grossPay: number;
  totalDeductions: number;
  totalTaxes: number;
  netPay: number;
  
  // Additional
  currency: string;
  exchangeRate?: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  paymentReference?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollAllowance {
  id: string;
  payrollId: string;
  name: string;
  nameAr: string;
  amount: number;
  type: 'FIXED' | 'PERCENTAGE' | 'HOURLY';
  isTaxable: boolean;
  category: string;
  description?: string;
}

export interface PayrollOvertime {
  id: string;
  payrollId: string;
  date: Date;
  hours: number;
  rate: number;
  amount: number;
  type: 'REGULAR' | 'HOLIDAY' | 'WEEKEND';
  description?: string;
}

export interface PayrollBonus {
  id: string;
  payrollId: string;
  name: string;
  nameAr: string;
  amount: number;
  type: 'PERFORMANCE' | 'ANNUAL' | 'PROJECT' | 'REFERRAL' | 'OTHER';
  isTaxable: boolean;
  description?: string;
  referenceId?: string;
}

export interface PayrollCommission {
  id: string;
  payrollId: string;
  name: string;
  amount: number;
  percentage?: number;
  baseAmount?: number;
  description?: string;
  referenceId?: string;
}

export interface PayrollDeduction {
  id: string;
  payrollId: string;
  name: string;
  nameAr: string;
  amount: number;
  type: 'FIXED' | 'PERCENTAGE';
  category: 'SOCIAL_SECURITY' | 'HEALTH_INSURANCE' | 'RETIREMENT' | 'LOAN' | 'ADVANCE' | 'OTHER';
  isMandatory: boolean;
  description?: string;
  referenceId?: string;
}

export interface PayrollTax {
  id: string;
  payrollId: string;
  name: string;
  amount: number;
  rate: number;
  taxableAmount: number;
  category: 'INCOME_TAX' | 'SOCIAL_SECURITY' | 'MEDICARE' | 'STATE_TAX' | 'LOCAL_TAX';
  description?: string;
}

export interface PayrollRun {
  id: string;
  name: string;
  description?: string;
  frequency: PayrollFrequency;
  payrollPeriod: {
    startDate: Date;
    endDate: Date;
  };
  payDate: Date;
  status: PayrollStatus;
  employeeIds: string[];
  departmentIds?: string[];
  currency: string;
  exchangeRate?: number;
  processedBy: string;
  processedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalTaxes: number;
  totalNetPay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePayrollRunInput {
  name: string;
  description?: string;
  frequency: PayrollFrequency;
  payrollPeriod: {
    startDate: Date;
    endDate: Date;
  };
  payDate: Date;
  employeeIds: string[];
  departmentIds?: string[];
  currency: string;
  exchangeRate?: number;
}

export interface PayrollReport {
  id: string;
  payrollRunId: string;
  type: 'SUMMARY' | 'DETAILED' | 'DEPARTMENT' | 'INDIVIDUAL';
  generatedBy: string;
  generatedAt: Date;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  parameters: Record<string, any>;
}

export interface PayrollFilters {
  employeeId?: string;
  departmentId?: string;
  status?: PayrollStatus;
  frequency?: PayrollFrequency;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalTaxes: number;
  totalNetPay: number;
  averageSalary: number;
  currency: string;
  period: {
    start: Date;
    end: Date;
  };
}
