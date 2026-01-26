/**
 * Position entity types for HR Management Platform
 */

export enum PositionLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  EXECUTIVE = 'EXECUTIVE',
}

export enum PositionType {
  PERMANENT = 'PERMANENT',
  TEMPORARY = 'TEMPORARY',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

export interface Position {
  id: string;
  title: string;
  titleAr: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  departmentId: string;
  level: PositionLevel;
  type: PositionType;
  minSalary: number;
  maxSalary: number;
  currency: string;
  requiredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  reportsTo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePositionInput {
  title: string;
  titleAr: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  departmentId: string;
  level: PositionLevel;
  type: PositionType;
  minSalary: number;
  maxSalary: number;
  currency: string;
  requiredSkills?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  reportsTo?: string;
  isActive?: boolean;
}

export interface UpdatePositionInput extends Partial<CreatePositionInput> {
  id: string;
}

export interface PositionHierarchy extends Position {
  directReports: Position[];
  employeeCount: number;
  department: {
    id: string;
    name: string;
    nameAr: string;
  };
}

export interface PositionStats {
  positionId: string;
  totalEmployees: number;
  averageSalary: number;
  salaryRangeUtilization: number;
  turnoverRate: number;
  averageTenure: number;
}
