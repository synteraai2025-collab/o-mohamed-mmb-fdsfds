'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  CreditCard,
  PiggyBank,
  Edit3,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface EmployeeFinancialDetailsProps {
  employeeId: string;
  className?: string;
  onEdit?: () => void;
  canEdit?: boolean;
}

interface FinancialDetails {
  id: string;
  employeeId: string;
  basicSalary: number;
  currency: string;
  allowances: {
    id: string;
    name: string;
    amount: number;
    isTaxable: boolean;
    description?: string;
  }[];
  deductions: {
    id: string;
    name: string;
    amount: number;
    isTaxDeductible: boolean;
    description?: string;
  }[];
  bonuses: {
    id: string;
    name: string;
    amount: number;
    isTaxable: boolean;
    description?: string;
    frequency: string;
  }[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    routingNumber?: string;
    iban?: string;
    swiftCode?: string;
  };
  taxDetails?: {
    taxId: string;
    taxBracket: string;
    exemptions: number;
  };
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export function EmployeeFinancialDetails({ employeeId, className, onEdit, canEdit = false }: EmployeeFinancialDetailsProps) {
  const [financialData, setFinancialData] = useState<FinancialDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'salary' | 'allowances' | 'deductions' | 'bonuses' | 'bank'>('salary');

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/employees/${employeeId}/financial`);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Financial details not found' : 'Failed to fetch financial data');
        }
        
        const data = await response.json();
        setFinancialData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load financial data');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchFinancialData();
    }
  }, [employeeId]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotals = () => {
    if (!financialData) return null;

    const totalAllowances = financialData.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    const totalDeductions = financialData.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const totalBonuses = financialData.bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    const grossSalary = financialData.basicSalary + totalAllowances + totalBonuses;
    const netSalary = grossSalary - totalDeductions;

    return {
      totalAllowances,
      totalDeductions,
      totalBonuses,
      grossSalary,
      netSalary
    };
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="space-y-0 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Financial Details</h3>
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

  if (!financialData || !totals) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Financial Data Available</h3>
          <p className="text-sm text-muted-foreground">Financial information for this employee is not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Basic Salary</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(financialData.basicSalary, financialData.currency)}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Allowances</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{formatCurrency(totals.totalAllowances, financialData.currency)}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -{formatCurrency(totals.totalDeductions, financialData.currency)}
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Net Salary</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(totals.netSalary, financialData.currency)}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <PiggyBank className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Financial Details</CardTitle>
            <CardDescription>
              Salary breakdown and financial information
            </CardDescription>
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
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
            {[
              { id: 'salary', label: 'Salary', icon: DollarSign },
              { id: 'allowances', label: 'Allowances', icon: TrendingUp },
              { id: 'deductions', label: 'Deductions', icon: TrendingDown },
              { id: 'bonuses', label: 'Bonuses', icon: CheckCircle },
              { id: 'bank', label: 'Bank Details', icon: CreditCard }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(id as any)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'salary' && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Salary Information</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Salary:</span>
                      <span className="font-medium">{formatCurrency(financialData.basicSalary, financialData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Currency:</span>
                      <span className="font-medium">{financialData.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Effective Date:</span>
                      <span className="font-medium">{format(new Date(financialData.effectiveDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{format(new Date(financialData.updatedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Salary Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Salary:</span>
                      <span className="font-medium">{formatCurrency(totals.grossSalary, financialData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Deductions:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        -{formatCurrency(totals.totalDeductions, financialData.currency)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Net Salary:</span>
                        <span className="font-bold text-primary text-lg">
                          {formatCurrency(totals.netSalary, financialData.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'allowances' && (
              <div className="space-y-3">
                {financialData.allowances.length > 0 ? (
                  financialData.allowances.map((allowance) => (
                    <div key={allowance.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{allowance.name}</span>
                          {allowance.isTaxable && (
                            <Badge variant="outline" className="text-xs">Taxable</Badge>
                          )}
                        </div>
                        {allowance.description && (
                          <p className="text-sm text-muted-foreground">{allowance.description}</p>
                        )}
                      </div>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(allowance.amount, financialData.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No allowances configured</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deductions' && (
              <div className="space-y-3">
                {financialData.deductions.length > 0 ? (
                  financialData.deductions.map((deduction) => (
                    <div key={deduction.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{deduction.name}</span>
                          {deduction.isTaxDeductible && (
                            <Badge variant="outline" className="text-xs">Tax Deductible</Badge>
                          )}
                        </div>
                        {deduction.description && (
                          <p className="text-sm text-muted-foreground">{deduction.description}</p>
                        )}
                      </div>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        -{formatCurrency(deduction.amount, financialData.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No deductions configured</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bonuses' && (
              <div className="space-y-3">
                {financialData.bonuses.length > 0 ? (
                  financialData.bonuses.map((bonus) => (
                    <div key={bonus.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{bonus.name}</span>
                          <Badge variant="outline" className="text-xs">{bonus.frequency}</Badge>
                          {bonus.isTaxable && (
                            <Badge variant="outline" className="text-xs">Taxable</Badge>
                          )}
                        </div>
                        {bonus.description && (
                          <p className="text-sm text-muted-foreground">{bonus.description}</p>
                        )}
                      </div>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        +{formatCurrency(bonus.amount, financialData.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No bonuses configured</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bank' && financialData.bankDetails && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                    <p className="font-medium text-foreground">{financialData.bankDetails.bankName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <p className="font-medium text-foreground">{financialData.bankDetails.accountType}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                    <p className="font-mono font-medium text-foreground">
                      ••••{financialData.bankDetails.accountNumber.slice(-4)}
                    </p>
                  </div>
                  {financialData.bankDetails.routingNumber && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Routing Number</label>
                      <p className="font-mono font-medium text-foreground">{financialData.bankDetails.routingNumber}</p>
                    </div>
                  )}
                  {financialData.bankDetails.iban && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">IBAN</label>
                      <p className="font-mono font-medium text-foreground">{financialData.bankDetails.iban}</p>
                    </div>
                  )}
                  {financialData.bankDetails.swiftCode && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">SWIFT Code</label>
                      <p className="font-mono font-medium text-foreground">{financialData.bankDetails.swiftCode}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bank' && !financialData.bankDetails && (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No bank details configured</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
