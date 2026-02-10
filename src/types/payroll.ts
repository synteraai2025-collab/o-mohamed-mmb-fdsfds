export interface Payroll {
  id: string;
  employeeId: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  bonuses: Bonus[];
  overtime: Overtime[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Allowance {
  id: string;
  name: string;
  type: 'housing' | 'transport' | 'meal' | 'medical' | 'other';
  amount: number;
  isTaxable: boolean;
  description?: string;
}

export interface Deduction {
  id: string;
  name: string;
  type: 'tax' | 'social_security' | 'health_insurance' | 'loan' | 'advance' | 'other';
  amount: number;
  isMandatory: boolean;
  description?: string;
}

export interface Bonus {
  id: string;
  name: string;
  type: 'performance' | 'holiday' | 'annual' | 'retention' | 'other';
  amount: number;
  isTaxable: boolean;
  description?: string;
}

export interface Overtime {
  id: string;
  date: Date;
  hours: number;
  rate: number;
  amount: number;
  description?: string;
}

export interface SalaryStructure {
  id: string;
  employeeId: string;
  basicSalary: number;
  allowances: Allowance[];
  effectiveDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollRun {
  id: string;
  name: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  employees: string[];
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  processedBy: string;
  processedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollCreateInput {
  employeeId: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  basicSalary: number;
  allowances?: Allowance[];
  deductions?: Deduction[];
  bonuses?: Bonus[];
  overtime?: Overtime[];
  notes?: string;
}

export interface PayrollUpdateInput {
  allowances?: Allowance[];
  deductions?: Deduction[];
  bonuses?: Bonus[];
  overtime?: Overtime[];
  status?: 'draft' | 'pending' | 'approved' | 'paid' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  paymentMethod?: 'bank_transfer' | 'cash' | 'check';
  notes?: string;
}

export interface SalaryStructureCreateInput {
  employeeId: string;
  basicSalary: number;
  allowances?: Allowance[];
  effectiveDate: Date;
  endDate?: Date;
}

export interface PayrollReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalEmployees: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    totalAllowances: number;
    totalBonuses: number;
    totalOvertime: number;
  };
  breakdown: {
    byDepartment: DepartmentPayrollSummary[];
    byEmploymentType: EmploymentTypePayrollSummary[];
  };
}

export interface DepartmentPayrollSummary {
  department: string;
  employeeCount: number;
  totalGrossPay: number;
  totalNetPay: number;
  averageSalary: number;
}

export interface EmploymentTypePayrollSummary {
  employmentType: string;
  employeeCount: number;
  totalGrossPay: number;
  totalNetPay: number;
  averageSalary: number;
}
