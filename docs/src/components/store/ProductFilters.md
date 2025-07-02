# ProductFilters Component

## Overview

The `ProductFilters` component provides comprehensive filtering functionality for product listings. It includes price range filtering with dual sliders, product option filtering (including color swatches), and filter management controls. The component supports both mobile and desktop layouts with collapsible sections and integrates with Wix's filtering services.

## Exports

### ProductFilters (Default Export)

```typescript
interface ProductFiltersProps {
  onFiltersChange: (filters: {
    priceRange: { min: number; max: number };
    selectedOptions: { [optionId: string]: string[] };
  }) => void;
  className?: string;
  availableOptions: {
    productOptions: Array<{
      id: string;
      name: string;
      choices: Array<{ id: string; name: string; colorCode?: string }>;
      optionRenderType?: string;
    }>;
    priceRange: { min: number; max: number };
  };
  currentFilters: {
    priceRange: { min: number; max: number };
    selectedOptions: { [optionId: string]: string[] };
  };
  clearFilters: () => void;
  isFiltered: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps>
```

Main filtering component that renders price range slider and product option filters.

**Props:**
- `onFiltersChange`: Callback function when filters are updated
- `className`: Optional CSS classes for styling
- `availableOptions`: Available filtering options and price range
- `currentFilters`: Current filter selections
- `clearFilters`: Function to clear all filters
- `isFiltered`: Whether any filters are currently applied

## Usage Examples

### Mobile-Responsive Layout

```typescript
import ProductFilters from './components/store/ProductFilters';

function ResponsiveStorePage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary w-full"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar / Mobile overlay */}
        <div className={`
          lg:w-80 lg:block
          ${showFilters ? 'fixed inset-0 z-50 bg-white p-4' : 'hidden'}
        `}>
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            availableOptions={options}
            currentFilters={filters}
            clearFilters={clearAllFilters}
            isFiltered={hasActiveFilters}
            className="h-full overflow-y-auto"
          />
        </div>

        <main className="flex-1">
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}
```

## Key Features

- **Dual Range Slider**: Interactive price range selection with visual feedback
- **Color Swatches**: Visual color selection with hover tooltips
- **Checkbox Options**: Standard checkbox selection for text-based options
- **Mobile Responsive**: Collapsible interface for mobile devices
- **Real-time Updates**: Immediate filter application as user interacts
- **Clear Filters**: One-click option to reset all filters
- **Manual Price Input**: Number inputs for precise price range setting
- **Visual States**: Hover, focus, and selection states for all controls
- **Overflow Handling**: Scrollable areas for long option lists
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Filter Types Supported

### Price Range Filter
- Dual slider interface
- Manual number input
- Real-time visual feedback
- Validation to prevent invalid ranges

### Product Option Filters
- **SWATCH_CHOICES**: Color swatches with hover tooltips
- **Standard Options**: Checkbox lists with scrolling
- Multi-selection support
- Dynamic option availability

### Filter States
- Active/inactive visual states
- Loading states during filter application
- Empty state messaging
- Filter count indicators

## Dependencies

- **filter-service**: TypeScript types and interfaces for filtering
- **React hooks**: useState, useCallback, useEffect for state management
- **CSS custom properties**: Theme-aware styling system

The component provides a comprehensive filtering solution that adapts to different product types and user interface requirements.
