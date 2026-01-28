export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HR_ADMIN = 'HR_ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  DEPARTMENT_MANAGER = 'DEPARTMENT_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  PAYROLL_ADMIN = 'PAYROLL_ADMIN'
}

export interface UserPermissions {
  canViewEmployees: boolean;
  canCreateEmployees: boolean;
  canUpdateEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewDepartments: boolean;
  canManageDepartments: boolean;
  canViewPositions: boolean;
  canManagePositions: boolean;
  canViewLeaveRequests: boolean;
  canApproveLeaveRequests: boolean;
  canCreateLeaveRequests: boolean;
  canViewPayroll: boolean;
  canProcessPayroll: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canViewBonuses: boolean;
  canManageBonuses: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.SUPER_ADMIN]: {
    canViewEmployees: true,
    canCreateEmployees: true,
    canUpdateEmployees: true,
    canDeleteEmployees: true,
    canViewDepartments: true,
    canManageDepartments: true,
    canViewPositions: true,
    canManagePositions: true,
    canViewLeaveRequests: true,
    canApproveLeaveRequests: true,
    canCreateLeaveRequests: true,
    canViewPayroll: true,
    canProcessPayroll: true,
    canViewReports: true,
    canManageUsers: true,
    canViewBonuses: true,
    canManageBonuses: true,
  },
  [UserRole.HR_ADMIN]: {
    canViewEmployees: true,
    canCreateEmployees: true,
    canUpdateEmployees: true,
    canDeleteEmployees: false,
    canViewDepartments: true,
    canManageDepartments: true,
    canViewPositions: true,
    canManagePositions: true,
    canViewLeaveRequests: true,
    canApproveLeaveRequests: true,
    canCreateLeaveRequests: true,
    canViewPayroll: true,
    canProcessPayroll: false,
    canViewReports: true,
    canManageUsers: false,
    canViewBonuses: true,
    canManageBonuses: false,
  },
  [UserRole.HR_MANAGER]: {
    canViewEmployees: true,
    canCreateEmployees: true,
    canUpdateEmployees: true,
    canDeleteEmployees: false,
    canViewDepartments: true,
    canManageDepartments: true,
    canViewPositions: true,
    canManagePositions: true,
    canViewLeaveRequests: true,
    canApproveLeaveRequests: true,
    canCreateLeaveRequests: true,
    canViewPayroll: true,
    canProcessPayroll: true,
    canViewReports: true,
    canManageUsers: false,
    canViewBonuses: true,
    canManageBonuses: true,
  },
  [UserRole.DEPARTMENT_MANAGER]: {
    canViewEmployees: true,
    canCreateEmployees: false,
    canUpdateEmployees: true,
    canDeleteEmployees: false,
    canViewDepartments: true,
    canManageDepartments: false,
    canViewPositions: true,
    canManagePositions: false,
    canViewLeaveRequests: true,
    canApproveLeaveRequests: true,
    canCreateLeaveRequests: true,
    canViewPayroll: false,
    canProcessPayroll: false,
    canViewReports: false,
    canManageUsers: false,
    canViewBonuses: false,
    canManageBonuses: false,
  },
  [UserRole.EMPLOYEE]: {
    canViewEmployees: false,
    canCreateEmployees: false,
    canUpdateEmployees: false,
    canDeleteEmployees: false,
    canViewDepartments: false,
    canManageDepartments: false,
    canViewPositions: false,
    canManagePositions: false,
    canViewLeaveRequests: true,
    canApproveLeaveRequests: false,
    canCreateLeaveRequests: true,
    canViewPayroll: true,
    canProcessPayroll: false,
    canViewReports: false,
    canManageUsers: false,
    canViewBonuses: false,
    canManageBonuses: false,
  },
  [UserRole.PAYROLL_ADMIN]: {
    canViewEmployees: true,
    canCreateEmployees: false,
    canUpdateEmployees: false,
    canDeleteEmployees: false,
    canViewDepartments: true,
    canManageDepartments: false,
    canViewPositions: true,
    canManagePositions: false,
    canViewLeaveRequests: false,
    canApproveLeaveRequests: false,
    canCreateLeaveRequests: false,
    canViewPayroll: true,
    canProcessPayroll: true,
    canViewReports: true,
    canManageUsers: false,
    canViewBonuses: true,
    canManageBonuses: true,
  },
};
