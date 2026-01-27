'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Mail, Phone, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().min(1, 'At least 1 guest is required').max(10, 'Maximum 10 guests allowed'),
  roomType: z.enum(['standard', 'deluxe', 'suite'], {
    errorMap: () => ({ message: 'Please select a room type' })
  }),
  specialRequests: z.string().optional()
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  className?: string;
  onSubmit?: (data: BookingFormData) => void | Promise<void>;
}

export function BookingForm({ className, onSubmit }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      roomType: 'standard',
      specialRequests: ''
    }
  });

  const watchCheckIn = watch('checkIn');
  const watchCheckOut = watch('checkOut');

  // Calculate minimum check-out date (day after check-in)
  const getMinCheckOutDate = () => {
    if (!watchCheckIn) return new Date().toISOString().split('T')[0];
    const checkInDate = new Date(watchCheckIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split('T')[0];
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (!watchCheckIn || !watchCheckOut) return 0;
    const checkIn = new Date(watchCheckIn);
    const checkOut = new Date(watchCheckOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const onFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default behavior - show success message
        console.log('Booking submitted:', data);
        alert('Booking request submitted successfully! We will contact you shortly.');
        reset();
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-all duration-300", className)}>
      <CardHeader className="text-center bg-primary/5 rounded-t-lg border-b border-primary/10">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Book Your Stay
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-muted-foreground">
          Reserve your perfect room and enjoy an unforgettable experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-3 pb-2 border-b border-border/50">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground/90">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                  className={cn(
                    "h-11 px-4 py-2 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    errors.firstName && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive font-medium">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground/90">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                  className={cn(
                    "h-11 px-4 py-2 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    errors.lastName && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive font-medium">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john.doe@example.com"
                  className={cn(
                    "h-11 px-4 py-2 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    errors.email && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                  className={cn(
                    "h-11 px-4 py-2 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    errors.phone && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive font-medium">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-3 pb-2 border-b border-border/50">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Booking Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3">
                <Label htmlFor="checkIn" className="text-sm font-medium text-foreground/90">
                  Check-in Date *
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  {...register('checkIn')}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn(
                    "h-11 px-4 py-2 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    errors.checkIn && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                />
                {errors.checkIn && (
                  <p className="text-sm text-destructive font-medium">{errors.checkIn.message}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="checkOut" className="text-sm font-medium text-foreground/90">
                  Check-out Date *
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  {...register('checkOut')}
                  min={getMinCheckOutDate()}
                  disabled={!watchCheckIn}
                  className={cn(
                    "h-11 px-4 py-2 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    !watchCheckIn && "bg-muted/50 cursor-not-allowed",
                    errors.checkOut && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                />
                {errors.checkOut && (
                  <p className="text-sm text-destructive font-medium">{errors.checkOut.message}</p>
                )}
              </div>
            </div>
            
            {nights > 0 && (
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {nights} night{nights !== 1 ? 's' : ''} stay
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3">
                <Label htmlFor="guests" className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Number of Guests *
                </Label>
                <select
                  id="guests"
                  {...register('guests', { valueAsNumber: true })}
                  className={cn(
                    "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    errors.guests && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} Guest{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.guests && (
                  <p className="text-sm text-destructive font-medium">{errors.guests.message}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="roomType" className="text-sm font-medium text-foreground/90">
                  Room Type *
                </Label>
                <select
                  id="roomType"
                  {...register('roomType')}
                  className={cn(
                    "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    errors.roomType && "border-destructive focus:ring-destructive/50 focus:border-destructive"
                  )}
                >
                  <option value="">Select room type</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="suite">Suite</option>
                </select>
                {errors.roomType && (
                  <p className="text-sm text-destructive font-medium">{errors.roomType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-3">
            <Label htmlFor="specialRequests" className="text-sm font-medium text-foreground/90">
              Special Requests (Optional)
            </Label>
            <textarea
              id="specialRequests"
              {...register('specialRequests')}
              placeholder="Any special requirements or requests..."
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing Booking...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Complete Booking
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
          Book Your Stay
        </CardTitle>
        <CardDescription className="text-base sm:text-lg">
          Reserve your perfect room and enjoy an unforgettable experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                  className={cn(errors.firstName && "border-destructive")}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                  className={cn(errors.lastName && "border-destructive")}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john.doe@example.com"
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                  className={cn(errors.phone && "border-destructive")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Booking Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date *</Label>
                <Input
                  id="checkIn"
                  type="date"
                  {...register('checkIn')}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn(errors.checkIn && "border-destructive")}
                />
                {errors.checkIn && (
                  <p className="text-sm text-destructive">{errors.checkIn.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date *</Label>
                <Input
                  id="checkOut"
                  type="date"
                  {...register('checkOut')}
                  min={getMinCheckOutDate()}
                  disabled={!watchCheckIn}
                  className={cn(errors.checkOut && "border-destructive")}
                />
                {errors.checkOut && (
                  <p className="text-sm text-destructive">{errors.checkOut.message}</p>
                )}
              </div>
            </div>
            
            {nights > 0 && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {nights} night{nights !== 1 ? 's' : ''} stay
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of Guests *
                </Label>
                <select
                  id="guests"
                  {...register('guests', { valueAsNumber: true })}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.guests && "border-destructive"
                  )}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} Guest{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.guests && (
                  <p className="text-sm text-destructive">{errors.guests.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <select
                  id="roomType"
                  {...register('roomType')}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.roomType && "border-destructive"
                  )}
                >
                  <option value="">Select room type</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="suite">Suite</option>
                </select>
                {errors.roomType && (
                  <p className="text-sm text-destructive">{errors.roomType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              {...register('specialRequests')}
              placeholder="Any special requirements or requests..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </div>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

