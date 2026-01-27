import { Product } from '@/components/ProductCard';

export const smartWatchProducts: Product[] = [
  {
    id: 'watch-001',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    price: 399,
    originalPrice: 429,
    rating: 4.8,
    reviewCount: 2847,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop',
    imageAlt: 'Apple Watch Series 9 with silver aluminum case and white sport band',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'ECG', 'Blood Oxygen'],
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 'watch-002',
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    price: 329,
    rating: 4.6,
    reviewCount: 1923,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    imageAlt: 'Samsung Galaxy Watch 6 with black case and black band',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Body Composition'],
    inStock: true,
    isNew: false,
    isSale: false
  },
  {
    id: 'watch-003',
    name: 'Garmin Venu 3',
    brand: 'Garmin',
    price: 449,
    rating: 4.7,
    reviewCount: 856,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop',
    imageAlt: 'Garmin Venu 3 with stainless steel bezel and silicone band',
    category: 'Fitness Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Stress Tracking', 'Music Storage'],
    inStock: true,
    isNew: true,
    isSale: false
  },
  {
    id: 'watch-004',
    name: 'Fitbit Versa 4',
    brand: 'Fitbit',
    price: 199,
    originalPrice: 229,
    rating: 4.3,
    reviewCount: 3421,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop',
    imageAlt: 'Fitbit Versa 4 with rose gold case and pink band',
    category: 'Fitness Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Score', 'Active Zone Minutes'],
    inStock: true,
    isNew: false,
    isSale: true
  },
  {
    id: 'watch-005',
    name: 'Amazfit GTR 4',
    brand: 'Amazfit',
    price: 199,
    rating: 4.4,
    reviewCount: 1247,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
    imageAlt: 'Amazfit GTR 4 with black case and brown leather band',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Alexa Built-in', '14-day Battery'],
    inStock: true,
    isNew: false,
    isSale: false
  },
  {
    id: 'watch-006',
    name: 'Fossil Gen 6',
    brand: 'Fossil',
    price: 299,
    originalPrice: 349,
    rating: 4.2,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop',
    imageAlt: 'Fossil Gen 6 with silver case and stainless steel band',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Wear OS', 'Fast Charging'],
    inStock: false,
    isNew: false,
    isSale: true
  },
  {
    id: 'watch-007',
    name: 'TicWatch Pro 5',
    brand: 'Mobvoi',
    price: 349,
    rating: 4.5,
    reviewCount: 934,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop',
    imageAlt: 'TicWatch Pro 5 with black case and orange accents',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Wear OS', 'Dual Display'],
    inStock: true,
    isNew: true,
    isSale: false
  },
  {
    id: 'watch-008',
    name: 'Huawei Watch GT 4',
    brand: 'Huawei',
    price: 249,
    rating: 4.3,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop',
    imageAlt: 'Huawei Watch GT 4 with gold case and brown leather band',
    category: 'Smart Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'SpO2', '14-day Battery'],
    inStock: true,
    isNew: false,
    isSale: false
  },
  {
    id: 'watch-009',
    name: 'Withings ScanWatch 2',
    brand: 'Withings',
    price: 299,
    originalPrice: 349,
    rating: 4.1,
    reviewCount: 445,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    imageAlt: 'Withings ScanWatch 2 with white dial and black leather band',
    category: 'Hybrid Watch',
    features: ['Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'ECG', 'SpO2', 'Classic Design'],
    inStock: true,
    isNew: false,
    isSale: true
  },
  {
    id: 'watch-010',
    name: 'Polar Vantage V3',
    brand: 'Polar',
    price: 599,
    rating: 4.6,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
    imageAlt: 'Polar Vantage V3 with black case and red accents',
    category: 'Sports Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Running Power', 'Recovery Pro'],
    inStock: true,
    isNew: true,
    isSale: false
  },
  {
    id: 'watch-011',
    name: 'Suunto 9 Peak Pro',
    brand: 'Suunto',
    price: 399,
    rating: 4.4,
    reviewCount: 789,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop',
    imageAlt: 'Suunto 9 Peak Pro with titanium case and silicone band',
    category: 'Sports Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Barometer', '40h Battery'],
    inStock: true,
    isNew: false,
    isSale: false
  },
  {
    id: 'watch-012',
    name: 'Coros Apex 2',
    brand: 'Coros',
    price: 399,
    originalPrice: 449,
    rating: 4.5,
    reviewCount: 523,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop',
    imageAlt: 'Coros Apex 2 with black case and nylon band',
    category: 'Sports Watch',
    features: ['GPS', 'Heart Rate Monitor', 'Water Resistant', 'Sleep Tracking', 'Navigation', '30-day Battery'],
    inStock: true,
    isNew: false,
    isSale: true
  }
];

export const productCategories = [
  'All',
  'Smart Watch',
  'Fitness Watch',
  'Sports Watch',
  'Hybrid Watch'
];

export const productBrands = [
  'All',
  'Apple',
  'Samsung',
  'Garmin',
  'Fitbit',
  'Amazfit',
  'Fossil',
  'Mobvoi',
  'Huawei',
  'Withings',
  'Polar',
  'Suunto',
  'Coros'
];

export const priceRanges = [
  { label: 'All Prices', min: 0, max: 1000 },
  { label: 'Under $200', min: 0, max: 200 },
  { label: '$200 - $300', min: 200, max: 300 },
  { label: '$300 - $400', min: 300, max: 400 },
  { label: '$400 - $500', min: 400, max: 500 },
  { label: 'Over $500', min: 500, max: 1000 }
];

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return smartWatchProducts;
  return smartWatchProducts.filter(product => product.category === category);
}

export function getProductsByBrand(brand: string): Product[] {
  if (brand === 'All') return smartWatchProducts;
  return smartWatchProducts.filter(product => product.brand === brand);
}

export function getProductsByPriceRange(min: number, max: number): Product[] {
  return smartWatchProducts.filter(product => 
    product.price >= min && product.price <= max
  );
}

export function getFeaturedProducts(limit: number = 6): Product[] {
  return smartWatchProducts
    .filter(product => product.isNew || product.isSale)
    .slice(0, limit);
}

export function getNewProducts(limit: number = 6): Product[] {
  return smartWatchProducts
    .filter(product => product.isNew)
    .slice(0, limit);
}

export function getSaleProducts(limit: number = 6): Product[] {
  return smartWatchProducts
    .filter(product => product.isSale)
    .slice(0, limit);
}

export function getProductById(id: string): Product | undefined {
  return smartWatchProducts.find(product => product.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return smartWatchProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.features.some(feature => 
      feature.toLowerCase().includes(lowercaseQuery)
    )
  );
}
