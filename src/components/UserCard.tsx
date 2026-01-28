'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, User, Users, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types';
import { Button } from '@/components/ui/button';

interface UserCardProps {
  userId?: string;
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  onRetry?: () => void;
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

export function UserCard({ userId, className, showDetails = true, compact = false, onRetry }: UserCardProps) {
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
          throw new Error(response.status === 404 ? 'User not found' : 'Failed to fetch user data');
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

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior
      setError(null);
      setIsLoading(true);
      // Trigger re-fetch by updating the effect
      const event = new CustomEvent('userCardRetry');
      window.dispatchEvent(event);
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </CardHeader>
        {showDetails && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground">Unable to Load User</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <User className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No User Data</h3>
          <p className="text-sm text-muted-foreground">User information is not available</p>
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

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                     'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  if (compact) {
    return (
      <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage || undefined} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate text-foreground">
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
          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.isActive)}`} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full hover:shadow-lg transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.profileImage || undefined} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-foreground">
              {user.firstName} {user.lastName}
            </h3>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(user.isActive)}`} />
      </CardHeader>
      
      {showDetails && user.employee && (
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium text-foreground">{user.employee.department.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Position:</span>
              <span className="font-medium text-foreground">{user.employee.position.title}</span>
            </div>
            
            {user.employee.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium text-foreground">{user.employee.phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Hire Date:</span>
              <span className="font-medium text-foreground">{formatDate(user.employee.hireDate)}</span>
            </div>
            
            {user.employee.employeeId && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Employee ID:</span>
                <span className="font-medium text-foreground">{user.employee.employeeId}</span>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Language:</span>
              <Badge variant="outline" className="text-xs">
                {user.language.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
