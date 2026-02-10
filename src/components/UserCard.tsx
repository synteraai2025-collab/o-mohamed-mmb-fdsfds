'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, User, Edit, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { User as UserType } from '@/types';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface UserCardProps {
  userId?: string;
  user?: UserType;
  employee?: {
    id: string;
    employeeId: string;
    department?: {
      name: string;
    };
    position: string;
    hireDate: Date;
  };
  onEdit?: () => void;
  onView?: () => void;
  showActions?: boolean;
  className?: string;
}

export function UserCard({ 
  userId, 
  user, 
  employee, 
  onEdit, 
  onView, 
  showActions = true,
  className = ''
}: UserCardProps) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(!user && !employee);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType | null>(user || null);
  const [employeeData, setEmployeeData] = useState<any>(employee || null);

  const isRTL = i18n.language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  useEffect(() => {
    if (userId && !user) {
      fetchUserData();
    } else if (user) {
      setUserData(user);
      setLoading(false);
    }
  }, [userId, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserData(data.user);
      setEmployeeData(data.employee);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'destructive';
      case 'HR Admin':
        return 'default';
      case 'Payroll Admin':
        return 'secondary';
      case 'Manager':
        return 'outline';
      case 'Employee':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatRoleName = (role: string) => {
    return t(`roles.${role.toLowerCase().replace(' ', '')}`, role);
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-red-500">
              <User className="h-12 w-12 mx-auto" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive">
                {t('userCard.error.title', 'Error Loading User')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('userCard.error.message', error)}
              </p>
            </div>
            <Button 
              onClick={fetchUserData} 
              variant="outline" 
              size="sm"
            >
              {t('userCard.error.retry', 'Retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              <User className="h-12 w-12 mx-auto" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t('userCard.notFound.title', 'User Not Found')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('userCard.notFound.message', 'The requested user could not be found.')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${userData.firstName} ${userData.lastName}`;
  const initials = getInitials(userData.firstName, userData.lastName);

  return (
    <Card className={`w-full hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={userData.profilePhoto || undefined} 
              alt={fullName} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold truncate ${isRTL ? 'text-right' : ''}`}>
              {fullName}
            </h3>
            <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'justify-end' : ''}`}>
              <Badge variant={getRoleBadgeVariant(userData.role)}>
                {formatRoleName(userData.role)}
              </Badge>
              {!userData.isActive && (
                <Badge variant="destructive" className="text-xs">
                  {t('userCard.inactive', 'Inactive')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{userData.email}</span>
          </div>
          
          {employeeData && (
            <>
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
                <User className="h-4 w-4 flex-shrink-0" />
                <span>{employeeData.position}</span>
              </div>
              
              {employeeData.department && (
                <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{employeeData.department.name}</span>
                </div>
              )}
              
              <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  {t('userCard.hireDate', 'Hired:')} {format(new Date(employeeData.hireDate), 'MMM d, yyyy', { locale: dateLocale })}
                </span>
              </div>
            </>
          )}
          
          {userData.lastLogin && (
            <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {t('userCard.lastLogin', 'Last login:')} {format(new Date(userData.lastLogin), 'MMM d, yyyy h:mm a', { locale: dateLocale })}
              </span>
            </div>
          )}
        </div>
        
        {showActions && (onEdit || onView) && (
          <div className={`flex gap-2 pt-2 ${isRTL ? 'justify-end' : ''}`}>
            {onView && (
              <Button 
                onClick={onView} 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t('userCard.view', 'View')}
              </Button>
            )}
            {onEdit && (
              <Button 
                onClick={onEdit} 
                variant="default" 
                size="sm"
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('userCard.edit', 'Edit')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
