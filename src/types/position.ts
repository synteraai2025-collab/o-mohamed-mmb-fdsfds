import { z } from 'zod';

export const positionLevelSchema = z.enum([
  'entry_level',
  'junior',
  'mid_level',
  'senior',
  'lead',
  'manager',
  'senior_manager',
  'director',
  'senior_director',
  'vp',
  'svp',
  'c_level',
  'board'
]);

export const employmentTypeSchema = z.enum([
  'full_time',
  'part_time',
  'contract',
  'temporary',
  'internship',
  'freelance'
]);

export const positionStatusSchema = z.enum(['active', 'inactive', 'archived']);

export const positionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Position title is required').max(100),
  titleAr: z.string().min(1, 'Position title (Arabic) is required').max(100),
  code: z.string().min(1, 'Position code is required').max(20).regex(/^[A-Z0-9\-]+$/, 'Code must be uppercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  
  // Position Details
  level: positionLevelSchema.default('mid_level'),
  employmentType: employmentTypeSchema.default('full_time'),
  departmentId: z.string().uuid('Department ID is required'),
  
  // Reporting Structure
  reportsToId: z.string().uuid().optional().nullable(), // Position this reports to
  
  // Compensation Range
  minSalary: z.number().min(0, 'Minimum salary must be non-negative').optional(),
  maxSalary: z.number().min(0, 'Maximum salary must be non-negative').optional(),
  currency: z.string().default('SAR'),
  
  // Requirements
  minExperience: z.number().int().min(0).default(0), // Years
  educationLevel: z.enum(['high_school', 'diploma', 'bachelor', 'master', 'phd']).optional(),
  requiredSkills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  
  // Responsibilities
  responsibilities: z.array(z.string()).default([]),
  responsibilitiesAr: z.array(z.string()).default([]),
  
  // Position Status
  status: positionStatusSchema.default('active'),
  isManagerial: z.boolean().default(false),
  isExecutive: z.boolean().default(false),
  
  // Vacancy Information
  isVacant: z.boolean().default(true),
  vacancyCount: z.number().int().min(0).default(1),
  
  // System Fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

export const createPositionSchema = positionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updatePositionSchema = createPositionSchema.partial().extend({
  id: z.string().uuid(),
});

export type Position = z.infer<typeof positionSchema>;
export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
export type PositionLevel = z.infer<typeof positionLevelSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type PositionStatus = z.infer<typeof positionStatusSchema>;

// Position with relations
export interface PositionWithRelations extends Position {
  department?: {
    id: string;
    name: string;
    nameAr: string;
    code: string;
  };
  reportsTo?: {
    id: string;
    title: string;
    titleAr: string;
    code: string;
  };
  subordinates?: PositionWithRelations[];
  employees?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeNumber: string;
    employmentStatus: string;
  }[];
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  updatedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Position hierarchy structure
export interface PositionHierarchy {
  id: string;
  title: string;
  titleAr: string;
  code: string;
  level: PositionLevel;
  isManagerial: boolean;
  isExecutive: boolean;
  reportsToId?: string;
  subordinates: PositionHierarchy[];
  depth: number;
}

// Position search and filter types
export interface PositionSearchParams {
  query?: string;
  departmentId?: string;
  level?: PositionLevel;
  employmentType?: EmploymentType;
  status?: PositionStatus;
  isVacant?: boolean;
  isManagerial?: boolean;
  isExecutive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'titleAr' | 'code' | 'level' | 'department' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  includeInactive?: boolean;
}

export interface PositionSearchResult {
  positions: PositionWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Position statistics
export interface PositionStats {
  totalPositions: number;
  activePositions: number;
  inactivePositions: number;
  vacantPositions: number;
  filledPositions: number;
  managerialPositions: number;
  nonManagerialPositions: number;
  executivePositions: number;
  nonExecutivePositions: number;
  positionsByLevel: Record<PositionLevel, number>;
  positionsByDepartment: Record<string, number>;
  positionsByEmploymentType: Record<EmploymentType, number>;
}

// Position level hierarchy and mapping
export const POSITION_LEVEL_HIERARCHY: Record<PositionLevel, number> = {
  entry_level: 1,
  junior: 2,
  mid_level: 3,
  senior: 4,
  lead: 5,
  manager: 6,
  senior_manager: 7,
  director: 8,
  senior_director: 9,
  vp: 10,
  svp: 11,
  c_level: 12,
  board: 13,
};

export const POSITION_LEVEL_LABELS: Record<PositionLevel, { en: string; ar: string }> = {
  entry_level: { en: 'Entry Level', ar: 'مبتدئ' },
  junior: { en: 'Junior', ar: 'مبتدئ' },
  mid_level: { en: 'Mid Level', ar: 'متوسط' },
  senior: { en: 'Senior', ar: 'كبير' },
  lead: { en: 'Lead', ar: 'رائد' },
  manager: { en: 'Manager', ar: 'مدير' },
  senior_manager: { en: 'Senior Manager', ar: 'مدير أول' },
  director: { en: 'Director', ar: 'مدير عام' },
  senior_director: { en: 'Senior Director', ar: 'مدير عام أول' },
  vp: { en: 'Vice President', ar: 'نائب رئيس' },
  svp: { en: 'Senior Vice President', ar: 'نائب رئيس أول' },
  c_level: { en: 'C-Level', ar: 'مستوى الإدارة العليا' },
  board: { en: 'Board Level', ar: 'مستوى مجلس الإدارة' },
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, { en: string; ar: string }> = {
  full_time: { en: 'Full Time', ar: 'دوام كامل' },
  part_time: { en: 'Part Time', ar: 'دوام جزئي' },
  contract: { en: 'Contract', ar: 'عقد' },
  temporary: { en: 'Temporary', ar: 'مؤقت' },
  internship: { en: 'Internship', ar: 'تدريب' },
  freelance: { en: 'Freelance', ar: 'عمل حر' },
};

export const POSITION_STATUS_LABELS: Record<PositionStatus, { en: string; ar: string }> = {
  active: { en: 'Active', ar: 'نشط' },
  inactive: { en: 'Inactive', ar: 'غير نشط' },
  archived: { en: 'Archived', ar: 'مؤرشف' },
};

// Position validation helpers
export const positionCodeSchema = z.string()
  .min(1, 'Position code is required')
  .max(20, 'Position code must be 20 characters or less')
  .regex(/^[A-Z0-9\-]+$/, 'Code must be uppercase letters, numbers, and hyphens only');

export const positionTitleSchema = z.string()
  .min(1, 'Position title is required')
  .max(100, 'Position title must be 100 characters or less')
  .regex(/^[a-zA-Z0-9\s\-&()]+$/, 'Title can only contain letters, numbers, spaces, hyphens, ampersands, and parentheses');

export const positionTitleArSchema = z.string()
  .min(1, 'Position title (Arabic) is required')
  .max(100, 'Position title (Arabic) must be 100 characters or less')
  .regex(/^[\u0600-\u06FF\s\-&()]+$/, 'Title can only contain Arabic letters, spaces, hyphens, ampersands, and parentheses');

// Helper functions
export const getPositionDisplayName = (position: Position, language: 'en' | 'ar' = 'en'): string => {
  return language === 'ar' && position.titleAr ? position.titleAr : position.title;
};

export const getPositionFullName = (position: PositionWithRelations, language: 'en' | 'ar' = 'en'): string => {
  const title = getPositionDisplayName(position, language);
  return position.code ? `${position.code} - ${title}` : title;
};

export const getPositionLevelLabel = (level: PositionLevel, language: 'en' | 'ar' = 'en'): string => {
  return POSITION_LEVEL_LABELS[level][language];
};

export const getEmploymentTypeLabel = (type: EmploymentType, language: 'en' | 'ar' = 'en'): string => {
  return EMPLOYMENT_TYPE_LABELS[type][language];
};

export const getPositionStatusLabel = (status: PositionStatus, language: 'en' | 'ar' = 'en'): string => {
  return POSITION_STATUS_LABELS[status][language];
};

export const getPositionLevelNumber = (level: PositionLevel): number => {
  return POSITION_LEVEL_HIERARCHY[level] || 0;
};

export const comparePositionLevels = (level1: PositionLevel, level2: PositionLevel): number => {
  return getPositionLevelNumber(level1) - getPositionLevelNumber(level2);
};

export const isHigherPosition = (level1: PositionLevel, level2: PositionLevel): boolean => {
  return getPositionLevelNumber(level1) > getPositionLevelNumber(level2);
};

export const isSameOrHigherPosition = (level1: PositionLevel, level2: PositionLevel): boolean => {
  return getPositionLevelNumber(level1) >= getPositionLevelNumber(level2);
};

// Position hierarchy utilities
export const buildPositionHierarchy = (positions: PositionWithRelations[]): PositionHierarchy[] => {
  const positionMap = new Map<string, PositionHierarchy>();
  const rootPositions: PositionHierarchy[] = [];

  // Create hierarchy nodes for all positions
  positions.forEach(pos => {
    positionMap.set(pos.id, {
      id: pos.id,
      title: pos.title,
      titleAr: pos.titleAr,
      code: pos.code,
      level: pos.level,
      isManagerial: pos.isManagerial,
      isExecutive: pos.isExecutive,
      reportsToId: pos.reportsToId || undefined,
      subordinates: [],
      depth: 0,
    });
  });

  // Build reporting relationships
  positions.forEach(pos => {
    const node = positionMap.get(pos.id)!;
    
    if (pos.reportsToId) {
      const manager = positionMap.get(pos.reportsToId);
      if (manager) {
        manager.subordinates.push(node);
      }
    } else {
      rootPositions.push(node);
    }
  });

  // Calculate depth levels
  const calculateDepth = (nodes: PositionHierarchy[], currentDepth: number) => {
    nodes.forEach(node => {
      node.depth = currentDepth;
      if (node.subordinates.length > 0) {
        calculateDepth(node.subordinates, currentDepth + 1);
      }
    });
  };

  calculateDepth(rootPositions, 0);
  return rootPositions;
};

export const findPositionInHierarchy = (hierarchy: PositionHierarchy[], positionId: string): PositionHierarchy | null => {
  for (const pos of hierarchy) {
    if (pos.id === positionId) {
      return pos;
    }
    if (pos.subordinates.length > 0) {
      const found = findPositionInHierarchy(pos.subordinates, positionId);
      if (found) return found;
    }
  }
  return null;
};

export const getPositionReportingChain = (hierarchy: PositionHierarchy[], positionId: string): PositionHierarchy[] => {
  const chain: PositionHierarchy[] = [];
  
  const findChain = (nodes: PositionHierarchy[], targetId: string, path: PositionHierarchy[]): boolean => {
    for (const node of nodes) {
      if (node.id === targetId) {
        chain.push(...path);
        return true;
      }
      
      if (node.subordinates.length > 0) {
        const newPath = [...path, node];
        if (findChain(node.subordinates, targetId, newPath)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findChain(hierarchy, positionId, []);
  return chain;
};

export const getPositionSubordinates = (position: PositionHierarchy): PositionHierarchy[] => {
  const subordinates: PositionHierarchy[] = [];
  
  const traverse = (nodes: PositionHierarchy[]) => {
    nodes.forEach(node => {
      subordinates.push(node);
      if (node.subordinates.length > 0) {
        traverse(node.subordinates);
      }
    });
  };
  
  traverse(position.subordinates);
  return subordinates;
};

// Salary validation
export const validateSalaryRange = (minSalary?: number, maxSalary?: number): boolean => {
  if (minSalary === undefined || maxSalary === undefined) {
    return true; // Both can be undefined
  }
  return minSalary <= maxSalary;
};

export const getSalaryRangeDisplay = (minSalary?: number, maxSalary?: number, currency: string = 'SAR'): string => {
  if (minSalary === undefined && maxSalary === undefined) {
    return 'Not specified';
  }
  
  if (minSalary !== undefined && maxSalary !== undefined) {
    if (minSalary === maxSalary) {
      return `${minSalary.toLocaleString()} ${currency}`;
    }
    return `${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()} ${currency}`;
  }
  
  if (minSalary !== undefined) {
    return `From ${minSalary.toLocaleString()} ${currency}`;
  }
  
  return `Up to ${maxSalary!.toLocaleString()} ${currency}`;
};
