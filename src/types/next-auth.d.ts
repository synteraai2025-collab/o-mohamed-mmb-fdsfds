import NextAuth from "next-auth";
import { UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      employeeId?: string;
      isActive: boolean;
      employee?: {
        id: string;
        employeeId: string;
        departmentId: string;
        position: string;
      };
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    employeeId?: string;
    isActive: boolean;
    employee?: {
      id: string;
      employeeId: string;
      departmentId: string;
      position: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
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
}
