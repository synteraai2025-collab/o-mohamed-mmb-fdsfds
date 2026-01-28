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
  phone: z.string().min(10, 'Please enter a valid phone number'),
  checkIn: z.date({
    required_error: 'Please select a check-in date',
  }),
  checkOut: z.date({
    required_error: 'Please select a check-out date',
  }),
  guests: z.string().min(1, 'Please select number of guests'),
  roomType: z.string().min(1, 'Please select a room type'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit?: (data: BookingFormData) => void | Promise<void>;
  className?: string;
}

export function BookingForm({ onSubmit, className }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      guests: '2',
      roomType: 'standard',
    },
  });

  const { handleSubmit, formState: { errors }, setValue, watch } = form;
  
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const handleFormSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      // Show success message or redirect
      console.log('Booking submitted:', data);
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (field: 'checkIn' | 'checkOut', date: Date | undefined) => {
    if (date) {
      setValue(field, date);
      // If check-in is after check-out, reset check-out
      if (field === 'checkIn' && checkOut && date > checkOut) {
        setValue('checkOut', undefined as any);
      }
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
          Book Your Stay
        </CardTitle>
        <CardDescription className="text-base md:text-lg">
          Reserve your perfect room and enjoy an unforgettable experience
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                {...form.register('firstName')}
                className={cn(errors.firstName && "border-destructive")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...form.register('lastName')}
                className={cn(errors.lastName && "border-destructive")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...form.register('email')}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...form.register('phone')}
              className={cn(errors.phone && "border-destructive")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground",
                      errors.checkIn && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => handleDateSelect('checkIn', date)}
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
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground",
                      errors.checkOut && "border-destructive"
                    )}
                    disabled={!checkIn}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => handleDateSelect('checkOut', date)}
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

          {/* Room and Guests Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Select
                value={watch('guests')}
                onValueChange={(value) => setValue('guests', value)}
              >
                <SelectTrigger className={cn(errors.guests && "border-destructive")}>
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
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
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={watch('roomType')}
                onValueChange={(value) => setValue('roomType', value)}
              >
                <SelectTrigger className={cn(errors.roomType && "border-destructive")}>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Room</SelectItem>
                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                  <SelectItem value="suite">Executive Suite</SelectItem>
                  <SelectItem value="presidential">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
              {errors.roomType && (
                <p className="text-sm text-destructive">{errors.roomType.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
