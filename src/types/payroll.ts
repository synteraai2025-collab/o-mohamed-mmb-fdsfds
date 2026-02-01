export interface Payroll {
  id: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  overtimeHours: number;
  overtimeRate: number;
  overtimeAmount: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  paidBy?: string;
  paidAt?: Date;
  bankReference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Allowance {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  amount: number;
  percentage?: number;
  isTaxable: boolean;
  description?: string;
}

export interface Deduction {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  amount: number;
  percentage?: number;
  isMandatory: boolean;
  description?: string;
}

export interface PayrollRun {
  id: string;
  name: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  processedBy: string;
  processedAt?: Date;
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollItem {
  id: string;
  payrollRunId: string;
  employeeId: string;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  overtimeHours: number;
  overtimeRate: number;
  overtimeAmount: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'pending' | 'approved' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollCreateInput extends Omit<Payroll, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}
export interface PayrollUpdateInput extends Partial<PayrollCreateInput> {}

export interface PayrollRunCreateInput extends Omit<PayrollRun, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'processedAt'> {}

export interface TaxSlab {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  rate: number;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}
