import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart } from 'lucide-react';
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
  imageAlt: string;
  category: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
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
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={cn("group relative overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            New
          </Badge>
        )}
        {product.isSale && discountPercentage > 0 && (
          <Badge variant="destructive" className="bg-accent text-accent-foreground">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleToggleWishlist}
      >
        <Heart 
          className={cn("h-4 w-4 transition-colors", {
            "fill-red-500 text-red-500": isInWishlist,
            "text-muted-foreground": !isInWishlist
          })} 
        />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
          <CardTitle className="text-lg font-semibold leading-tight">
            {product.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("h-3 w-3", {
                  "fill-yellow-400 text-yellow-400": i < Math.floor(product.rating),
                  "fill-yellow-200 text-yellow-200": i >= Math.floor(product.rating) && i < product.rating,
                  "text-muted-200": i >= product.rating
                })}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Features */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {product.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.features.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Badge variant={product.inStock ? "outline" : "secondary"} className={cn({
            "text-green-600 border-green-200": product.inStock,
            "text-red-600 border-red-200": !product.inStock
          })}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={!product.inStock || !onAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}
