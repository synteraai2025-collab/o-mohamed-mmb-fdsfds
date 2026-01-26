/**
 * NextAuth middleware for HR Management Platform
 * Protects routes based on authentication and role-based access control
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Check if user is active
    if (token && !token.isActive) {
      return NextResponse.redirect(new URL("/login?error=inactive", req.url));
    }
    
    // Role-based route protection
    const userRole = token?.role as string;
    
    // Super admin can access everything
    if (userRole === "SUPER_ADMIN") {
      return NextResponse.next();
    }
    
    // HR Manager routes
    if (path.startsWith("/admin") && userRole !== "HR_MANAGER" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // Payroll routes - only HR roles
    if (path.startsWith("/payroll") && 
        !["HR_MANAGER", "HR_ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // Employee self-service routes
    if (path.startsWith("/employees") && path.includes("/edit")) {
      // Only allow employees to edit their own profile
      const employeeId = path.split("/")[2];
      if (userRole === "EMPLOYEE" && token?.employeeId !== employeeId) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if user has a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|login).*)",
  ],
};
