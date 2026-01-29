import { HeroSection } from '@/components/HeroSection';
import { BookingForm } from '@/components/BookingForm';

export default function Home() {
  const handleBookingSubmit = async (data: any) => {
    // Handle booking submission
    console.log('Booking data:', data);
    // In a real app, this would send data to your API
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Booking Section */}
      <section id="booking-section" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Booking Form */}
            <div className="lg:order-2">
              <BookingForm onSubmit={handleBookingSubmit} />
            </div>
            
            {/* Additional Information */}
            <div className="lg:order-1">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Why Choose Our Hotel
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Experience luxury and comfort like never before. Our hotel offers world-class amenities, 
                    exceptional service, and a prime location that makes your stay unforgettable.
                  </p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-2xl">🏨</div>
                    <h3 className="font-semibold text-card-foreground mb-1">Luxury Rooms</h3>
                    <p className="text-sm text-muted-foreground">Spacious, elegantly designed rooms with premium amenities</p>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-2xl">🍽️</div>
                    <h3 className="font-semibold text-card-foreground mb-1">Fine Dining</h3>
                    <p className="text-sm text-muted-foreground">Award-winning restaurants with world-class cuisine</p>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-2xl">🏊</div>
                    <h3 className="font-semibold text-card-foreground mb-1">Pool & Spa</h3>
                    <p className="text-sm text-muted-foreground">Relax in our infinity pool and rejuvenating spa</p>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 text-2xl">📍</div>
                    <h3 className="font-semibold text-card-foreground mb-1">Prime Location</h3>
                    <p className="text-sm text-muted-foreground">Located in the heart of the city with easy access</p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-accent/10 p-4">
                  <h3 className="font-semibold text-accent-foreground mb-2">Special Offers</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 15% discount on stays longer than 3 nights</li>
                    <li>• Complimentary breakfast included</li>
                    <li>• Free Wi-Fi throughout the property</li>
                    <li>• Late checkout available upon request</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Experience Luxury?</h3>
          <p className="text-muted-foreground mb-6">Book your stay today and create unforgettable memories</p>
          <button
            onClick={() => {
              const bookingSection = document.getElementById('booking-section');
              if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold transition-colors"
          >
            Book Now
          </button>
        </div>
      </footer>
    </main>
  );
}
