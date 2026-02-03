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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  UserMinus, 
  Power, 
  Archive, 
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  UserCheck,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth';

interface DeactivateUserProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
}

interface DeactivationData {
  reason: string;
  deactivationType: 'temporary' | 'permanent';
  reactivationDate?: string;
  handoverNotes: string;
  transferResponsibilities: boolean;
  notifyUser: boolean;
  notifyAdmin: boolean;
  archiveData: boolean;
}

const deactivationReasons = [
  { value: 'resignation', label: 'Resignation', description: 'Employee has resigned from the company' },
  { value: 'termination', label: 'Termination', description: 'Employment has been terminated' },
  { value: 'retirement', label: 'Retirement', description: 'Employee has retired' },
  { value: 'end-of-contract', label: 'End of Contract', description: 'Contract period has ended' },
  { value: 'leave-of-absence', label: 'Leave of Absence', description: 'Extended leave or sabbatical' },
  { value: 'department-transfer', label: 'Department Transfer', description: 'Moving to different department/system' },
  { value: 'other', label: 'Other', description: 'Other reasons not listed above' },
];

export default function DeactivateUser({ 
  user, 
  isOpen, 
  onClose, 
  onSuccess, 
  className 
}: DeactivateUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [deactivationData, setDeactivationData] = useState<DeactivationData>({
    reason: '',
    deactivationType: 'permanent',
    reactivationDate: '',
    handoverNotes: '',
    transferResponsibilities: false,
    notifyUser: true,
    notifyAdmin: true,
    archiveData: true,
  });

  const handleDeactivate = async () => {
    if (!selectedReason) {
      setError('Please select a reason for deactivation');
      return;
    }

    if (!deactivationData.reason.trim()) {
      setError('Please provide additional details about the deactivation');
      return;
    }

    if (deactivationData.deactivationType === 'temporary' && !deactivationData.reactivationDate) {
      setError('Please select a reactivation date for temporary deactivation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${user.id}/deactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: deactivationData.reason,
          deactivationType: deactivationData.deactivationType,
          reactivationDate: deactivationData.reactivationDate,
          handoverNotes: deactivationData.handoverNotes,
          transferResponsibilities: deactivationData.transferResponsibilities,
          notifyUser: deactivationData.notifyUser,
          notifyAdmin: deactivationData.notifyAdmin,
          archiveData: deactivationData.archiveData,
          selectedReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to deactivate user');
      }

      toast.success('User deactivated successfully', {
        description: `${user.firstName} ${user.lastName} has been deactivated.`,
      });

      // Reset form
      setSelectedReason('');
      setDeactivationData({
        reason: '',
        deactivationType: 'permanent',
        reactivationDate: '',
        handoverNotes: '',
        transferResponsibilities: false,
        notifyUser: true,
        notifyAdmin: true,
        archiveData: true,
      });

      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to deactivate user', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedReason('');
    setDeactivationData({
      reason: '',
      deactivationType: 'permanent',
      reactivationDate: '',
      handoverNotes: '',
      transferResponsibilities: false,
      notifyUser: true,
      notifyAdmin: true,
      archiveData: true,
    });
    setError(null);
    onClose();
  };

  const getSelectedReasonLabel = () => {
    const reason = deactivationReasons.find(r => r.value === selectedReason);
    return reason?.label || 'Unknown';
  };

  const getReactivationDate = () => {
    if (deactivationData.deactivationType === 'temporary' && deactivationData.reactivationDate) {
      return new Date(deactivationData.reactivationDate);
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("max-w-3xl", className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <UserMinus className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Deactivate User Account</DialogTitle>
              <DialogDescription>
                Permanently or temporarily deactivate {user.firstName} {user.lastName}'s account
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
              Deactivating this user will permanently or temporarily disable their account. This action requires careful consideration and proper documentation.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Deactivation Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Deactivation</Label>
              <Select
                value={selectedReason}
                onValueChange={setSelectedReason}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason for deactivation" />
                </SelectTrigger>
                <SelectContent>
                  {deactivationReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{reason.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {reason.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deactivationType">Deactivation Type</Label>
              <Select
                value={deactivationData.deactivationType}
                onValueChange={(value) => 
                  setDeactivationData(prev => ({ 
                    ...prev, 
                    deactivationType: value as 'temporary' | 'permanent' 
                  }))
                }
              >
                <SelectTrigger id="deactivationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temporary">
                    <div className="flex flex-col">
                      <span className="font-medium">Temporary Deactivation</span>
                      <span className="text-xs text-muted-foreground">
                        User can be reactivated later
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="permanent">
                    <div className="flex flex-col">
                      <span className="font-medium">Permanent Deactivation</span>
                      <span className="text-xs text-muted-foreground">
                        Account will be permanently disabled
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {deactivationData.deactivationType === 'temporary' && (
              <div className="space-y-2">
                <Label htmlFor="reactivationDate">Reactivation Date</Label>
                <input
                  id="reactivationDate"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={deactivationData.reactivationDate}
                  onChange={(e) => 
                    setDeactivationData(prev => ({ 
                      ...prev, 
                      reactivationDate: e.target.value 
                    }))
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  The user will be automatically reactivated on this date
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                placeholder="Please provide additional details about the deactivation..."
                className="min-h-[100px]"
                value={deactivationData.reason}
                onChange={(e) => 
                  setDeactivationData(prev => ({ 
                    ...prev, 
                    reason: e.target.value 
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                This information will be recorded for audit purposes and may be used for reporting.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="handoverNotes">Handover Notes</Label>
              <Textarea
                id="handoverNotes"
                placeholder="Document any important information about the user's responsibilities, ongoing projects, or handover requirements..."
                className="min-h-[80px]"
                value={deactivationData.handoverNotes}
                onChange={(e) => 
                  setDeactivationData(prev => ({ 
                    ...prev, 
                    handoverNotes: e.target.value 
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Important for ensuring smooth transition of responsibilities.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Deactivation Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={deactivationData.transferResponsibilities}
                    onCheckedChange={(checked) => 
                      setDeactivationData(prev => ({ 
                        ...prev, 
                        transferResponsibilities: checked as boolean 
                      }))
                    }
                  />
                  <span className="text-sm">Transfer responsibilities to manager/team lead</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={deactivationData.archiveData}
                    onCheckedChange={(checked) => 
                      setDeactivationData(prev => ({ 
                        ...prev, 
                        archiveData: checked as boolean 
                      }))
                    }
                  />
                  <span className="text-sm">Archive user data and documents</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={deactivationData.notifyUser}
                    onCheckedChange={(checked) => 
                      setDeactivationData(prev => ({ 
                        ...prev, 
                        notifyUser: checked as boolean 
                      }))
                    }
                  />
                  <span className="text-sm">Notify user via email about deactivation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={deactivationData.notifyAdmin}
                    onCheckedChange={(checked) => 
                      setDeactivationData(prev => ({ 
                        ...prev, 
                        notifyAdmin: checked as boolean 
                      }))
                    }
                  />
                  <span className="text-sm">Notify administrators about this deactivation</span>
                </label>
              </div>
            </div>

            {/* Deactivation Preview */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Deactivation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="font-medium">{getSelectedReasonLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{deactivationData.deactivationType}</span>
                </div>
                {deactivationData.deactivationType === 'temporary' && getReactivationDate() && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reactivation:</span>
                    <span className="font-medium">
                      {getReactivationDate()?.toLocaleDateString()}
                    </span>
                  </div>
                )}
                {deactivationData.reason && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">Details:</span>
                    <p className="text-sm mt-1">{deactivationData.reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
            onClick={handleDeactivate}
            disabled={isLoading || !selectedReason || !deactivationData.reason.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deactivating...
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Deactivate User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
