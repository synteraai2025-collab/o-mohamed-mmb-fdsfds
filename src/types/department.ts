export interface Department {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  managerId?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentCreateInput {
  name: string;
  nameAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  managerId?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface DepartmentUpdateInput extends Partial<DepartmentCreateInput> {
  id: string;
}

export interface DepartmentHierarchy extends Department {
  children: DepartmentHierarchy[];
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
