export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  hireDate: Date;
  departmentId: string;
  position: string;
  salary: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  managerId?: string;
  profilePhoto?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  bankDetails?: BankDetails;
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

export interface EmployeeCreateInput extends Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> {}
export interface EmployeeUpdateInput extends Partial<EmployeeCreateInput> {}
