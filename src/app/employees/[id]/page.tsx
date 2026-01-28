'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmployeeBasicDetails, EmployeeFinancialDetails } from '@/components/Employee';
import { User, DollarSign, FileText, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ROLE_PERMISSIONS } from '@/types';

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id as string;
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('basic');

  // Check permissions
  const userRole = session?.user?.role;
  const permissions = userRole ? ROLE_PERMISSIONS[userRole] : null;
  const canEdit = permissions?.canUpdateEmployees || false;
  const canViewFinancial = permissions?.canViewPayroll || false;

  const handleEditBasic = () => {
    // TODO: Implement edit functionality
    console.log('Edit basic details');
  };

  const handleEditFinancial = () => {
    // TODO: Implement edit functionality
    console.log('Edit financial details');
  };

  if (!employeeId) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Invalid employee ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Employee Details</h1>
        <p className="text-muted-foreground">View and manage employee information</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basic" className="gap-2">
            <User className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2" disabled={!canViewFinancial}>
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="flex justify-end">
            {canEdit && (
              <Button onClick={handleEditBasic} variant="outline" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Basic Details
              </Button>
            )}
          </div>
          <EmployeeBasicDetails 
            employeeId={employeeId} 
            onEdit={handleEditBasic}
            canEdit={canEdit}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="flex justify-end">
            {canEdit && (
              <Button onClick={handleEditFinancial} variant="outline" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Financial Details
              </Button>
            )}
          </div>
          <EmployeeFinancialDetails 
            employeeId={employeeId} 
            onEdit={handleEditFinancial}
            canEdit={canEdit}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Employee settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
