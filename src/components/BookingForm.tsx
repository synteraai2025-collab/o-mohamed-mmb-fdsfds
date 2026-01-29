'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface BookingFormProps {
  className?: string;
  onSubmit?: (data: BookingFormData) => void;
}

export function BookingForm({ className, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }

      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (formData.guests > 10) {
      newErrors.guests = 'Maximum 10 guests allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
      // Reset form after successful submission
      setFormData({ checkIn: '', checkOut: '', guests: 2 });
      setErrors({});
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className={cn('w-full max-w-2xl mx-auto shadow-xl', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Book Your Stay</CardTitle>
        <p className="text-muted-foreground">Find your perfect room and dates</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-in Date */}
            <div className="space-y-2">
              <Label htmlFor="checkIn" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Check-in Date
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkIn}
                min={today}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                className={cn(
                  'h-12',
                  errors.checkIn && 'border-destructive focus:ring-destructive'
                )}
                required
              />
              {errors.checkIn && (
                <p className="text-sm text-destructive">{errors.checkIn}</p>
              )}
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label htmlFor="checkOut" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Check-out Date
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOut}
                min={formData.checkIn || today}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                className={cn(
                  'h-12',
                  errors.checkOut && 'border-destructive focus:ring-destructive'
                )}
                required
              />
              {errors.checkOut && (
                <p className="text-sm text-destructive">{errors.checkOut}</p>
              )}
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Number of Guests
            </Label>
            <select
              id="guests"
              value={formData.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              className={cn(
                'flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                errors.guests && 'border-destructive focus:ring-destructive'
              )}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
            {errors.guests && (
              <p className="text-sm text-destructive">{errors.guests}</p>
            )}
          </div>

          {/* Search Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Available Rooms
          </Button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Free Cancellation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>No Booking Fees</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
