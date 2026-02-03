'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types/user';

interface UserCardProps {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  error?: string;
}

export function UserCard({ user, onEdit, onDelete, loading = false, error }: UserCardProps) {
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading user</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'hr_manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'hr_staff':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'manager':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'employee':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'hr_manager':
        return 'HR Manager';
      case 'hr_staff':
        return 'HR Staff';
      case 'manager':
        return 'Manager';
      case 'employee':
        return 'Employee';
      default:
        return role;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {user.avatar && !imageError ? (
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                width={64}
                height={64}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Status</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              user.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          {user.employeeId && (
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Employee ID</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.employeeId}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>Language</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {user.language === 'en' ? 'English' : 'العربية'}
            </span>
          </div>
          {user.lastLoginAt && (
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Last Login</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(user.lastLoginAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
