import { UserRole } from './user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  employeeId?: string;
  profileImage?: string;
  language: Language;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum Language {
  EN = 'en',
  AR = 'ar'
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  employeeId?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changeLanguage: (language: Language) => Promise<void>;
}
