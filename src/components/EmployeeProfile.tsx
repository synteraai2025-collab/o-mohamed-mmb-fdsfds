'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Edit,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Employee, LeaveBalance, Payroll, UserRole } from '@/types';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useSession } from 'next-auth/react';

interface EmployeeProfileProps {
  employeeId: string;
  onEdit?: () => void;
  className?: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  requiredPermission?: string;
}

export function EmployeeProfile({ employeeId, onEdit, className = '' }: EmployeeProfileProps) {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<Payroll[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  const isRTL = i18n.language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  const tabs: TabConfig[] = [
    {
      id: 'basic',
      label: t('employeeProfile.tabs.basic', 'Basic Details'),
      icon: User,
    },
    {
      id: 'financial',
      label: t('employeeProfile.tabs.financial', 'Financial Details'),
      icon: DollarSign,
      requiredPermission: 'financial',
    },
    {
      id: 'payroll',
      label: t('employeeProfile.tabs.payroll', 'Payroll History'),
      icon: Briefcase,
      requiredPermission: 'payroll',
    },
    {
      id: 'leave',
      label: t('employeeProfile.tabs.leave', 'Leave Balance'),
      icon: Clock,
      requiredPermission: 'leave',
    },
  ];

  const userRole = session?.user?.role as UserRole;
  const canAccessFinancial = ['Owner', 'HR Admin', 'Payroll Admin'].includes(userRole);
  const canAccessPayroll = ['Owner', 'HR Admin', 'Payroll Admin'].includes(userRole);
  const canAccessLeave = ['Owner', 'HR Admin', 'Manager'].includes(userRole) || 
                         (userRole === 'Employee' && session?.user?.employeeId === employeeId);

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [employeeRes, leaveRes, payrollRes] = await Promise.all([
        fetch(`/api/employees/${employeeId}`),
        canAccessLeave ? fetch(`/api/employees/${employeeId}/leave-balance`) : Promise.resolve(null),
        canAccessPayroll ? fetch(`/api/employees/${employeeId}/payroll-history`) : Promise.resolve(null),
      ]);

      if (!employeeRes.ok) {
        throw new Error('Failed to fetch employee data');
      }

      const employeeData = await employeeRes.json();
      setEmployee(employeeData.employee);

      if (leaveRes && leaveRes.ok) {
        const leaveData = await leaveRes.json();
        setLeaveBalance(leaveData.balances || []);
      }

      if (payrollRes && payrollRes.ok) {
        const payrollData = await payrollRes.json();
        setPayrollHistory(payrollData.payrolls || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'terminated':
        return 'destructive';
      case 'on-leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatStatus = (status: string) => {
    return t(`employeeProfile.status.${status}`, status.charAt(0).toUpperCase() + status.slice(1));
  };

  const formatEmploymentType = (type: string) => {
    return t(`employeeProfile.employmentType.${type}`, type.charAt(0).toUpperCase() + type.slice(1));
  };

  const filteredTabs = tabs.filter(tab => {
    if (tab.requiredPermission === 'financial' && !canAccessFinancial) return false;
    if (tab.requiredPermission === 'payroll' && !canAccessPayroll) return false;
    if (tab.requiredPermission === 'leave' && !canAccessLeave) return false;
    return true;
  });

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('employeeProfile.error.loading', 'Failed to load employee profile')}: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('employeeProfile.notFound', 'Employee not found')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = getInitials(employee.firstName, employee.lastName);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={employee.profilePhoto || undefined} 
                alt={fullName} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className={`flex items-center gap-4 ${isRTL ? 'justify-end' : ''}`}>
                <h1 className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
                  {fullName}
                </h1>
                <Badge variant={getStatusBadgeVariant(employee.status)}>
                  {formatStatus(employee.status)}
                </Badge>
              </div>
              <div className={`flex items-center gap-6 mt-2 text-sm text-muted-foreground ${isRTL ? 'justify-end' : ''}`}>
                <span>{employee.employeeId}</span>
                <span>{employee.position}</span>
                <span>{formatEmploymentType(employee.employmentType)}</span>
              </div>
            </div>
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('employeeProfile.edit', 'Edit')}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid ${isRTL ? 'grid-flow-col-dense' : ''}`}>
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('employeeProfile.basicDetails', 'Basic Details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.firstName', 'First Name')}
                    </label>
                    <p className="text-base">{employee.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.lastName', 'Last Name')}
                    </label>
                    <p className="text-base">{employee.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.email', 'Email')}
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{employee.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.phone', 'Phone')}
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{employee.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.dateOfBirth', 'Date of Birth')}
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">
                        {format(new Date(employee.dateOfBirth), 'MMMM d, yyyy', { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.hireDate', 'Hire Date')}
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">
                        {format(new Date(employee.hireDate), 'MMMM d, yyyy', { locale: dateLocale })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.position', 'Position')}
                    </label>
                    <p className="text-base">{employee.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('employeeProfile.fields.employmentType', 'Employment Type')}
                    </label>
                    <p className="text-base">{formatEmploymentType(employee.employmentType)}</p>
                  </div>
                </div>
              </div>
              
              {employee.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('employeeProfile.fields.address', 'Address')}
                  </label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-base">
                      {employee.address.street}, {employee.address.city}, {employee.address.state} {employee.address.zipCode}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {canAccessFinancial && (
          <TabsContent value="financial" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('employeeProfile.financialDetails', 'Financial Details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('employeeProfile.fields.salary', 'Basic Salary')}
                      </label>
                      <p className="text-base font-semibold">
                        ${employee.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {employee.bankDetails && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('employeeProfile.fields.bankName', 'Bank Name')}
                        </label>
                        <p className="text-base">{employee.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('employeeProfile.fields.accountNumber', 'Account Number')}
                        </label>
                        <p className="text-base">••••{employee.bankDetails.accountNumber.slice(-4)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('employeeProfile.fields.accountType', 'Account Type')}
                        </label>
                        <p className="text-base">
                          {t(`employeeProfile.accountType.${employee.bankDetails.accountType}`, employee.bankDetails.accountType)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canAccessPayroll && (
          <TabsContent value="payroll" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('employeeProfile.payrollHistory', 'Payroll History')}</CardTitle>
              </CardHeader>
              <CardContent>
                {payrollHistory.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('employeeProfile.noPayrollHistory', 'No payroll history available')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {payrollHistory.map((payroll) => (
                      <div key={payroll.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              {format(new Date(payroll.payPeriodStart), 'MMM d, yyyy', { locale: dateLocale })} - 
                              {format(new Date(payroll.payPeriodEnd), 'MMM d, yyyy', { locale: dateLocale })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t('employeeProfile.payDate', 'Pay Date')}: {format(new Date(payroll.payDate), 'MMM d, yyyy', { locale: dateLocale })}
                            </p>
                          </div>
                          <Badge variant={payroll.status === 'paid' ? 'success' : 'secondary'}>
                            {t(`employeeProfile.payrollStatus.${payroll.status}`, payroll.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">{t('employeeProfile.grossPay', 'Gross Pay')}</p>
                            <p className="font-medium">${payroll.grossPay.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t('employeeProfile.deductions', 'Deductions')}</p>
                            <p className="font-medium">${payroll.totalDeductions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{t('employeeProfile.netPay', 'Net Pay')}</p>
                            <p className="font-medium">${payroll.netPay.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canAccessLeave && (
          <TabsContent value="leave" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('employeeProfile.leaveBalance', 'Leave Balance')}</CardTitle>
              </CardHeader>
              <CardContent>
                {leaveBalance.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('employeeProfile.noLeaveBalance', 'No leave balance information available')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {leaveBalance.map((balance) => (
                      <div key={balance.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{balance.leaveType.name}</h4>


