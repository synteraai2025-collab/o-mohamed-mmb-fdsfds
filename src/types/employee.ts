export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  hireDate: Date;
  terminationDate?: Date;
  departmentId: string;
  positionId: string;
  managerId?: string;
  salary: number;
  currency: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  address?: Address;
  emergencyContact?: EmergencyContact;
  profileImage?: string;
  nationality?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
  FREELANCE = 'FREELANCE'
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE',
  PROBATION = 'PROBATION'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  SEPARATED = 'SEPARATED'
}

export interface EmployeeCreateInput {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  hireDate: Date;
  departmentId: string;
  positionId: string;
  managerId?: string;
  salary: number;
  currency: string;
  employmentType: EmploymentType;
  address?: Address;
  emergencyContact?: EmergencyContact;
  nationality?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
}

export interface EmployeeUpdateInput extends Partial<EmployeeCreateInput> {
  terminationDate?: Date;
  status?: EmployeeStatus;
  profileImage?: string;
}
