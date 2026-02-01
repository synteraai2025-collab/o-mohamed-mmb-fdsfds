import { z } from 'zod';

export const employeeStatusSchema = z.enum(['active', 'inactive', 'terminated', 'on_leave']);
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;

export const employmentTypeSchema = z.enum(['full_time', 'part_time', 'contract', 'internship']);
export type EmploymentType = z.infer<typeof employmentTypeSchema>;

export const employeeSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  userId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  hireDate: z.string().datetime(),
  terminationDate: z.string().datetime().optional(),
  departmentId: z.string().uuid(),
  positionId: z.string().uuid(),
  managerId: z.string().uuid().optional(),
  employmentType: employmentTypeSchema,
  status: employeeStatusSchema.default('active'),
  salary: z.number().positive('Salary must be positive'),
  currency: z.string().default('SAR'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default('SA'),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  bankDetails: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
  }).optional(),
  profilePhoto: z.string().url().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
