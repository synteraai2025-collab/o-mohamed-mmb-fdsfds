'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase, 
  UserCheck,
  Edit3,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Employee, EmployeeStatus, EmploymentType, Gender, MaritalStatus } from '@/types';
import { format } from 'date-fns';

interface EmployeeBasicDetailsProps {
  employeeId: string;
  className?: string;
  onEdit?: () => void;
  canEdit?: boolean;
}

interface EmployeeWithDetails extends Employee {
  department: {
    name: string;
    nameAr?: string;
  };
  position: {
    title: string;
    titleAr?: string;
  };
  manager?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function EmployeeBasicDetails({ employeeId, className, onEdit, canEdit = false }: EmployeeBasicDetailsProps) {
  const [employee, setEmployee] = useState<EmployeeWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/employees/${employeeId}`);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Employee not found' : 'Failed to fetch employee data');
        }
        
        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const getStatusBadgeVariant = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.ACTIVE:
        return 'default';
      case EmployeeStatus.INACTIVE:
        return 'secondary';
      case EmployeeStatus.TERMINATED:
        return 'destructive';
      case EmployeeStatus.ON_LEAVE:
        return 'outline';
      case EmployeeStatus.PROBATION:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getEmploymentTypeLabel = (type: EmploymentType) => {
    switch (type) {
      case EmploymentType.FULL_TIME:
        return 'Full Time';
      case EmploymentType.PART_TIME:
        return 'Part Time';
      case EmploymentType.CONTRACT:
        return 'Contract';
      case EmploymentType.INTERN:
        return 'Intern';
      case EmploymentType.FREELANCE:
        return 'Freelance';
      default:
        return type;
    }
  };

  const getGenderLabel = (gender?: Gender) => {
    switch (gender) {
      case Gender.MALE:
        return 'Male';
      case Gender.FEMALE:
        return 'Female';
      case Gender.OTHER:
        return 'Other';
      case Gender.PREFER_NOT_TO_SAY:
        return 'Prefer not to say';
      default:
        return 'Not specified';
    }
  };

  const getMaritalStatusLabel = (status?: MaritalStatus) => {
    switch (status) {
      case MaritalStatus.SINGLE:
        return 'Single';
      case MaritalStatus.MARRIED:
        return 'Married';
      case MaritalStatus.DIVORCED:
        return 'Divorced';
      case MaritalStatus.WIDOWED:
        return 'Widowed';
      case MaritalStatus.SEPARATED:
        return 'Separated';
      default:
        return 'Not specified';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Employee Details</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <User className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Employee Not Found</h3>
          <p className="text-sm text-muted-foreground">The requested employee could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  const age = calculateAge(employee.dateOfBirth);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={employee.profileImage || undefined} alt={`${employee.firstName} ${employee.lastName}`} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
            {`${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">
              {employee.firstName} {employee.lastName}
            </h2>
            <Badge variant={getStatusBadgeVariant(employee.status)} className="text-sm">
              {employee.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {employee.department.name}
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              {employee.position.title}
            </span>
          </div>
        </div>
        {canEdit && onEdit && (
          <Button 
            onClick={onEdit} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </div>
            <p className="font-medium text-foreground">{employee.email}</p>
          </div>

          {employee.phone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </div>
              <p className="font-medium text-foreground">{employee.phone}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Date of Birth</span>
            </div>
            <p className="font-medium text-foreground">
              {formatDate(employee.dateOfBirth)}
              {age && <span className="text-muted-foreground ml-1">({age} years)</span>}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Gender</span>
            </div>
            <p className="font-medium text-foreground">{getGenderLabel(employee.gender)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Marital Status</span>
            </div>
            <p className="font-medium text-foreground">{getMaritalStatusLabel(employee.maritalStatus)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Nationality</span>
            </div>
            <p className="font-medium text-foreground">
              {employee.nationality || 'Not specified'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Hire Date</span>
            </div>
            <p className="font-medium text-foreground">{formatDate(employee.hireDate)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Employment Type</span>
            </div>
            <p className="font-medium text-foreground">{getEmploymentTypeLabel(employee.employmentType)}</p>
          </div>

          {employee.terminationDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Termination Date</span>
              </div>
              <p className="font-medium text-destructive">{formatDate(employee.terminationDate)}</p>
            </div>
          )}

          {employee.manager && (
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                <span>Reports To</span>
              </div>
              <p className="font-medium text-foreground">
                {employee.manager.firstName} {employee.manager.lastName}
                <span className="text-muted-foreground ml-2">({employee.manager.email})</span>
              </p>
            </div>
          )}
        </div>

        {employee.employeeId && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Employee ID
              </div>
              <div className="font-mono text-sm font-medium text-foreground">
                {employee.employeeId}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
