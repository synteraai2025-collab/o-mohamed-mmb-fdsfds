import { z } from 'zod';

export const positionLevelSchema = z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive']);
export type PositionLevel = z.infer<typeof positionLevelSchema>;

export const positionStatusSchema = z.enum(['active', 'inactive']);
export type PositionStatus = z.infer<typeof positionStatusSchema>;

export const positionSchema = z.object({
  id: z.string().uuid(),
  title: z.object({
    en: z.string().min(1, 'Position title (English) is required'),
    ar: z.string().min(1, 'Position title (Arabic) is required'),
  }),
  code: z.string().min(1, 'Position code is required').max(10, 'Position code must be 10 characters or less'),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  departmentId: z.string().uuid(),
  level: positionLevelSchema.default('mid'),
  status: positionStatusSchema.default('active'),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  currency: z.string().default('SAR'),
  reportsTo: z.string().uuid().optional(),
  employeeCount: z.number().int().nonnegative().default(0),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
});

export type Position = z.infer<typeof positionSchema>;

export const createPositionSchema = positionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  employeeCount: true,
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;

export const updatePositionSchema = createPositionSchema.partial();
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
