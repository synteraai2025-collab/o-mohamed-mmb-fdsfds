'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, Users, Search, Filter, Edit, Trash2, MoreVertical, Sitemap, DollarSign, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Department, DepartmentWithRelations, CreateDepartmentInput, UpdateDepartmentInput } from '@/types/department';
import type { Employee } from '@/types/employee';

interface DepartmentsResponse {
  departments: DepartmentWithRelations[];
  total: number;
  page: number;
  pageSize: number;
}

// Form schemas
const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(100, 'Department name must be 100 characters or less'),
  nameAr: z.string().optional(),
  code: z.string().min(1, 'Department code is required').max(10, 'Department code must be 10 characters or less'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  parentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  budget: z.number().min(0, 'Budget must be non-negative').optional(),
  costCenterCode: z.string().optional(),
});

const updateDepartmentSchema = createDepartmentSchema.partial();

type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<DepartmentWithRelations[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentWithRelations | null>(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        include: 'manager,parent,employeeCount',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/departments?${params}`);
      const data: DepartmentsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch departments');
      }

      setDepartments(data.departments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch departments';
      setError(errorMessage);
      toast.error('Failed to fetch departments', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees?status=active');
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [currentPage, searchTerm]);

  const handleCreateDepartment = async (data: CreateDepartmentFormData) => {
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create department');
      }

      toast.success('Department created successfully', {
        description: `${data.name} has been added to the system.`,
      });

      setShowCreateDialog(false);
      fetchDepartments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to create department', {
        description: errorMessage,
      });
      throw err;
    }
  };

  const handleUpdateDepartment = async (data: UpdateDepartmentFormData) => {
    if (!selectedDepartment) return;

    try {
      const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update department');
      }

      toast.success('Department updated successfully', {
        description: `${data.name || selectedDepartment.name} has been updated.`,
      });

      setShowEditDialog(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to update department', {
        description: errorMessage,
      });
      throw err;
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete department');
      }

      toast.success('Department deleted successfully', {
        description: `${selectedDepartment.name} has been deleted.`,
      });

      setShowDeleteDialog(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to delete department', {
        description: errorMessage,
      });
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeDepartments = filteredDepartments.filter(dept => dept.status === 'active');
  const inactiveDepartments = filteredDepartments.filter(dept => dept.status === 'inactive');

  const DepartmentCard = ({ department }: { department: DepartmentWithRelations }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{department.name}</CardTitle>
              <CardDescription className="text-sm">
                {department.code}
                {department.parent && (
                  <span className="ml-2 text-xs">
                    • {department.parent.name}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedDepartment(department);
                  setShowEditDialog(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Department
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/departments/${department.id}`)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Employees
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedDepartment(department);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Department
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {department.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {department.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{department.employeeCount || 0} employees</span>
        </div>

        {department.manager && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{department.manager.firstName} {department.manager.lastName}</span>
          </div>
        )}

        {department.budget && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>Budget: ${department.budget.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Badge 
            variant={department.status === 'active' ? 'default' : 'secondary'}
            className={department.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
          >
            {department.status.toUpperCase()}
          </Badge>
          
          {department.costCenterCode && (
            <Badge variant="outline" className="text-xs">
              {department.costCenterCode}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const DepartmentForm = ({ 
    department, 
    onSubmit, 
    onCancel 
  }: { 
    department?: DepartmentWithRelations;
    onSubmit: (data: CreateDepartmentFormData | UpdateDepartmentFormData) => Promise<void>;
    onCancel: () => void;
  }) => {
    const form = useForm<CreateDepartmentFormData>({
      resolver: zodResolver(department ? updateDepartmentSchema : createDepartmentSchema),
      defaultValues: {
        name: department?.name || '',
        nameAr: department?.nameAr || '',
        code: department?.code || '',
        description: department?.description || '',
        descriptionAr: department?.descriptionAr || '',
        parentId: department?.parentId || '',
        managerId: department?.managerId || '',
        budget: department?.budget || undefined,
        costCenterCode: department?.costCenterCode || '',
      },
    });

    const handleSubmit = async (data: CreateDepartmentFormData) => {
      await onSubmit(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Arabic name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Code *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., HR, IT, SALES" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Parent</SelectItem>
                      {departments
                        .filter(dept => !department || dept.id !== department.id)
                        .map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Manager</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Manager</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter department description"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descriptionAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Arabic)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter Arabic description"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Budget</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter annual budget"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="costCenterCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Center Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CC-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {department ? 'Update Department' : 'Create Department'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
          <p className="text-muted-foreground">
            Manage organizational departments and their structure
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Department
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredDepartments.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeDepartments.length} active departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Departments</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeDepartments.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeDepartments.length / filteredDepartments.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredDepartments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Managers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredDepartments.filter(dept => dept.manager).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Departments with assigned managers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find departments by name, code, or description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
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
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Departments ({filteredDepartments.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeDepartments.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveDepartments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredDepartments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No departments found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    No departments match your search criteria. Try adjusting your search.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Department
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDepartments.map((department) => (
                  <DepartmentCard key={department.id} department={department} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeDepartments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inactiveDepartments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Create Department Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department to your organizational structure
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm
            onSubmit={handleCreateDepartment}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <DepartmentForm
              department={selectedDepartment}
              onSubmit={handleUpdateDepartment}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedDepartment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Department Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedDepartment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDepartment}
            >
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
