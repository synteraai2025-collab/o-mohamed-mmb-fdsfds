'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Users, Mail, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Form validation schema
const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  checkIn: z.date({
    required_error: 'Please select a check-in date',
  }),
  checkOut: z.date({
    required_error: 'Please select a check-out date',
  }),
  guests: z.number().min(1, 'At least 1 guest is required').max(10, 'Maximum 10 guests allowed'),
  roomType: z.string().min(1, 'Please select a room type'),
  specialRequests: z.string().optional(),
});

// Custom refinement to ensure check-out is after check-in
const refinedBookingSchema = bookingSchema.refine(
  (data) => {
    if (data.checkIn && data.checkOut) {
      return data.checkOut > data.checkIn;
    }
    return true;
  },
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
  }
);

type BookingFormData = z.infer<typeof refinedBookingSchema>;

interface BookingFormProps {
  className?: string;
  onSubmit?: (data: BookingFormData) => Promise<void>;
}

export function BookingForm({ className, onSubmit }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(refinedBookingSchema),
    defaultValues: {
      guests: 2,
      roomType: 'deluxe',
    },
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Booking submitted:', data);
      }
      
      setSubmitSuccess(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomTypes = [
    { value: 'standard', label: 'Standard Room', price: '$150/night' },
    { value: 'deluxe', label: 'Deluxe Room', price: '$250/night' },
    { value: 'suite', label: 'Executive Suite', price: '$450/night' },
    { value: 'presidential', label: 'Presidential Suite', price: '$850/night' },
  ];
  return (
    <Card className={cn('w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto shadow-lg', className)}>
      <CardHeader className="text-center space-y-1 sm:space-y-2 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
          Book Your Stay
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground">
          Fill in your details to reserve your perfect room
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-5 sm:w-5 h-5 text-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="firstName" className="text-sm sm:text-base">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                  className={cn(errors.firstName ? 'border-destructive' : '', 'text-sm sm:text-base')}
                />
                {errors.firstName && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                  className={cn(errors.lastName ? 'border-destructive' : '', 'text-sm sm:text-base')}
                />
                {errors.lastName && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john.doe@example.com"
              className={cn(errors.email ? 'border-destructive' : '', 'text-sm sm:text-base')}
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              className={cn(errors.phone ? 'border-destructive' : '', 'text-sm sm:text-base')}
            />
            {errors.phone && (
              <p className="text-xs sm:text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

          {/* Booking Details */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-4 h-5 sm:w-5 h-5 text-primary" />
              Booking Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-sm sm:text-base">Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal text-sm sm:text-base',
                        !checkIn && 'text-muted-foreground',
                        errors.checkIn && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => setValue('checkIn', date as Date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkIn && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.checkIn.message}</p>
                )}
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label className="text-sm sm:text-base">Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal text-sm sm:text-base',
                        !checkOut && 'text-muted-foreground',
                        errors.checkOut && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => setValue('checkOut', date as Date)}
                      disabled={(date) => date <= (checkIn || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkOut && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.checkOut.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2 text-sm sm:text-base">
                  <Users className="w-4 h-4" />
                  Number of Guests *
                </Label>
                <Select
                  value={watch('guests')?.toString()}
                  onValueChange={(value) => setValue('guests', parseInt(value))}
                >
                  <SelectTrigger className={cn(errors.guests ? 'border-destructive' : '', 'text-sm sm:text-base')}>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestOptions.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.guests && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.guests.message}</p>
                )}
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="roomType" className="text-sm sm:text-base">Room Type *</Label>
                <Select
                  value={watch('roomType')}
                  onValueChange={(value) => setValue('roomType', value)}
                >
                  <SelectTrigger className={cn(errors.roomType ? 'border-destructive' : '', 'text-sm sm:text-base')}>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((room) => (
                      <SelectItem key={room.value} value={room.value}>
                        <div className="flex justify-between w-full">
                          <span className="text-sm sm:text-base">{room.label}</span>
                          <span className="text-muted-foreground ml-2 text-sm sm:text-base">{room.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomType && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.roomType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="specialRequests" className="text-sm sm:text-base">Special Requests (Optional)</Label>
              <textarea
                id="specialRequests"
                {...register('specialRequests')}
                placeholder="Any special requirements or requests..."
                className="flex min-h-[60px] sm:min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {submitError && (
            <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-xs sm:text-sm text-destructive">{submitError}</p>
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs sm:text-sm text-green-800">Booking request submitted successfully! We'll contact you shortly to confirm your reservation.</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 sm:py-3 text-sm sm:text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current mr-2" />
                Processing Booking...
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
          Book Your Stay
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Fill in your details to reserve your perfect room
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                  className={errors.firstName ? 'border-destructive' : ''}
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
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.doe@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Booking Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !checkIn && 'text-muted-foreground',
                        errors.checkIn && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => setValue('checkIn', date as Date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkIn && (
                  <p className="text-sm text-destructive">{errors.checkIn.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !checkOut && 'text-muted-foreground',
                        errors.checkOut && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => setValue('checkOut', date as Date)}
                      disabled={(date) => date <= (checkIn || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkOut && (
                  <p className="text-sm text-destructive">{errors.checkOut.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Guests *
                </Label>
                <Select
                  value={watch('guests')?.toString()}
                  onValueChange={(value) => setValue('guests', parseInt(value))}
                >
                  <SelectTrigger className={errors.guests ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestOptions.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.guests && (
                  <p className="text-sm text-destructive">{errors.guests.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select
                  value={watch('roomType')}
                  onValueChange={(value) => setValue('roomType', value)}
                >
                  <SelectTrigger className={errors.roomType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((room) => (
                      <SelectItem key={room.value} value={room.value}>
                        <div className="flex justify-between w-full">
                          <span>{room.label}</span>
                          <span className="text-muted-foreground ml-2">{room.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomType && (
                  <p className="text-sm text-destructive">{errors.roomType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <textarea
                id="specialRequests"
                {...register('specialRequests')}
                placeholder="Any special requirements or requests..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {submitError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">Booking request submitted successfully! We'll contact you shortly to confirm your reservation.</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Processing Booking...
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

