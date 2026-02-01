export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget?: number;
  costCenter?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentCreateInput extends Omit<Department, 'id' | 'createdAt' | 'updatedAt'> {}
export interface DepartmentUpdateInput extends Partial<DepartmentCreateInput> {}

export interface DepartmentHierarchy extends Department {
  children: DepartmentHierarchy[];
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
