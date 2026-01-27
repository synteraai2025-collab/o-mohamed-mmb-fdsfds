import { HotelHero } from '@/components/HotelHero';
import { BookingForm } from '@/components/BookingForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HotelHero />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Make a Reservation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure your stay with our easy booking system. Get instant confirmation and exclusive rates.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 flex items-center justify-center px-6">
      <div className="text-center max-w-md w-full">
        {/* Logo with subtle elegance */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Logo container with refined shadow */}
            <div className="w-20 h-20 flex items-center justify-center mx-auto">
              <Image 
                src="/images/syntera-logo.svg" 
                alt="Syntera" 
                width={64}
                height={64}
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
        
        {/* Clean loading state */}
        <div className="space-y-8">
          {/* Main loading indicator */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <p className="text-xl text-slate-700 font-medium">
                AI agent is designing your website...
              </p>
            </div>

            {/* Refined spinner */}
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 border-4 border-solid border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
