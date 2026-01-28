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
  className?: string;
}

export function BookingForm({ className }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      guests: '2',
      roomType: 'deluxe',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Booking submitted:', data);
      alert('Booking request submitted successfully! We will contact you shortly.');
      form.reset();
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkInDate = form.watch('checkIn');
  const checkOutDate = form.watch('checkOut');

  return (
    <Card className={cn('w-full max-w-2xl mx-auto shadow-xl', className)}>
      <CardHeader className="text-center space-y-2 bg-primary/5 rounded-t-lg">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
          Book Your Stay
        </CardTitle>
        <CardDescription className="text-base sm:text-lg">
          Reserve your perfect room and enjoy exclusive rates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  {...form.register('firstName')}
                  placeholder="John"
                  className={form.formState.errors.firstName ? 'border-destructive' : ''}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...form.register('lastName')}
                  placeholder="Doe"
                  className={form.formState.errors.lastName ? 'border-destructive' : ''}
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="john.doe@example.com"
                  className={`pl-10 ${form.formState.errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  placeholder="+1 (555) 123-4567"
                  className={`pl-10 ${form.formState.errors.phone ? 'border-destructive' : ''}`}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
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
                        !checkInDate && 'text-muted-foreground',
                        form.formState.errors.checkIn && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={(date) => form.setValue('checkIn', date as Date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.checkIn && (
                  <p className="text-sm text-destructive">{form.formState.errors.checkIn.message}</p>
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
                        !checkOutDate && 'text-muted-foreground',
                        form.formState.errors.checkOut && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={(date) => form.setValue('checkOut', date as Date)}
                      disabled={(date) => date < (checkInDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.checkOut && (
                  <p className="text-sm text-destructive">{form.formState.errors.checkOut.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Guests *
                </Label>
                <Select onValueChange={(value) => form.setValue('guests', value)} defaultValue="2">
                  <SelectTrigger className={form.formState.errors.guests ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5+">5+ Guests</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.guests && (
                  <p className="text-sm text-destructive">{form.formState.errors.guests.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select onValueChange={(value) => form.setValue('roomType', value)} defaultValue="deluxe">
                  <SelectTrigger className={form.formState.errors.roomType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Room</SelectItem>
                    <SelectItem value="deluxe">Deluxe Room</SelectItem>
                    <SelectItem value="suite">Executive Suite</SelectItem>
                    <SelectItem value="presidential">Presidential Suite</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.roomType && (
                  <p className="text-sm text-destructive">{form.formState.errors.roomType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                Processing...
              </>
            ) : (
              'Complete Reservation'
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            By booking, you agree to our terms and conditions. Free cancellation up to 24 hours before check-in.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
