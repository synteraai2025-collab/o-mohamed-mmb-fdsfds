import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Department name is required').max(100),
  nameAr: z.string().min(1, 'Department name (Arabic) is required').max(100),
  code: z.string().min(1, 'Department code is required').max(10).regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  
  // Organizational Structure
  parentId: z.string().uuid().optional().nullable(),
  managerId: z.string().uuid().optional().nullable(),
  
  // Hierarchy Information
  level: z.number().int().min(0).default(0),
  path: z.string().default(''),
  
  // Status and Settings
  isActive: z.boolean().default(true),
  isCostCenter: z.boolean().default(false),
  costCenterCode: z.string().optional(),
  
  // System Fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

export const createDepartmentSchema = departmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateDepartmentSchema = createDepartmentSchema.partial().extend({
  id: z.string().uuid(),
});

export type Department = z.infer<typeof departmentSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;

// Department with relations
export interface DepartmentWithRelations extends Department {
  parent?: {
    id: string;
    name: string;
    nameAr: string;
    code: string;
  };
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  children?: DepartmentWithRelations[];
  employeeCount?: number;
  activeEmployeeCount?: number;
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

// Department tree structure
export interface DepartmentTreeNode extends DepartmentWithRelations {
  children: DepartmentTreeNode[];
  depth: number;
  isLeaf: boolean;
}

// Department search and filter types
export interface DepartmentSearchParams {
  query?: string;
  parentId?: string;
  isActive?: boolean;
  isCostCenter?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'nameAr' | 'code' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  includeInactive?: boolean;
}

export interface DepartmentSearchResult {
  departments: DepartmentWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Department statistics
export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  departmentsWithManagers: number;
  departmentsWithoutManagers: number;
  totalEmployees: number;
  averageEmployeesPerDepartment: number;
}

// Department hierarchy helpers
export interface DepartmentHierarchy {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  level: number;
  path: string;
  parentId?: string;
  children: DepartmentHierarchy[];
}

// Department validation helpers
export const departmentCodeSchema = z.string()
  .min(1, 'Department code is required')
  .max(10, 'Department code must be 10 characters or less')
  .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only');

export const departmentNameSchema = z.string()
  .min(1, 'Department name is required')
  .max(100, 'Department name must be 100 characters or less')
  .regex(/^[a-zA-Z0-9\s\-&()]+$/, 'Name can only contain letters, numbers, spaces, hyphens, ampersands, and parentheses');

export const departmentNameArSchema = z.string()
  .min(1, 'Department name (Arabic) is required')
  .max(100, 'Department name (Arabic) must be 100 characters or less')
  .regex(/^[\u0600-\u06FF\s\-&()]+$/, 'Name can only contain Arabic letters, spaces, hyphens, ampersands, and parentheses');

// Helper functions
export const getDepartmentDisplayName = (department: Department, language: 'en' | 'ar' = 'en'): string => {
  return language === 'ar' && department.nameAr ? department.nameAr : department.name;
};

export const getDepartmentFullName = (department: DepartmentWithRelations, language: 'en' | 'ar' = 'en'): string => {
  const name = getDepartmentDisplayName(department, language);
  return department.code ? `${department.code} - ${name}` : name;
};

export const buildDepartmentPath = (department: Department): string => {
  return department.path || department.id;
};

export const isDepartmentLeaf = (department: DepartmentWithRelations): boolean => {
  return !department.children || department.children.length === 0;
};

export const getDepartmentLevel = (department: Department): number => {
  return department.level || 0;
};

// Department tree utilities
export const buildDepartmentTree = (departments: DepartmentWithRelations[]): DepartmentTreeNode[] => {
  const departmentMap = new Map<string, DepartmentTreeNode>();
  const rootDepartments: DepartmentTreeNode[] = [];

  // Create nodes for all departments
  departments.forEach(dept => {
    departmentMap.set(dept.id, {
      ...dept,
      children: [],
      depth: 0,
      isLeaf: true,
    });
  });

  // Build parent-child relationships
  departments.forEach(dept => {
    const node = departmentMap.get(dept.id)!;
    
    if (dept.parentId) {
      const parent = departmentMap.get(dept.parentId);
      if (parent) {
        parent.children.push(node);
        parent.isLeaf = false;
        node.depth = parent.depth + 1;
      }
    } else {
      rootDepartments.push(node);
    }
  });

  return rootDepartments;
};

export const flattenDepartmentTree = (tree: DepartmentTreeNode[]): DepartmentWithRelations[] => {
  const result: DepartmentWithRelations[] = [];
  
  const traverse = (nodes: DepartmentTreeNode[]) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  
  traverse(tree);
  return result;
};

export const findDepartmentInTree = (tree: DepartmentTreeNode[], departmentId: string): DepartmentTreeNode | null => {
  for (const node of tree) {
    if (node.id === departmentId) {
      return node;
    }
    if (node.children.length > 0) {
      const found = findDepartmentInTree(node.children, departmentId);
      if (found) return found;
    }
  }
  return null;
};

export const getDepartmentAncestors = (tree: DepartmentTreeNode[], departmentId: string): DepartmentTreeNode[] => {
  const ancestors: DepartmentTreeNode[] = [];
  
  const findAncestors = (nodes: DepartmentTreeNode[], targetId: string, path: DepartmentTreeNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === targetId) {
        ancestors.push(...path);
        return true;
      }
      
      if (node.children.length > 0) {
        const newPath = [...path, node];
        if (findAncestors(node.children, targetId, newPath)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findAncestors(tree, departmentId, []);
  return ancestors;
};

export const getDepartmentDescendants = (department: DepartmentTreeNode): DepartmentTreeNode[] => {
  const descendants: DepartmentTreeNode[] = [];
  
  const traverse = (nodes: DepartmentTreeNode[]) => {
    nodes.forEach(node => {
      descendants.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  
  traverse(department.children);
  return descendants;
};
