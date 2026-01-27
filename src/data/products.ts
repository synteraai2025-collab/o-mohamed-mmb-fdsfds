import { Product } from '@/components/ProductCard';

export const smartWatches: Product[] = [
  {
    id: 'watch-001',
    name: 'Apple Watch Series 9 GPS 41mm',
    brand: 'Apple',
    price: 399.99,
    originalPrice: 429.99,
    rating: 4.8,
    reviewCount: 2847,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Fitness Apps'],
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 'watch-002',
    name: 'Samsung Galaxy Watch6 Classic 47mm',
    brand: 'Samsung',
    price: 379.99,
    rating: 4.6,
    reviewCount: 1923,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Smart Watch',
    features: ['Rotating Bezel', 'Body Composition', 'Sleep Coaching', 'Water Resistant'],
    inStock: true,
    isNew: false,
    isSale: false
  },
  {
    id: 'watch-003',
    name: 'Garmin Venu 3S GPS Smartwatch',
    brand: 'Garmin',
    price: 449.99,
    originalPrice: 499.99,
    rating: 4.7,
    reviewCount: 856,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
    category: 'Fitness Watch',
    features: ['GPS', 'Heart Rate', 'Sleep Coach', 'Battery: 10 Days', 'Fitness Age'],
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 'watch-004',
    name: 'Fitbit Versa 4 Fitness Smartwatch',
    brand: 'Fitbit',
    price: 199.99,
    rating: 4.3,
    reviewCount: 3421,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    category: 'Fitness Watch',
    features: ['Daily Readiness', 'Built-in GPS', 'Sleep Profile', '24/7 Heart Rate'],
    inStock: true,
    isNew: false,
    isSale: false
  },
  {
    id: 'watch-005',
    name: 'Amazfit GTR 4 Smart Watch',
    brand: 'Amazfit',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.4,
    reviewCount: 1247,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
    category: 'Smart Watch',
    features: ['Dual-Band GPS', '14-Day Battery', '150+ Sports Modes', 'Alexa Built-in'],
    inStock: true,
    isNew: false,
    isSale: true
  },
  {
    id: 'watch-006',
    name: 'Fossil Gen 6 Wellness Edition',
    brand: 'Fossil',
    price: 299.99,
    rating: 4.2,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    category: 'Hybrid Watch',
    features: ['Wear OS', 'SpO2', 'Sleep Tracking', 'Fast Charging', 'Classic Design'],
    inStock: false,
    isNew: false,
    isSale: false
  }
];

// Export for use in components
export default smartWatches;
