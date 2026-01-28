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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Welcome to Paradise
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience luxury and comfort at our premier hotel. Book your perfect stay with us and create unforgettable memories.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold"
            >
              View Rooms
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Luxury Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Room Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5-Star</div>
              <div className="text-white/80">Experience</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
