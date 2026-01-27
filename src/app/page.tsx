import { HotelHero } from '@/components/HotelHero';
import { BookingForm } from '@/components/BookingForm';

export default function Home() {
  const handleBookingSubmit = async (formData: any) => {
    // Handle booking submission
    console.log('Booking submitted:', formData);
    // In a real app, this would send data to your API
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HotelHero 
        title="Luxury Hotel Experience"
        subtitle="Discover Unforgettable Moments"
        description="Experience world-class hospitality in our premium hotel with stunning views, exceptional service, and modern amenities."
      />
      
      {/* Booking Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Reserve Your Stay
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to experience luxury? Fill out our simple booking form and we'll take care of the rest.
            </p>
          </div>
          
          <BookingForm onSubmit={handleBookingSubmit} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Hotel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide exceptional service and amenities to make your stay unforgettable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Luxury Rooms</h3>
              <p className="text-muted-foreground">Elegant accommodations with premium amenities and stunning views.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fine Dining</h3>
              <p className="text-muted-foreground">World-class restaurants with award-winning chefs and cuisine.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Amenities</h3>
              <p className="text-muted-foreground">Spa, fitness center, pool, and concierge services available.</p>
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
