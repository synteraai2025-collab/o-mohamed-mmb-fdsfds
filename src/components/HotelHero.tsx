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
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            <span className="mr-2">✨</span>
            Luxury Experience Awaits
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Discover Your
            <span className="block text-primary">Perfect Getaway</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Experience unparalleled luxury and comfort at our world-class hotel. 
            Book your dream vacation with exclusive offers and personalized service.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View Rooms
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-2xl">🏨</div>
              <h3 className="text-white font-semibold">Luxury Rooms</h3>
              <p className="text-white/70 text-sm">Spacious suites with premium amenities</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🍽️</div>
              <h3 className="text-white font-semibold">Fine Dining</h3>
              <p className="text-white/70 text-sm">Award-winning restaurants on-site</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🏖️</div>
              <h3 className="text-white font-semibold">Prime Location</h3>
              <p className="text-white/70 text-sm">Beachfront with stunning views</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
