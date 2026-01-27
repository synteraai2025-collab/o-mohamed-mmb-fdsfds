'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HotelHeroProps {
  className?: string;
}

export function HotelHero({ className }: HotelHeroProps) {
  return (
    <section className={cn('relative min-h-[600px] flex items-center justify-center overflow-hidden', className)}>
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
        <div className="absolute inset-0 bg-background/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Experience Luxury at{' '}
            <span className="text-primary">Grand Paradise</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover unparalleled comfort and exceptional service in the heart of the city. 
            Your perfect getaway awaits with world-class amenities and breathtaking views.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-medium"
            >
              Book Your Stay
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-base font-medium"
            >
              View Rooms
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">5-Star</div>
              <div className="text-sm text-muted-foreground">Luxury Rating</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Concierge Service</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Amenities</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
    </section>
  );
}
