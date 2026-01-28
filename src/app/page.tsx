import { HotelHero } from '@/components/HotelHero';
import { BookingForm } from '@/components/BookingForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HotelHero />
      
      {/* Booking Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Reserve Your Perfect Stay
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below to book your room. Our team will contact you shortly to confirm your reservation.
              </p>
            </div>
            
            <BookingForm className="max-w-2xl mx-auto" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Hotel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of luxury, comfort, and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Luxury Amenities</h3>
              <p className="text-muted-foreground">
                Enjoy world-class facilities including spa, fitness center, and fine dining restaurants
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-accent rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Prime Location</h3>
              <p className="text-muted-foreground">
                Located in the heart of the city with easy access to major attractions and business districts
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Exceptional Service</h3>
              <p className="text-muted-foreground">
                Our dedicated staff is available 24/7 to ensure your stay is comfortable and memorable
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Paradise Hotel</h3>
            <p className="text-background/80 mb-6">
              Your perfect getaway destination
            </p>
            <div className="flex justify-center space-x-6 text-sm text-background/80">
              <span>📍 123 Luxury Avenue, City Center</span>
              <span>📞 +1 (555) 123-4567</span>
              <span>✉️ info@paradisehotel.com</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
