'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false,
  className 
}: ProductCardProps) {
  const {
    name,
    brand,
    price,
    originalPrice,
    rating,
    reviewCount,
    image,
    category,
    features,
    inStock,
    isNew,
    isSale
  } = product;

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <Card className={cn("group relative overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {isNew && (
          <Badge className="bg-accent text-accent-foreground text-xs">
            New
          </Badge>
        )}
        {isSale && discountPercentage > 0 && (
          <Badge className="bg-destructive text-destructive-foreground text-xs">
            -{discountPercentage}%
          </Badge>
        )}
        {!inStock && (
          <Badge variant="secondary" className="text-xs">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleToggleWishlist}
      >
        <Heart 
          className={cn("h-4 w-4 transition-colors", {
            "fill-current text-destructive": isInWishlist,
            "text-muted-foreground": !isInWishlist
          })} 
        />
      </Button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={`${brand} ${name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{brand}</p>
          <h3 className="font-semibold text-sm line-clamp-2">{name}</h3>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("h-3 w-3", {
                  "fill-current text-yellow-400": i < Math.floor(rating),
                  "text-muted-foreground": i >= Math.floor(rating)
                })}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        {/* Features */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs text-muted-foreground"
              >
                {feature}
                {index < Math.min(2, features.length - 1) && " •"}
              </span>
            ))}
            {features.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
}
