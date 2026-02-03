'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Search, Filter, Mail, UserX, Power, RefreshCw, MoreVertical } from 'lucide-react';
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
import UserCard from '@/components/UserCard';
import CreateUser from './create-user';
import InviteUser from './invite-user';
import SuspendUser from './suspend-user';
import DeactivateUser from './deactivate-user';
import type { User, UserRole, UserStatus } from '@/types/auth';

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  
  // Modal states
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole !== 'all' && { role: selectedRole }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
      });

      const response = await fetch(`/api/users?${params}`);
      const data: UsersResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      toast.error('Failed to fetch users', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  const handleCreateUser = () => {
    setShowCreateUser(true);
  };

  const handleInviteUser = () => {
    setShowInviteUser(true);
  };

  const handleSuspendUser = (user: User) => {
    if (user.status === 'suspended') {
      toast.error('User is already suspended');
      return;
    }
    setSuspendUser(user);
  };

  const handleDeactivateUser = (user: User) => {
    if (user.status === 'inactive') {
      toast.error('User is already deactivated');
      return;
    }
    setDeactivateUser(user);
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/activate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to activate user');
      }

      toast.success('User activated successfully');
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate user';
      toast.error('Failed to activate user', {
        description: errorMessage,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error('Failed to delete user', {
        description: errorMessage,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = filteredUsers.filter(user => user.status === 'active');
  const suspendedUsers = filteredUsers.filter(user => user.status === 'suspended');
  const inactiveUsers = filteredUsers.filter(user => user.status === 'inactive');
  const pendingUsers = filteredUsers.filter(user => user.status === 'pending');

  const roleOptions: { value: UserRole | 'all'; label: string }[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'employee', label: 'Employee' },
    { value: 'department-manager', label: 'Department Manager' },
    { value: 'hr-staff', label: 'HR Staff' },
    { value: 'hr-manager', label: 'HR Manager' },
    { value: 'admin', label: 'Admin' },
    { value: 'super-admin', label: 'Super Admin' },
  ];

  const statusOptions: { value: UserStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  if (showCreateUser) {
    return (
      <CreateUser
        onSuccess={() => {
          setShowCreateUser(false);
          fetchUsers();
        }}
        onCancel={() => setShowCreateUser(false)}
      />
    );
  }

  if (showInviteUser) {
    return (
      <InviteUser
        onSuccess={() => {
          setShowInviteUser(false);
          fetchUsers();
        }}
        onCancel={() => setShowInviteUser(false)}
      />
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and access permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInviteUser} variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Invite User
          </Button>
          <Button onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers.length} active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeUsers.length / filteredUsers.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{suspendedUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting reactivation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-4 w-4 bg-blue-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Invitation pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter users by search term, role, or status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as UserStatus | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedStatus('all');
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
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
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
            <TabsTrigger value="suspended">Suspended ({suspendedUsers.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveUsers.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    No users match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button onClick={handleCreateUser}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First User
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={(user) => router.push(`/users/${user.id}/edit`)}
                    onSuspend={handleSuspendUser}
                    onActivate={handleActivateUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={(user) => router.push(`/users/${user.id}/edit`)}
                  onSuspend={handleSuspendUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suspended" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {suspendedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={(user) => router.push(`/users/${user.id}/edit`)}
                  onActivate={handleActivateUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inactiveUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={(user) => router.push(`/users/${user.id}/edit`)}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pendingUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={(user) => router.push(`/users/${user.id}/edit`)}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      {suspendUser && (
        <SuspendUser
          user={suspendUser}
          isOpen={!!suspendUser}
          onClose={() => setSuspendUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      {deactivateUser && (
        <DeactivateUser
          user={deactivateUser}
          isOpen={!!deactivateUser}
          onClose={() => setDeactivateUser(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
