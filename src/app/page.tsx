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
      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Why Choose Our Hotel
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We provide exceptional service and amenities to make your stay unforgettable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group text-center p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">🏨</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                Luxury Rooms
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Elegant accommodations with premium amenities and stunning views.
              </p>
            </div>
            
            <div className="group text-center p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">🍽️</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                Fine Dining
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                World-class restaurants with award-winning chefs and cuisine.
              </p>
            </div>
            
            <div className="group text-center p-6 sm:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">🏊</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                Premium Amenities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Spa, fitness center, pool, and concierge services available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              What Our Guests Say
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our satisfied guests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg sm:text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 italic leading-relaxed">
                "Absolutely incredible experience! The staff was so attentive and the room was beyond luxurious. Will definitely be back!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">Business Traveler</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg sm:text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 italic leading-relaxed">
                "The perfect romantic getaway! Amazing views, delicious food, and impeccable service. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sarah Miller</p>
                  <p className="text-sm text-muted-foreground">Couple</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg sm:text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 italic leading-relaxed">
                "Family vacation made perfect! Kids loved the pool and activities. Staff went above and beyond for us."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">JW</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Jennifer Wilson</p>
                  <p className="text-sm text-muted-foreground">Family</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/90 to-primary/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your stay today and discover why we're the preferred choice for discerning travelers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
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

