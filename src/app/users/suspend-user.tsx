'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  UserX, 
  Clock, 
  Ban, 
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth';

interface SuspendUserProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
}

interface SuspensionData {
  reason: string;
  duration: '1-day' | '3-days' | '1-week' | '1-month' | 'indefinite' | 'custom';
  customEndDate?: string;
  notifyUser: boolean;
  notifyAdmin: boolean;
}

const suspensionDurations = [
  { value: '1-day', label: '1 Day', description: 'Temporary suspension for 24 hours' },
  { value: '3-days', label: '3 Days', description: 'Short-term suspension for 3 days' },
  { value: '1-week', label: '1 Week', description: 'Medium-term suspension for 1 week' },
  { value: '1-month', label: '1 Month', description: 'Long-term suspension for 1 month' },
  { value: 'indefinite', label: 'Indefinite', description: 'Suspension until manually reactivated' },
  { value: 'custom', label: 'Custom Date', description: 'Set a specific end date' },
];

export default function SuspendUser({ 
  user, 
  isOpen, 
  onClose, 
  onSuccess, 
  className 
}: SuspendUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suspensionData, setSuspensionData] = useState<SuspensionData>({
    reason: '',
    duration: '1-week',
    customEndDate: '',
    notifyUser: true,
    notifyAdmin: true,
  });

  const calculateSuspensionEndDate = (duration: string, customDate?: string): Date => {
    const now = new Date();
    
    switch (duration) {
      case '1-day':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '3-days':
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      case '1-week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '1-month':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'custom':
        return customDate ? new Date(customDate) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'indefinite':
      default:
        return new Date(9999, 11, 31); // Far future date for indefinite
    }
  };

  const handleSuspend = async () => {
    if (!suspensionData.reason.trim()) {
      setError('Please provide a reason for suspension');
      return;
    }

    if (suspensionData.duration === 'custom' && !suspensionData.customEndDate) {
      setError('Please select a custom end date');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const suspensionEndDate = calculateSuspensionEndDate(
        suspensionData.duration,
        suspensionData.customEndDate
      );

      const response = await fetch(`/api/users/${user.id}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: suspensionData.reason,
          suspensionEndDate: suspensionEndDate.toISOString(),
          duration: suspensionData.duration,
          notifyUser: suspensionData.notifyUser,
          notifyAdmin: suspensionData.notifyAdmin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to suspend user');
      }

      toast.success('User suspended successfully', {
        description: `${user.firstName} ${user.lastName} has been suspended.`,
      });

      // Reset form
      setSuspensionData({
        reason: '',
        duration: '1-week',
        customEndDate: '',
        notifyUser: true,
        notifyAdmin: true,
      });

      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to suspend user', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSuspensionData({
      reason: '',
      duration: '1-week',
      customEndDate: '',
      notifyUser: true,
      notifyAdmin: true,
    });
    setError(null);
    onClose();
  };

  const getDurationLabel = () => {
    const duration = suspensionDurations.find(d => d.value === suspensionData.duration);
    return duration?.label || 'Unknown';
  };

  const getSuspensionEndDate = () => {
    return calculateSuspensionEndDate(suspensionData.duration, suspensionData.customEndDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("max-w-2xl", className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <UserX className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <DialogTitle>Suspend User Account</DialogTitle>
              <DialogDescription>
                Temporarily suspend {user.firstName} {user.lastName}'s access to the system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Currently Active
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Role: <span className="font-medium">{user.role.replace('-', ' ').toUpperCase()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Warning Alert */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Suspending this user will immediately revoke their access to the system. They will not be able to log in until the suspension is lifted.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Suspension Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Suspension Duration</Label>
              <Select
                value={suspensionData.duration}
                onValueChange={(value) => 
                  setSuspensionData(prev => ({ 
                    ...prev, 
                    duration: value as SuspensionData['duration'] 
                  }))
                }
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suspensionDurations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{duration.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {duration.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {suspensionData.duration === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customEndDate">Custom End Date</Label>
                <input
                  id="customEndDate"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={suspensionData.customEndDate}
                  onChange={(e) => 
                    setSuspensionData(prev => ({ 
                      ...prev, 
                      customEndDate: e.target.value 
                    }))
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Suspension</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for suspending this user..."
                className="min-h-[100px]"
                value={suspensionData.reason}
                onChange={(e) => 
                  setSuspensionData(prev => ({ 
                    ...prev, 
                    reason: e.target.value 
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                This reason will be recorded for audit purposes and may be shared with the user.
              </p>
            </div>

            {/* Suspension Preview */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Suspension Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{getDurationLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">
                    {suspensionData.duration === 'indefinite' 
                      ? 'Indefinite' 
                      : getSuspensionEndDate().toLocaleDateString()
                    }
                  </span>
                </div>
                {suspensionData.reason && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">Reason:</span>
                    <p className="text-sm mt-1">{suspensionData.reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Options */}
            <div className="space-y-3">
              <Label>Notification Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={suspensionData.notifyUser}
                    onChange={(e) => 
                      setSuspensionData(prev => ({ 
                        ...prev, 
                        notifyUser: e.target.checked 
                      }))
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Notify user via email about suspension</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={suspensionData.notifyAdmin}
                    onChange={(e) => 
                      setSuspensionData(prev => ({ 
                        ...prev, 
                        notifyAdmin: e.target.checked 
                      }))
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Notify administrators about this suspension</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSuspend}
            disabled={isLoading || !suspensionData.reason.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Suspending...
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Suspend User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
