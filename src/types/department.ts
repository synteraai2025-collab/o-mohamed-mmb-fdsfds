import { z } from 'zod';

export const departmentStatusSchema = z.enum(['active', 'inactive']);
export type DepartmentStatus = z.infer<typeof departmentStatusSchema>;

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.object({
    en: z.string().min(1, 'Department name (English) is required'),
    ar: z.string().min(1, 'Department name (Arabic) is required'),
  }),
  code: z.string().min(1, 'Department code is required').max(10, 'Department code must be 10 characters or less'),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  managerId: z.string().uuid().optional(),
  parentDepartmentId: z.string().uuid().optional(),
  status: departmentStatusSchema.default('active'),
  budget: z.number().positive().optional(),
  currency: z.string().default('SAR'),
  location: z.string().optional(),
  employeeCount: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type Department = z.infer<typeof departmentSchema>;

export const createDepartmentSchema = departmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  employeeCount: true,
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = createDepartmentSchema.partial();
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
