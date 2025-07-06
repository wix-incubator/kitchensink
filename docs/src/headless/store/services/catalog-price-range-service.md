# Catalog Price Range Service

The `catalog-price-range-service` provides price range discovery and filtering capabilities, enabling users to understand the price distribution across products and filter by price ranges effectively.

## Overview

The Catalog Price Range Service handles:

- **Price Range Discovery** - Finds minimum and maximum prices across the catalog
- **Dynamic Price Filtering** - Provides price range data for filtering
- **Category-Specific Ranges** - Calculates price ranges for specific categories
- **Aggregation Queries** - Uses efficient aggregation to find price bounds
- **Error Handling** - Graceful handling of empty catalogs or invalid data

## API Interface

```tsx
interface CatalogPriceRangeServiceAPI {
  catalogPriceRange: Signal<CatalogPriceRange | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
}

interface CatalogPriceRange {
  minPrice: number;
  maxPrice: number;
}
```

## Core Functionality

### Getting Price Range

Access catalog price range data:

```tsx
import { useService } from "@wix/services-manager-react";
import { CatalogPriceRangeServiceDefinition } from "../services/catalog-price-range-service";

function PriceRangeComponent() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  if (isLoading) return <div>Loading price range...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!catalogPriceRange) return <div>No price data available</div>;
  
  return (
    <div>
      <h3>Price Range:</h3>
      <p>
        ${catalogPriceRange.minPrice} - ${catalogPriceRange.maxPrice}
      </p>
    </div>
  );
}
```

### Loading Price Range

```tsx
// Load price range for all products
await priceRangeService.loadCatalogPriceRange();

// Load price range for specific category
await priceRangeService.loadCatalogPriceRange("category-id");
```

## Usage Example

```tsx
function PriceRangeFilter() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const priceRange = priceRangeService.priceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  const [selectedMin, setSelectedMin] = useState(priceRange?.min || 0);
  const [selectedMax, setSelectedMax] = useState(priceRange?.max || 1000);
  
  useEffect(() => {
    if (priceRange) {
      setSelectedMin(priceRange.min);
      setSelectedMax(priceRange.max);
    }
  }, [priceRange]);
  
  if (isLoading) {
    return (
      <div className="price-range-loading">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="animate-pulse">
          <div className="h-2 bg-gray-300 rounded w-full mb-4"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-300 rounded flex-1"></div>
            <div className="h-8 bg-gray-300 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !priceRange) {
    return (
      <div className="price-range-error">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <p className="text-red-500 text-sm">{error || 'Unable to load price range'}</p>
      </div>
    );
  }
  
  const handleSliderChange = (values: number[]) => {
    setSelectedMin(values[0]);
    setSelectedMax(values[1]);
  };
  
  const handleApplyRange = () => {
    // Apply price range filter logic
    console.log('Apply price range:', { min: selectedMin, max: selectedMax });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="price-range-filter">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Price Range
      </h4>
      
      <div className="space-y-4">
        {/* Range Slider */}
        <div className="relative">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedMin}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), selectedMax - 1);
              setSelectedMin(value);
            }}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedMax}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), selectedMin + 1);
              setSelectedMax(value);
            }}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatPrice(priceRange.min)}</span>
            <span>{formatPrice(priceRange.max)}</span>
          </div>
        </div>
        
        {/* Input Fields */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              value={selectedMin}
              onChange={(e) => {
                const value = Math.max(priceRange.min, Number(e.target.value));
                setSelectedMin(Math.min(value, selectedMax - 1));
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min={priceRange.min}
              max={selectedMax - 1}
            />
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-400">-</span>
          </div>
          
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              value={selectedMax}
              onChange={(e) => {
                const value = Math.min(priceRange.max, Number(e.target.value));
                setSelectedMax(Math.max(value, selectedMin + 1));
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min={selectedMin + 1}
              max={priceRange.max}
            />
          </div>
        </div>
        
        {/* Selected Range Display */}
        <div className="text-center text-sm text-gray-600">
          {formatPrice(selectedMin)} - {formatPrice(selectedMax)}
        </div>
        
        {/* Apply Button */}
        <button
          onClick={handleApplyRange}
          className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Apply Price Filter
        </button>
      </div>
    </div>
  );
}
```

## Error Handling

```tsx
function PriceRangeWithErrorHandling() {
  const priceRangeService = useService(CatalogPriceRangeServiceDefinition);
  
  const catalogPriceRange = priceRangeService.catalogPriceRange.get();
  const isLoading = priceRangeService.isLoading.get();
  const error = priceRangeService.error.get();
  
  if (isLoading) {
    return <div>Loading price range...</div>;
  }
  
  if (error) {
    return (
      <div className="price-range-error">
        <div className="text-center py-4 border rounded-lg">
          <p className="text-red-500 text-sm mb-2">Failed to load price range</p>
          <p className="text-gray-500 text-xs mb-3">{error}</p>
          <button
            onClick={() => priceRangeService.loadCatalogPriceRange()}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!catalogPriceRange) {
    return (
      <div className="price-range-empty">
        <p className="text-gray-500 text-sm text-center py-4">
          No products with pricing information found
        </p>
      </div>
    );
  }
  
  return <PriceRangeSlider />;
}
```

## Server-Side Configuration

```tsx
// Server-side configuration
import { loadCatalogPriceRangeServiceConfig } from "../services/catalog-price-range-service";

export async function createPriceRangeConfig() {
  return await loadCatalogPriceRangeServiceConfig();
}
```

## Usage in Components

The Catalog Price Range Service is used throughout the application:

### In Filter Components
```tsx
// src/components/store/ProductFilters.tsx
const priceRangeService = useService(CatalogPriceRangeServiceDefinition);

// Used for price range filtering UI
const catalogPriceRange = priceRangeService.catalogPriceRange.get();
const isLoading = priceRangeService.isLoading.get();
```

### In Store Layout
```tsx
// src/layouts/StoreLayout.tsx
const priceRangeService = useService(CatalogPriceRangeServiceDefinition);

// Used for sidebar price filters
const catalogPriceRange = priceRangeService.catalogPriceRange.get();
```

## Integration with Other Services

### Filter Service Integration
- Provides price range boundaries for price filtering
- Coordinates with other filter options
- Maintains filter state consistency

### Collection Service Integration
- Price ranges are applied to product queries
- Dynamic updates based on filtered results
- Coordinated loading and error states

### Category Service Integration
- Loads category-specific price ranges
- Updates when category selection changes
- Maintains category context for price filtering

## Best Practices

### Data Loading
- Load price ranges based on current category context
- Cache price range data to reduce API calls
- Handle empty catalogs gracefully
- Provide meaningful error messages

### User Experience
- Show price ranges in intuitive formats
- Use visual indicators for price distribution
- Provide multiple input methods (sliders, inputs, buckets)
- Clear feedback on price filter applications

### Performance
- Use efficient aggregation queries
- Minimize API calls during price range loading
- Cache frequently accessed price ranges
- Implement proper loading states

### Accessibility
- Provide proper labels for price inputs
- Use semantic HTML for price controls
- Support keyboard navigation
- Ensure price ranges are clearly communicated 