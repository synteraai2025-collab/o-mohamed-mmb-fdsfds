'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HotelHeroProps {
export function HotelHero({ className }: HotelHeroProps) {
  return (
    <section className={cn('relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden', className)}>
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
        <div className="absolute inset-0 bg-background/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
            Experience Luxury at{' '}
            <span className="text-primary">Grand Paradise</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2">
            Discover unparalleled comfort and exceptional service in the heart of the city. 
            Your perfect getaway awaits with world-class amenities and breathtaking views.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium w-full sm:w-auto"
            >
              Book Your Stay
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium w-full sm:w-auto"
            >
              View Rooms
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 max-w-2xl sm:max-w-3xl mx-auto">
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-primary">5-Star</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Luxury Rating</div>
            </div>
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Concierge Service</div>
            </div>
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-primary">∞</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Amenities</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements - Responsive positioning */}
      <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary/10 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-accent/10 rounded-full blur-2xl sm:blur-3xl" />
      
      {/* Additional decorative elements for larger screens */}
      <div className="hidden lg:block absolute top-1/2 left-20 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
      <div className="hidden xl:block absolute bottom-1/3 right-32 w-16 h-16 bg-accent/5 rounded-full blur-2xl" />
    </section>
  );
}
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

