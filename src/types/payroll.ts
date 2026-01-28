export interface Payroll {
  id: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  basicSalary: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  bonuses: PayrollBonus[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
  status: PayrollStatus;
  processedAt?: Date;
  processedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollAllowance {
  id: string;
  payrollId: string;
  allowanceTypeId: string;
  amount: number;
  isTaxable: boolean;
  description?: string;
}

export interface PayrollDeduction {
  id: string;
  payrollId: string;
  deductionTypeId: string;
  amount: number;
  isTaxDeductible: boolean;
  description?: string;
}

export interface PayrollBonus {
  id: string;
  payrollId: string;
  bonusTypeId: string;
  amount: number;
  isTaxable: boolean;
  description?: string;
}

export interface AllowanceType {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  isTaxable: boolean;
  isActive: boolean;
  defaultAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeductionType {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  isTaxDeductible: boolean;
  isMandatory: boolean;
  isActive: boolean;
  defaultAmount?: number;
  percentageOfSalary?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BonusType {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  isTaxable: boolean;
  isActive: boolean;
  defaultAmount?: number;
  percentageOfSalary?: number;
  frequency: BonusFrequency;
  createdAt: Date;
  updatedAt: Date;
}

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum BonusFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'
}

export interface PayrollCreateInput {
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  basicSalary: number;
  allowances?: PayrollAllowanceCreateInput[];
  deductions?: PayrollDeductionCreateInput[];
  bonuses?: PayrollBonusCreateInput[];
  currency: string;
  notes?: string;
}

export interface PayrollAllowanceCreateInput {
  allowanceTypeId: string;
  amount: number;
  isTaxable?: boolean;
  description?: string;
}

export interface PayrollDeductionCreateInput {
  deductionTypeId: string;
  amount: number;
  isTaxDeductible?: boolean;
  description?: string;
}

export interface PayrollBonusCreateInput {
  bonusTypeId: string;
  amount: number;
  isTaxable?: boolean;
  description?: string;
}

export interface PayrollWithDetails extends Payroll {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    department: {
      name: string;
    };
    position: {
      title: string;
    };
  };
  allowances: (PayrollAllowance & {
    allowanceType: AllowanceType;
  })[];
  deductions: (PayrollDeduction & {
    deductionType: DeductionType;
  })[];
  bonuses: (PayrollBonus & {
    bonusType: BonusType;
  })[];
  processor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
