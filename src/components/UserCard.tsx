'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types';

interface UserCardProps {
  userId?: string;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

interface UserData extends UserType {
  employee?: {
    employeeId: string;
    department: {
      name: string;
      nameAr?: string;
    };
    position: {
      title: string;
      titleAr?: string;
    };
    phone?: string;
    hireDate: string;
  };
}

export function UserCard({ userId, className, showDetails = true, compact = false }: UserCardProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardHeader>
        {showDetails && (
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-destructive text-sm">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-xs text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <User className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No user data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'destructive';
      case 'HR_ADMIN':
      case 'HR_MANAGER':
        return 'default';
      case 'DEPARTMENT_MANAGER':
        return 'secondary';
      case 'PAYROLL_ADMIN':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage || undefined} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">
                {user.firstName} {user.lastName}
              </h3>
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {user.role.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profileImage || undefined} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </h3>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      
      {showDetails && user.employee && (
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium">{user.employee.department.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Position:</span>
              <span className="font-medium">{user.employee.position.title}</span>
            </div>
            
            {user.employee.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{user.employee.phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hire Date:</span>
              <span className="font-medium">{formatDate(user.employee.hireDate)}</span>
            </div>
            
            {user.employee.employeeId && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Employee ID:</span>
                <span className="font-medium">{user.employee.employeeId}</span>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Language:</span>
              <Badge variant="outline">{user.language.toUpperCase()}</Badge>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
