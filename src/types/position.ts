export interface Position {
  id: string;
  title: string;
  titleAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  departmentId: string;
  level: PositionLevel;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  isActive: boolean;
  reportsToId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PositionLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  EXECUTIVE = 'EXECUTIVE'
}

export interface PositionCreateInput {
  title: string;
  titleAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  departmentId: string;
  level: PositionLevel;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  isActive?: boolean;
  reportsToId?: string;
}

export interface PositionUpdateInput extends Partial<PositionCreateInput> {
  id: string;
}

export interface PositionWithDepartment extends Position {
  department: {
    id: string;
    name: string;
    nameAr?: string;
  };
  reportsTo?: {
    id: string;
    title: string;
    titleAr?: string;
  };
}
