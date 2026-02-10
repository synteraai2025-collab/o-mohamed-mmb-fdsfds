export interface Leave {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  isPaid: boolean;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description?: string;
  maxDaysPerYear: number;
  isPaid: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  carryForwardAllowed: boolean;
  carryForwardLimit?: number;
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

export interface LeaveCreateInput extends Omit<Leave, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'days'> {}
export interface LeaveUpdateInput extends Partial<Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface LeaveRequest {
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  isPaid: boolean;
  comments?: string;
}

export interface LeaveApproval {
  leaveId: string;
  approved: boolean;
  reason?: string;
  comments?: string;
}
