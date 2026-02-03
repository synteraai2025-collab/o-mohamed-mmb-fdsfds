export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  hireDate: Date;
  department: string;
  position: string;
  salary: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  managerId?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  bankDetails?: BankDetails;
  leaveBalance: LeaveBalance;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  unpaid: number;
}

export interface EmployeeCreateInput {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  hireDate: Date;
  department: string;
  position: string;
  salary: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  managerId?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  bankDetails?: BankDetails;
}

export interface EmployeeUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  salary?: number;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'intern';
  status?: 'active' | 'inactive' | 'terminated' | 'on-leave';
  managerId?: string;
  address?: Partial<Address>;
  emergencyContact?: Partial<EmergencyContact>;
  bankDetails?: Partial<BankDetails>;
}
