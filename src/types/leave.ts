/**
 * Leave management types for HR Management Platform
 */

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  PERSONAL = 'PERSONAL',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  BEREAVEMENT = 'BEREAVEMENT',
  JURY_DUTY = 'JURY_DUTY',
  MILITARY = 'MILITARY',
  UNPAID = 'UNPAID',
  COMPENSATORY = 'COMPENSATORY',
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum LeaveDuration {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY = 'HALF_DAY',
  HOURLY = 'HOURLY',
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  duration: LeaveDuration;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  totalDays: number;
  totalHours?: number;
  reason: string;
  comments?: string;
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComments?: string;
  attachments?: LeaveAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveAttachment {
  id: string;
  leaveRequestId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  carryForwardDays: number;
  year: number;
  lastUpdated: Date;
}

export interface LeavePolicy {
  id: string;
  leaveType: LeaveType;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  defaultDays: number;
  maxDays: number;
  minDays: number;
  carryForwardAllowed: boolean;
  carryForwardMaxDays: number;
  requiresApproval: boolean;
  requiresDocumentation: boolean;
  advanceNoticeDays: number;
  applicableTo: 'ALL' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeaveRequestInput {
  leaveType: LeaveType;
  duration: LeaveDuration;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  comments?: string;
  attachments?: File[];
}

export interface UpdateLeaveRequestInput {
  id: string;
  status?: LeaveStatus;
  comments?: string;
  reviewComments?: string;
}

export interface LeaveRequestFilters {
  employeeId?: string;
  leaveType?: LeaveType;
  status?: LeaveStatus;
  departmentId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface LeaveCalendarEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  duration: LeaveDuration;
  status: LeaveStatus;
  color: string;
}
