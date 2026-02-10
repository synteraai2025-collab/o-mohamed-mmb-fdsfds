import { z } from 'zod';

export const positionLevelSchema = z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive']);
export const positionStatusSchema = z.enum(['active', 'inactive', 'on-hold']);

export type PositionLevel = z.infer<typeof positionLevelSchema>;
export type PositionStatus = z.infer<typeof positionStatusSchema>;

export const positionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Position title is required').max(100, 'Position title must be 100 characters or less'),
  titleAr: z.string().optional(), // Arabic title for bilingual support
  code: z.string().min(1, 'Position code is required').max(20, 'Position code must be 20 characters or less'),
  
  // Job details
  description: z.string().optional(),
  descriptionAr: z.string().optional(), // Arabic description
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  
  // Position hierarchy and level
  level: positionLevelSchema.default('mid'),
  departmentId: z.string().uuid('Department ID must be a valid UUID'),
  reportsToId: z.string().uuid().optional(), // Reports to another position
  
  // Compensation range
  minSalary: z.number().min(0, 'Minimum salary must be non-negative').optional(),
  maxSalary: z.number().min(0, 'Maximum salary must be non-negative').optional(),
  currency: z.string().default('USD'),
  
  // Position management
  headcount: z.number().int().min(1, 'Headcount must be at least 1').default(1),
  currentHeadcount: z.number().int().min(0, 'Current headcount must be non-negative').default(0),
  status: positionStatusSchema.default('active'),
  
  // Job classification
  jobFamily: z.string().optional(), // e.g., "Engineering", "Sales", "Marketing"
  jobFunction: z.string().optional(), // e.g., "Software Development", "Business Development"
  
  // Location and work arrangement
  location: z.string().optional(),
  workArrangement: z.enum(['on-site', 'remote', 'hybrid']).optional(),
  
  // System fields
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type Position = z.infer<typeof positionSchema>;

export const createPositionSchema = positionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  currentHeadcount: true,
});

export const updatePositionSchema = positionSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedBy: true,
});

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;

export interface PositionWithRelations extends Position {
  department?: {
    id: string;
    name: string;
    nameAr?: string;
  };
  reportsTo?: {
    id: string;
    title: string;
    titleAr?: string;
  };
  employees?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  employeeCount?: number;
}

export interface PositionHierarchy extends Position {
  children: PositionHierarchy[];
  level: number;
  path: string[];
}
