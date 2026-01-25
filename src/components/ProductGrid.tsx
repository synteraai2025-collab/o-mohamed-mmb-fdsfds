import { Product, ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: {
    x?: number;
    y?: number;
  };
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  showHeader?: boolean;
}

export function ProductGrid({ 
  products, 
  onAddToCart, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = { x: 4, y: 6 },
  className = '',
  loading = false,
  emptyMessage = 'No products found',
  title,
  showHeader = true
}: ProductGridProps) {
  
  const getGridClasses = () => {
    const classes = [];
    
    // Base grid
    classes.push('grid');
    
    // Column configuration
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    // Gap configuration
    const gapX = gap.x || 4;
    const gapY = gap.y || 6;
    classes.push(`gap-x-${gapX}`, `gap-y-${gapY}`);
    
    return classes.join(' ');
  };

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        {showHeader && title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <div className="h-1 w-20 bg-primary rounded-full mt-2"></div>
          </div>
        )}
        <div className={getGridClasses()}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg aspect-square mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        {showHeader && title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <div className="h-1 w-20 bg-primary rounded-full mt-2"></div>
          </div>
        )}
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">{emptyMessage}</div>
          <p className="text-sm text-muted-foreground/70">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {showHeader && title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="h-1 w-20 bg-primary rounded-full mt-2"></div>
        </div>
      )}
      
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      
      {showHeader && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

// Utility function for creating responsive grid configurations
export const createGridConfig = ({
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4
}: {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}) => ({
  sm,
  md,
  lg,
  xl
});

// Predefined grid configurations
export const GridLayouts = {
  COMPACT: createGridConfig({ sm: 2, md: 3, lg: 4, xl: 5 }),
  STANDARD: createGridConfig({ sm: 1, md: 2, lg: 3, xl: 4 }),
  LARGE: createGridConfig({ sm: 1, md: 2, lg: 2, xl: 3 }),
  SINGLE: createGridConfig({ sm: 1, md: 1, lg: 1, xl: 1 })
} as const;

// Utility function for creating gap configurations
export const createGapConfig = ({
  x = 4,
  y = 6
}: {
  x?: number;
  y?: number;
}) => ({
  x,
  y
});

// Predefined gap configurations
export const GapSizes = {
  TIGHT: createGapConfig({ x: 2, y: 4 }),
  NORMAL: createGapConfig({ x: 4, y: 6 }),
  LOOSE: createGapConfig({ x: 6, y: 8 }),
  EXTRA_LOOSE: createGapConfig({ x: 8, y: 10 })
} as const;
