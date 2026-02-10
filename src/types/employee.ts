import { z } from 'zod';

export const employeeStatusSchema = z.enum(['active', 'inactive', 'suspended', 'terminated']);
export const employmentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'intern']);
export const genderSchema = z.enum(['male', 'female', 'other', 'prefer-not-to-say']);

export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type Gender = z.infer<typeof genderSchema>;

export const employeeSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: genderSchema.optional(),
  nationality: z.string().optional(),
  
  // Employment details
  departmentId: z.string().uuid('Department ID must be a valid UUID'),
  positionId: z.string().uuid('Position ID must be a valid UUID'),
  managerId: z.string().uuid().optional(),
  employmentType: employmentTypeSchema,
  status: employeeStatusSchema.default('active'),
  
  // Dates
  hireDate: z.date(),
  probationEndDate: z.date().optional(),
  terminationDate: z.date().optional(),
  
  // Compensation
  basicSalary: z.number().min(0, 'Basic salary must be non-negative'),
  currency: z.string().default('USD'),
  
  // Address
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  
  // Emergency contact
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Emergency contact phone is required'),
    email: z.string().email('Invalid emergency contact email').optional(),
  }).optional(),
  
  // System fields
  profilePhoto: z.string().url().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateEmployeeSchema = employeeSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedBy: true,
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

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
    email: string;
  };
}
