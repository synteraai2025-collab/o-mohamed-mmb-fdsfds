export interface Leave {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: LeaveStatus;
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  approverNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveType {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  description?: string;
  descriptionAr?: string;
  maxDaysPerYear: number;
  isPaid: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  carryForwardAllowed: boolean;
  carryForwardMaxDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  carryForwardDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface LeaveCreateInput {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface LeaveUpdateInput {
  id: string;
  status?: LeaveStatus;
  approverNotes?: string;
  approvedBy?: string;
}

export interface LeaveRequest extends Leave {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: {
      name: string;
    };
  };
  leaveType: {
    name: string;
    isPaid: boolean;
  };
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface LeaveBalanceWithType extends LeaveBalance {
  leaveType: LeaveType;
}
