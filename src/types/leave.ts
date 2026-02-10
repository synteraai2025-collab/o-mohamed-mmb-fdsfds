import { z } from 'zod';

export const leaveTypeSchema = z.enum(['annual', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'emergency', 'unpaid']);
export type LeaveType = z.infer<typeof leaveTypeSchema>;

export const leaveStatusSchema = z.enum(['pending', 'approved', 'rejected', 'cancelled']);
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;

export const leaveRequestSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  leaveType: leaveTypeSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  daysRequested: z.number().positive('Days requested must be positive'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  status: leaveStatusSchema.default('pending'),
  requestedAt: z.string().datetime(),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
  rejectionReason: z.string().optional(),
  comments: z.string().optional(),
  isPaid: z.boolean().default(true),
  emergencyContact: z.string().optional(),
  handoverNotes: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

export const createLeaveRequestSchema = leaveRequestSchema.omit({
  id: true,
  requestedAt: true,
  approvedBy: true,
  approvedAt: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>;

export const leaveBalanceSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  year: z.number().int().positive(),
  leaveType: leaveTypeSchema,
  totalDays: z.number().positive('Total days must be positive'),
  usedDays: z.number().nonnegative('Used days cannot be negative').default(0),
  remainingDays: z.number().nonnegative('Remaining days cannot be negative'),
  carriedOverDays: z.number().nonnegative().default(0),
  expiryDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveBalance = z.infer<typeof leaveBalanceSchema>;

export const leaveApprovalSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  comments: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type LeaveApprovalInput = z.infer<typeof leaveApprovalSchema>;
