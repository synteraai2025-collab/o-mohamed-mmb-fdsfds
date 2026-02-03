'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Mail, 
  Phone, 
  MoreVertical, 
  User, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User, UserRole, UserStatus } from '@/types/auth';

interface UserCardProps {
  user: User | null;
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (user: User) => void;
  onSuspend?: (userId: string) => void;
  onActivate?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  showActions?: boolean;
  className?: string;
}

const roleColors: Record<UserRole, string> = {
  'super-admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'admin': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'hr-manager': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'hr-staff': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'department-manager': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'employee': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const statusColors: Record<UserStatus, string> = {
  'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'suspended': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'pending': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const statusIcons: Record<UserStatus, React.ReactNode> = {
  'active': <CheckCircle className="h-3 w-3" />,
  'inactive': <XCircle className="h-3 w-3" />,
  'suspended': <AlertCircle className="h-3 w-3" />,
  'pending': <Clock className="h-3 w-3" />,
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  'super-admin': <Shield className="h-3 w-3" />,
  'admin': <Shield className="h-3 w-3" />,
  'hr-manager': <User className="h-3 w-3" />,
  'hr-staff': <User className="h-3 w-3" />,
  'department-manager': <User className="h-3 w-3" />,
  'employee': <User className="h-3 w-3" />,
};

export function UserCard({
  user,
  isLoading = false,
  error = null,
  onEdit,
  onSuspend,
  onActivate,
  onDelete,
  showActions = true,
  className,
}: UserCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No user data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleSuspend = () => {
    if (onSuspend && user.status === 'active') {
      onSuspend(user.id);
    }
  };

  const handleActivate = () => {
    if (onActivate && user.status === 'suspended') {
      onActivate(user.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  const canSuspend = user.status === 'active' && onSuspend;
  const canActivate = user.status === 'suspended' && onActivate;

  return (
    <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || undefined} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="text-sm">
                {user.email}
              </CardDescription>
            </div>
          </div>
          
          {showActions && (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>
                  <User className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                {canSuspend && (
                  <DropdownMenuItem onClick={handleSuspend} className="text-yellow-600">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Suspend User
                  </DropdownMenuItem>
                )}
                {canActivate && (
                  <DropdownMenuItem onClick={handleActivate} className="text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {user.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-3 w-3" />
              {user.phone}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-3 w-3" />
            {user.email}
          </div>
        </div>

        {/* Role and Status */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="secondary" 
            className={cn("flex items-center gap-1 text-xs", roleColors[user.role])}
          >
            {roleIcons[user.role]}
            {user.role.replace('-', ' ').toUpperCase()}
          </Badge>
          
          <Badge 
            variant="secondary" 
            className={cn("flex items-center gap-1 text-xs", statusColors[user.status])}
          >
            {statusIcons[user.status]}
            {user.status.toUpperCase()}
          </Badge>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Language: {user.language.toUpperCase()}</div>
          {user.lastLoginAt && (
            <div>
              Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
            </div>
          )}
          {user.employeeId && (
            <div>Employee ID: {user.employeeId}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCard;
