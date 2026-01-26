/**
 * Department entity types for HR Management Platform
 */

export interface Department {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget?: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentInput {
  name: string;
  nameAr: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget?: number;
  currency: string;
  isActive?: boolean;
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  id: string;
}

export interface DepartmentHierarchy extends Department {
  children: DepartmentHierarchy[];
  employeeCount: number;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface DepartmentStats {
  departmentId: string;
  totalEmployees: number;
  activeEmployees: number;
  averageSalary: number;
  totalBudget: number;
  budgetUtilization: number;
}
