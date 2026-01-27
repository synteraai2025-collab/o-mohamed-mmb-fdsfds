'use client';

import { useState } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { smartWatchProducts } from '@/data/products';
import { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Filter, Search } from 'lucide-react';

export default function Home() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartItemCount = cartItems.length;
  const wishlistItemCount = wishlistIds.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TechWatch Store
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Premium Smart Watches
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-4 w-4" />
                {wishlistItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {wishlistItemCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smart Watch
              </span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Premium collection of the latest smart watches from top brands. 
              Track your fitness, stay connected, and elevate your style.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                Browse Collection
              </Button>
              <Button variant="outline" size="lg">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tight">Featured Smart Watches</h3>
            <p className="mt-2 text-muted-foreground">
              Handpicked selection of the best smart watches available today
            </p>
          </div>
          
          <ProductGrid
            products={smartWatchProducts.slice(0, 6)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            showFilters={true}
            showSearch={true}
            showSort={true}
            showViewToggle={true}
            columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
            className="mb-12"
          />

          {/* Featured Categories */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Health Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Monitor your heart rate, sleep patterns, and daily activity
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">Easy Shopping</h4>
              <p className="text-sm text-muted-foreground">
                Secure checkout with multiple payment options and fast shipping
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Expert Support</h4>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations from our watch specialists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h5 className="font-semibold mb-4">TechWatch Store</h5>
              <p className="text-sm text-muted-foreground">
                Your trusted source for premium smart watches and wearable technology.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Smart Watches</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Fitness Trackers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sports Watches</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hybrid Watches</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Warranty</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">User Manuals</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TechWatch Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
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
