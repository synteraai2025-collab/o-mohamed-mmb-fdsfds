import { z } from 'zod';

export const leaveTypeSchema = z.enum([
  'annual',
  'sick',
  'personal',
  'maternity',
  'paternity',
  'bereavement',
  'jury-duty',
  'military',
  'unpaid',
  'compensatory',
  'emergency',
  'hajj',
  'ramadan'
]);

export const leaveStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'withdrawn'
]);

export type LeaveType = z.infer<typeof leaveTypeSchema>;
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;

export const leaveRequestSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid('Employee ID must be a valid UUID'),
  leaveType: leaveTypeSchema,
  
  // Leave dates
  startDate: z.date(),
  endDate: z.date(),
  daysRequested: z.number().int().min(1, 'Days requested must be at least 1'),
  
  // Leave details
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason must be 500 characters or less'),
  reasonAr: z.string().optional(), // Arabic reason for bilingual support
  
  // Contact during leave
  contactDuringLeave: z.object({
    phone: z.string().optional(),
    email: z.string().email('Invalid contact email').optional(),
    address: z.string().optional(),
  }).optional(),
  
  // Handover details
  handoverToId: z.string().uuid().optional(), // Employee ID for handover
  handoverNotes: z.string().max(1000, 'Handover notes must be 1000 characters or less').optional(),
  
  // Approval workflow
  status: leaveStatusSchema.default('pending'),
  approverId: z.string().uuid().optional(),
  approvalDate: z.date().optional(),
  rejectionReason: z.string().max(500, 'Rejection reason must be 500 characters or less').optional(),
  
  // Leave balance check
  leaveBalanceBefore: z.number().int().min(0, 'Leave balance must be non-negative').optional(),
  leaveBalanceAfter: z.number().int().min(0, 'Leave balance must be non-negative').optional(),
  
  // Documentation
  supportingDocuments: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    uploadedAt: z.date().default(() => new Date()),
  })).optional(),
  
  // Medical certificate (for sick leave)
  medicalCertificate: z.object({
    hasCertificate: z.boolean().default(false),
    certificateUrl: z.string().url().optional(),
    doctorName: z.string().optional(),
    clinicName: z.string().optional(),
    diagnosis: z.string().optional(),
    recommendedDays: z.number().int().min(1).optional(),
  }).optional(),
  
  // System fields
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

export const createLeaveRequestSchema = leaveRequestSchema.omit({
  id: true,
  status: true,
  approverId: true,
  approvalDate: true,
  rejectionReason: true,
  leaveBalanceBefore: true,
  leaveBalanceAfter: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateLeaveRequestSchema = leaveRequestSchema.partial().omit({
  id: true,
  employeeId: true,
  createdAt: true,
  updatedBy: true,
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;
export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestSchema>;

// Leave balance tracking
export const leaveBalanceSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid('Employee ID must be a valid UUID'),
  leaveType: leaveTypeSchema,
  
  // Balance details
  annualEntitlement: z.number().int().min(0, 'Annual entitlement must be non-negative').default(0),
  carriedForward: z.number().int().min(0, 'Carried forward must be non-negative').default(0),
  totalEntitlement: z.number().int().min(0, 'Total entitlement must be non-negative').default(0),
  
  // Usage tracking
  taken: z.number().int().min(0, 'Taken days must be non-negative').default(0),
  approved: z.number().int().min(0, 'Approved days must be non-negative').default(0),
  pending: z.number().int().min(0, 'Pending days must be non-negative').default(0),
  
  // Current balance
  remaining: z.number().int().min(0, 'Remaining days must be non-negative').default(0),
  
  // Year and period
  year: z.number().int().min(2000).max(2100),
  
  // Adjustments
  adjustments: z.array(z.object({
    id: z.string().uuid(),
    type: z.enum(['addition', 'deduction']),
    days: z.number().int(),
    reason: z.string(),
    effectiveDate: z.date(),
    createdBy: z.string().uuid(),
    createdAt: z.date().default(() => new Date()),
  })).optional(),
  
  // System fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type LeaveBalance = z.infer<typeof leaveBalanceSchema>;

// Leave policy configuration
export const leavePolicySchema = z.object({
  id: z.string().uuid(),
  leaveType: leaveTypeSchema,
  
  // Entitlement rules
  defaultEntitlement: z.number().int().min(0, 'Default entitlement must be non-negative'),
  maxCarryForward: z.number().int().min(0, 'Max carry forward must be non-negative').default(0),
  carryForwardExpiryMonths: z.number().int().min(0).max(12).optional(),
  
  // Eligibility
  minServiceMonths: z.number().int().min(0).default(0),
  maxServiceMonths: z.number().int().min(0).optional(),
  
  // Usage rules
  minNoticeDays: z.number().int().min(0).default(1),
  maxConsecutiveDays: z.number().int().min(1).optional(),
  requiresApproval: z.boolean().default(true),
  requiresDocumentation: z.boolean().default(false),
  
  // Gender restrictions (for maternity/paternity)
  applicableGenders: z.array(z.enum(['male', 'female', 'all'])).default(['all']),
  
  // Probation rules
  availableDuringProbation: z.boolean().default(false),
  
  // System fields
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
});

export type LeavePolicy = z.infer<typeof leavePolicySchema>;

export interface LeaveRequestWithRelations extends LeaveRequest {
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
  };
  approver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  handoverTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LeaveTypeStats {
  leaveType: LeaveType;
  totalDays: number;
  approvedDays: number;
  pendingDays: number;
  remainingDays: number;
}
