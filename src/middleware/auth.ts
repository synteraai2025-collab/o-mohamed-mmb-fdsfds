import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@/types';

interface AuthToken {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  employeeId?: string;
  employee?: {
    id: string;
    employeeId: string;
    departmentId: string;
    position: string;
  };
}

const roleHierarchy: Record<UserRole, number> = {
  'Owner': 5,
  'HR Admin': 4,
  'Payroll Admin': 3,
  'Manager': 2,
  'Employee': 1,
};

const protectedRoutes = [
  '/dashboard',
  '/employees',
  '/departments',
  '/leaves',
  '/payroll',
  '/reports',
  '/profile',
  '/settings',
];

const rolePermissions = {
  'Owner': {
    allowedRoutes: ['/dashboard', '/employees', '/departments', '/leaves', '/payroll', '/reports', '/profile', '/settings', '/admin'],
    canAccess: (resource: string, action: string) => true,
  },
  'HR Admin': {
    allowedRoutes: ['/dashboard', '/employees', '/departments', '/leaves', '/reports', '/profile', '/settings'],
    canAccess: (resource: string, action: string) => {
      const hrResources = ['employee', 'department', 'leave', 'report'];
      return hrResources.includes(resource) || resource === 'profile';
    },
  },
  'Payroll Admin': {
    allowedRoutes: ['/dashboard', '/employees', '/payroll', '/reports', '/profile', '/settings'],
    canAccess: (resource: string, action: string) => {
      const payrollResources = ['employee', 'payroll', 'report'];
      return payrollResources.includes(resource) || resource === 'profile';
    },
  },
  'Manager': {
    allowedRoutes: ['/dashboard', '/employees', '/leaves', '/profile', '/settings'],
    canAccess: (resource: string, action: string) => {
      const managerResources = ['employee', 'leave', 'report'];
      return managerResources.includes(resource) || resource === 'profile';
    },
  },
  'Employee': {
    allowedRoutes: ['/dashboard', '/leaves', '/profile', '/settings'],
    canAccess: (resource: string, action: string) => {
      return resource === 'leave' || resource === 'profile';
    },
  },
};

function hasPermission(role: UserRole, route: string): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  
  return permissions.allowedRoutes.some(allowedRoute => 
    route.startsWith(allowedRoute)
  );
}

function canAccessResource(role: UserRole, resource: string, action: string): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  
  return permissions.canAccess(resource, action);
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/') || pathname === '/login' || pathname === '/register';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (isAuthRoute(pathname)) {
    return NextResponse.next();
  }
  
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as AuthToken | null;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (!token.role || !hasPermission(token.role, pathname)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  const headers = new Headers(request.headers);
  headers.set('x-user-id', token.id);
  headers.set('x-user-role', token.role);
  headers.set('x-user-email', token.email);
  
  if (token.employeeId) {
    headers.set('x-employee-id', token.employeeId);
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

export function requireRole(requiredRole: UserRole) {
  return (request: NextRequest) => {
    const token = request.headers.get('x-user-role') as UserRole;
    
    if (!token) {
      return false;
    }
    
    const userLevel = roleHierarchy[token];
    const requiredLevel = roleHierarchy[requiredRole];
    
    return userLevel >= requiredLevel;
  };
}

export function requirePermission(resource: string, action: string) {
  return (request: NextRequest) => {
    const role = request.headers.get('x-user-role') as UserRole;
    
    if (!role) {
      return false;
    }
    
    return canAccessResource(role, resource, action);
  };
}
