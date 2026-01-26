/**
 * Employee entity types for HR Management Platform
 */

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  departmentId: string;
  positionId: string;
  managerId?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: Date;
  terminationDate?: Date;
  salary: number;
  currency: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    iban?: string;
    swiftCode?: string;
  };
  profileImage?: string;
  documents: EmployeeDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  expiresAt?: Date;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  departmentId: string;
  positionId: string;
  managerId?: string;
  employmentType: EmploymentType;
  hireDate: Date;
  salary: number;
  currency: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    iban?: string;
    swiftCode?: string;
  };
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  status?: EmployeeStatus;
  terminationDate?: Date;
  profileImage?: string;
}

export interface EmployeeFilters {
  departmentId?: string;
  positionId?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
