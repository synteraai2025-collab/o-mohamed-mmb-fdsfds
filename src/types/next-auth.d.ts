/**
 * TypeScript declarations for NextAuth session and JWT
 * Extends the default NextAuth types to include custom user properties
 */

import NextAuth from "next-auth";
import { UserRole } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      employeeId?: string | null;
      isActive: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    employeeId?: string | null;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    employeeId?: string | null;
    isActive: boolean;
  }
}
