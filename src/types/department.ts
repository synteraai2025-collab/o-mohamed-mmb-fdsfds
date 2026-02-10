import { z } from 'zod';

export const departmentStatusSchema = z.enum(['active', 'inactive']);
export type DepartmentStatus = z.infer<typeof departmentStatusSchema>;

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Department name is required').max(100, 'Department name must be 100 characters or less'),
  nameAr: z.string().optional(), // Arabic name for bilingual support
  code: z.string().min(1, 'Department code is required').max(10, 'Department code must be 10 characters or less'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(), // Arabic description
  
  // Organizational structure
  parentId: z.string().uuid().optional(), // For hierarchical departments
  managerId: z.string().uuid().optional(), // Department head/manager
  
  // Budget and cost center
  budget: z.number().min(0, 'Budget must be non-negative').optional(),
  costCenterCode: z.string().optional(),
  
  // Status and metadata
  status: departmentStatusSchema.default('active'),
  isActive: z.boolean().default(true),
  
  // System fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type Department = z.infer<typeof departmentSchema>;

export const createDepartmentSchema = departmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateDepartmentSchema = departmentSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedBy: true,
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

export interface DepartmentWithRelations extends Department {
  parent?: {
    id: string;
    name: string;
    nameAr?: string;
  };
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  children?: Department[];
  employeeCount?: number;
}

export interface DepartmentTree extends Department {
  children: DepartmentTree[];
  level: number;
  path: string[];
}
