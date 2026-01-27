'use client';

import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

interface HotelHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
}

export function HotelHero({
  title = "Luxury Hotel Experience",
  subtitle = "Discover Unforgettable Moments",
  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[850px] overflow-hidden">
      {/* Background Image with enhanced overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title with enhanced typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
            <span className="block transform transition-all duration-700 hover:scale-105">
              {title}
            </span>
          </h1>
          
          {/* Subtitle with gradient effect */}
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-6 font-medium bg-gradient-to-r from-white to-white/80 bg-clip-text">
            {subtitle}
          </h2>
          
          {/* Description with improved readability */}
          <p className="text-base sm:text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/10 p-4 rounded-lg">
            {description}
          </p>
          
          {/* Features with enhanced styling */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 text-white/95">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-medium">Prime Location</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-medium">24/7 Service</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-medium">Easy Booking</span>
            </div>
          </div>
          
          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/50 text-white hover:bg-white/15 hover:text-white hover:border-white/70 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              View Rooms
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-1 sm:mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-6 font-medium">
            {subtitle}
          </h2>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Prime Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">24/7 Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Easy Booking</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/50 text-white hover:bg-white/10 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
            >
              View Rooms
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

