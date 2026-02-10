'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, Users, Search, Filter, Edit, Trash2, MoreVertical, Sitemap, DollarSign, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
import { Input as FormInput } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Position, PositionWithRelations, CreatePositionInput, UpdatePositionInput, PositionLevel, PositionStatus } from '@/types/position';
import type { Department } from '@/types/department';

interface PositionsResponse {
  positions: PositionWithRelations[];
  total: number;
  page: number;
  pageSize: number;
}

// Form schemas
const createPositionSchema = z.object({
  title: z.string().min(1, 'Position title is required').max(100, 'Position title must be 100 characters or less'),
  titleAr: z.string().optional(),
  code: z.string().min(1, 'Position code is required').max(20, 'Position code must be 20 characters or less'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  level: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive']).default('mid'),
  departmentId: z.string().uuid('Department ID must be a valid UUID'),
  reportsToId: z.string().uuid().optional(),
  minSalary: z.number().min(0, 'Minimum salary must be non-negative').optional(),
  maxSalary: z.number().min(0, 'Maximum salary must be non-negative').optional(),
  currency: z.string().default('USD'),
  headcount: z.number().int().min(1, 'Headcount must be at least 1').default(1),
  jobFamily: z.string().optional(),
  jobFunction: z.string().optional(),
  location: z.string().optional(),
  workArrangement: z.enum(['on-site', 'remote', 'hybrid']).optional(),
});

const updatePositionSchema = createPositionSchema.partial();

type CreatePositionFormData = z.infer<typeof createPositionSchema>;
type UpdatePositionFormData = z.infer<typeof updatePositionSchema>;

export default function PositionsPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<PositionWithRelations[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<PositionLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<PositionStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionWithRelations | null>(null);

  const fetchPositions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        include: 'department,reportsTo,employeeCount',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDepartment !== 'all' && { departmentId: selectedDepartment }),
        ...(selectedLevel !== 'all' && { level: selectedLevel }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
      });

      const response = await fetch(`/api/positions?${params}`);
      const data: PositionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch positions');
      }

      setPositions(data.positions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch positions';
      setError(errorMessage);
      toast.error('Failed to fetch positions', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments?status=active');
      const data = await response.json();
      if (response.ok) {
        setDepartments(data.departments || []);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, [currentPage, searchTerm, selectedDepartment, selectedLevel, selectedStatus]);

  const handleCreatePosition = async (data: CreatePositionFormData) => {
    try {
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create position');
      }

      toast.success('Position created successfully', {
        description: `${data.title} has been added to the system.`,
      });

      setShowCreateDialog(false);
      fetchPositions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to create position', {
        description: errorMessage,
      });
      throw err;
    }
  };

  const handleUpdatePosition = async (data: UpdatePositionFormData) => {
    if (!selectedPosition) return;

    try {
      const response = await fetch(`/api/positions/${selectedPosition.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update position');
      }

      toast.success('Position updated successfully', {
        description: `${data.title || selectedPosition.title} has been updated.`,
      });

      setShowEditDialog(false);
      setSelectedPosition(null);
      fetchPositions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to update position', {
        description: errorMessage,
      });
      throw err;
    }
  };

  const handleDeletePosition = async () => {
    if (!selectedPosition) return;

    try {
      const response = await fetch(`/api/positions/${selectedPosition.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete position');
      }

      toast.success('Position deleted successfully', {
        description: `${selectedPosition.title} has been deleted.`,
      });

      setShowDeleteDialog(false);
      setSelectedPosition(null);
      fetchPositions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to delete position', {
        description: errorMessage,
      });
    }
  };

  const filteredPositions = positions.filter(position =>
    position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (position.description && position.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activePositions = filteredPositions.filter(pos => pos.status === 'active');
  const inactivePositions = filteredPositions.filter(pos => pos.status === 'inactive');
  const onHoldPositions = filteredPositions.filter(pos => pos.status === 'on-hold');

  const levelOptions: { value: PositionLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'manager', label: 'Manager' },
    { value: 'director', label: 'Director' },
    { value: 'executive', label: 'Executive' },
  ];

  const statusOptions: { value: PositionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-hold', label: 'On Hold' },
  ];

  const PositionCard = ({ position }: { position: PositionWithRelations }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{position.title}</CardTitle>
              <CardDescription className="text-sm">
                {position.code}
                {position.department && (
                  <span className="ml-2 text-xs">
                    • {position.department.name}
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
                  setSelectedPosition(position);
                  setShowEditDialog(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Position
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/positions/${position.id}/employees`)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Employees
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedPosition(position);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Position
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {position.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {position.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{position.employeeCount || 0} / {position.headcount} positions filled</span>
        </div>

        {position.reportsTo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sitemap className="h-3 w-3" />
            <span>Reports to: {position.reportsTo.title}</span>
          </div>
        )}

        {(position.minSalary || position.maxSalary) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>
              {position.minSalary && position.maxSalary 
                ? `${position.currency} ${position.minSalary.toLocaleString()} - ${position.maxSalary.toLocaleString()}`
                : position.minSalary 
                ? `From ${position.currency} ${position.minSalary.toLocaleString()}`
                : `Up to ${position.currency} ${position.maxSalary?.toLocaleString()}`
              }
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Badge 
            variant={position.status === 'active' ? 'default' : 'secondary'}
            className={position.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
          >
            {position.status === 'active' ? <CheckCircle className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
            {position.status.toUpperCase()}
          </Badge>
          
          <Badge variant="outline" className="text-xs">
            {position.level.toUpperCase()}
          </Badge>
        </div>

        {position.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{position.location}</span>
          </div>
        )}

        {position.workArrangement && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="capitalize">{position.workArrangement.replace('-', ' ')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PositionForm = ({ 
    position, 
    onSubmit, 
    onCancel 
  }: { 
    position?: PositionWithRelations;
    onSubmit: (data: CreatePositionFormData | UpdatePositionFormData) => Promise<void>;
    onCancel: () => void;
  }) => {
    const form = useForm<CreatePositionFormData>({
      resolver: zodResolver(position ? updatePositionSchema : createPositionSchema),
      defaultValues: {
        title: position?.title || '',
        titleAr: position?.titleAr || '',
        code: position?.code || '',
        description: position?.description || '',
        descriptionAr: position?.descriptionAr || '',
        level: position?.level || 'mid',
        departmentId: position?.departmentId || '',
        reportsToId: position?.reportsToId || '',
        minSalary: position?.minSalary || undefined,
        maxSalary: position?.maxSalary || undefined,
        currency: position?.currency || 'USD',
        headcount: position?.headcount || 1,
        jobFamily: position?.jobFamily || '',
        jobFunction: position?.jobFunction || '',
        location: position?.location || '',
        workArrangement: position?.workArrangement || undefined,
      },
    });

    const handleSubmit = async (data: CreatePositionFormData) => {
      await onSubmit(data);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Title *</FormLabel>
                  <FormControl>
                    <FormInput placeholder="Enter position title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titleAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Title (Arabic)</FormLabel>
                  <FormControl>
                    <FormInput placeholder="Enter Arabic title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Code *</FormLabel>
                  <FormControl>
                    <FormInput placeholder="e.g., SWE-001, MGR-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
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
            name="reportsToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reports To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reporting position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No Reporting Position</SelectItem>
                    {positions
                      .filter(pos => !position || pos.id !== position.id)
                      .map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.title} ({pos.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary</FormLabel>
                  <FormControl>
                    <FormInput 
                      type="number" 
                      placeholder="Enter minimum salary"
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
              name="maxSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Salary</FormLabel>
                  <FormControl>
                    <FormInput 
                      type="number" 
                      placeholder="Enter maximum salary"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headcount</FormLabel>
                <FormControl>
                  <FormInput 
                    type="number" 
                    placeholder="Enter headcount"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="jobFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Family</FormLabel>
                  <FormControl>
                    <FormInput placeholder="e.g., Engineering, Sales, Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobFunction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Function</FormLabel>
                  <FormControl>
                    <FormInput placeholder="e.g., Software Development, Business Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <FormInput placeholder="e.g., Riyadh, Dubai, Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workArrangement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Arrangement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work arrangement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
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
                    placeholder="Enter position description"
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {position ? 'Update Position' : 'Create Position'}
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
          <h1 className="text-3xl font-bold tracking-tight">Position Management</h1>
          <p className="text-muted-foreground">
            Manage job positions, roles, and organizational hierarchy
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Position
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePositions.length} active positions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePositions.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activePositions.length / filteredPositions.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filled Positions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPositions.reduce((sum, pos) => sum + (pos.employeeCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all positions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary Range</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPositions.filter(pos => pos.minSalary || pos.maxSalary).length}
            </div>
            <p className="text-xs text-muted-foreground">
              With salary ranges defined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find positions by title, department, level, or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as PositionLevel | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as PositionStatus | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions Grid */}
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
            <TabsTrigger value="all">All Positions ({filteredPositions.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activePositions.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactivePositions.length})</TabsTrigger>
            <TabsTrigger value="on-hold">On Hold ({onHoldPositions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredPositions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No positions found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    No positions match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Position
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPositions.map((position) => (
                  <PositionCard key={position.id} position={position} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activePositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inactivePositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="on-hold" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {onHoldPositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Create Position Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Position</DialogTitle>
            <DialogDescription>
              Add a new position to your organizational structure
            </DialogDescription>
          </DialogHeader>
          <PositionForm
            onSubmit={handleCreatePosition}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Position Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>
              Update position information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedPosition && (
            <PositionForm
              position={selectedPosition}
              onSubmit={handleUpdatePosition}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedPosition(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Position Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Position</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPosition?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedPosition(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePosition}
            >
              Delete Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
