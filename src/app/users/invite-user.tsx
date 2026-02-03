'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Shield, 
  Globe, 
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userRoleSchema, type UserRole } from '@/types/auth';

// Invitation schema
const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  role: userRoleSchema.default('employee'),
  language: z.enum(['en', 'ar']).default('en'),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
  expiresInDays: z.number().int().min(1).max(30).default(7),
  sendEmail: z.boolean().default(true),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

interface InviteUserProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function InviteUser({ onSuccess, onCancel, className }: InviteUserProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationSent, setInvitationSent] = useState(false);

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'employee',
      language: 'en',
      message: '',
      expiresInDays: 7,
      sendEmail: true,
    },
  });

  const onSubmit = async (data: InviteUserFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation');
      }

      toast.success('Invitation sent successfully', {
        description: `An invitation has been sent to ${data.email}.`,
      });

      setInvitationSent(true);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to send invitation', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setError(null);
    setInvitationSent(false);
    if (onCancel) {
      onCancel();
    } else {
      router.push('/users');
    }
  };

  const handleSendAnother = () => {
    setInvitationSent(false);
    form.reset();
    setError(null);
  };

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    { value: 'employee', label: 'Employee', description: 'Standard employee access' },
    { value: 'department-manager', label: 'Department Manager', description: 'Manage department and approve leaves' },
    { value: 'hr-staff', label: 'HR Staff', description: 'HR operations and employee management' },
    { value: 'hr-manager', label: 'HR Manager', description: 'Full HR management and payroll' },
    { value: 'admin', label: 'Admin', description: 'System administration' },
    { value: 'super-admin', label: 'Super Admin', description: 'Full system access' },
  ];

  if (invitationSent) {
    return (
      <div className={cn("max-w-2xl mx-auto", className)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Invitation Sent Successfully!</CardTitle>
                <CardDescription>
                  The user invitation has been sent and will expire in {form.getValues('expiresInDays')} days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                An invitation email has been sent to <strong>{form.getValues('email')}</strong> with instructions to set up their account.
              </AlertDescription>
            </Alert>

            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">Invitation Details:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>Name:</strong> {form.getValues('firstName')} {form.getValues('lastName')}</div>
                <div><strong>Role:</strong> {form.getValues('role').replace('-', ' ').toUpperCase()}</div>
                <div><strong>Language:</strong> {form.getValues('language') === 'en' ? 'English' : 'العربية'}</div>
                <div><strong>Expires:</strong> In {form.getValues('expiresInDays')} days</div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Back to Users
              </Button>
              <Button onClick={handleSendAnother}>
                <Send className="mr-2 h-4 w-4" />
                Send Another Invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Invite New User</CardTitle>
              <CardDescription>
                Send an invitation email to invite someone to join the HR management system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter email address" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Role and Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Role and Settings</h3>
                </div>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
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
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                English
                              </div>
                            </SelectItem>
                            <SelectItem value="ar">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                العربية
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiresInDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invitation Expires In</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select expiry period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Optional Message */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Invitation Message (Optional)</h3>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add a personal message to the invitation email..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    The invitation will expire in {form.watch('expiresInDays')} days. The recipient will need to set up their password and complete their profile.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
