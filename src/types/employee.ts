import { z } from 'zod';

export const employmentStatusSchema = z.enum(['active', 'inactive', 'terminated', 'on_leave']);
export const contractTypeSchema = z.enum(['full_time', 'part_time', 'contract', 'internship']);
export const genderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);

export const employeeSchema = z.object({
  id: z.string().uuid(),
  employeeNumber: z.string().min(1, 'Employee number is required'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: genderSchema.optional(),
  nationality: z.string().optional(),
  
  // Employment Details
  departmentId: z.string().uuid('Department ID is required'),
  positionId: z.string().uuid('Position ID is required'),
  managerId: z.string().uuid().optional().nullable(),
  employmentStatus: employmentStatusSchema.default('active'),
  contractType: contractTypeSchema.default('full_time'),
  hireDate: z.string().datetime(),
  terminationDate: z.string().datetime().optional().nullable(),
  
  // Financial Details
  basicSalary: z.number().min(0, 'Basic salary must be non-negative'),
  housingAllowance: z.number().min(0).default(0),
  transportationAllowance: z.number().min(0).default(0),
  otherAllowances: z.number().min(0).default(0),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  iban: z.string().optional(),
  
  // System Fields
  userId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  userId: true,
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmploymentStatus = z.infer<typeof employmentStatusSchema>;
export type ContractType = z.infer<typeof contractTypeSchema>;
export type Gender = z.infer<typeof genderSchema>;

// Employee with relations
export interface EmployeeWithRelations extends Employee {
  department?: {
    id: string;
    name: string;
    nameAr?: string;
  };
  position?: {
    id: string;
    title: string;
    titleAr?: string;
  };
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  user?: {
    id: string;
    email: string;
    role: string;
    lastLoginAt?: string;
  };
}

// Employee search and filter types
export interface EmployeeSearchParams {
  query?: string;
  departmentId?: string;
  positionId?: string;
  status?: EmploymentStatus;
  page?: number;
  limit?: number;
  sortBy?: 'firstName' | 'lastName' | 'employeeNumber' | 'hireDate' | 'department';
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeSearchResult {
  employees: EmployeeWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
