'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HotelHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
  className?: string;
}

export function HotelHero({
  title = "Luxury Awaits You",
  subtitle = "Experience Unforgettable Moments",
  description = "Discover our collection of premium hotels and resorts, where every stay is crafted to create lasting memories. From breathtaking views to world-class amenities, your perfect getaway starts here.",
  ctaText = "Book Your Stay",
  onCtaClick,
  backgroundImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  className
}: HotelHeroProps) {
  return (
    <section className={cn("relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[850px] overflow-hidden", className)}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium mb-3 sm:mb-4 animate-fade-in-up">
              {subtitle}
            </p>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {title}
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              {description}
            </p>
            
            {/* CTA Button */}
            <div className="animate-fade-in-up animation-delay-600">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={onCtaClick}
              >
                {ctaText}
                <svg
                  className="ml-2 h-4 sm:h-5 w-4 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-1 sm:mt-2 animate-pulse" />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </section>
  );
}
