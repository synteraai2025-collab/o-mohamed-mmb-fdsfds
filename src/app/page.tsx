import { HotelHero } from '@/components/HotelHero';
import { BookingForm } from '@/components/BookingForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HotelHero />
      
      {/* Booking Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Reserve Your Perfect Stay
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete the booking form below and our team will contact you shortly to confirm your reservation.
            </p>
          </div>
          
          <div className="flex justify-center">
            <BookingForm />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Grand Paradise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of luxury, comfort, and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Luxury Accommodations</h3>
              <p className="text-muted-foreground">
                Elegant rooms and suites with premium amenities and stunning views
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-accent rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">World-Class Dining</h3>
              <p className="text-muted-foreground">
                Award-winning restaurants featuring international cuisine and local specialties
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 bg-card rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Premium Services</h3>
              <p className="text-muted-foreground">
                24/7 concierge, spa services, fitness center, and personalized attention
              </p>
            </div>
          </div>
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
