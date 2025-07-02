# Filter Service

## Overview

The FilterService is a comprehensive headless service that manages product filtering functionality in e-commerce applications. It handles price range filters, product option filters (like size, color, etc.), and integrates with catalog services to provide real-time filtering capabilities. The service manages filter state, URL synchronization, and coordinates with other services to provide a complete filtering experience.

This service uses Wix's signals system for reactive state management and automatically updates the URL to reflect current filter states. It subscribes to catalog price range and options services to provide accurate filtering options and maintains consistency between the UI and the underlying data.

## Exports

### `ProductOption`
**Type**: `interface`

Interface defining product option structure including option ID, name, available choices, and rendering preferences for UI components.

### `PriceRange`
**Type**: `interface`

Interface defining price range structure with minimum and maximum values for price filtering functionality.

### `AvailableOptions`
**Type**: `interface`

Interface defining the complete set of available filtering options including product options and price range information.

### `Filter`
**Type**: `interface`

Interface defining the current filter state including selected price range and chosen option values.

### `FilterServiceAPI`
**Type**: `interface`

Complete API interface for the filter service including signals for state management and methods for filter operations.

### `FilterServiceDefinition`
**Type**: `ServiceDefinition<FilterServiceAPI>`

Service definition that identifies and types the filter service within Wix's service manager system.

### `FilterService`
**Type**: `ServiceImplementation<FilterServiceAPI>`

Main service implementation providing all filtering functionality including state management, filter application, and URL synchronization.

### `defaultFilter`
**Type**: `Filter`

Default filter configuration with empty price range and no selected options.

## Usage Examples

### Basic Filter Service Integration
```tsx
import { useService } from '@wix/services-manager-react';
import { FilterServiceDefinition } from './headless/store/services/filter-service';

function FilterComponent() {
  const filterService = useService(FilterServiceDefinition);
  
  const currentFilters = filterService.currentFilters.use();
  const availableOptions = filterService.availableOptions.use();
  const isFullyLoaded = filterService.isFullyLoaded.use();
  
  if (!isFullyLoaded) {
    return <div>Loading filters...</div>;
  }
  
  return (
    <div className="filters">
      <PriceRangeFilter 
        priceRange={availableOptions.priceRange}
        selectedRange={currentFilters.priceRange}
        onChange={(range) => filterService.applyFilters({
          ...currentFilters,
          priceRange: range
        })}
      />
      
      {availableOptions.productOptions.map(option => (
        <OptionFilter
          key={option.id}
          option={option}
          selectedChoices={currentFilters.selectedOptions[option.id] || []}
          onChange={(choices) => filterService.applyFilters({
            ...currentFilters,
            selectedOptions: {
              ...currentFilters.selectedOptions,
              [option.id]: choices
            }
          })}
        />
      ))}
      
      <button onClick={() => filterService.clearFilters()}>
        Clear All Filters
      </button>
    </div>
  );
}
```

### Price Range Filter Component
```tsx
import { useState } from 'react';

function PriceRangeFilter({ priceRange, selectedRange, onChange }) {
  const [localMin, setLocalMin] = useState(selectedRange.min);
  const [localMax, setLocalMax] = useState(selectedRange.max);
  
  const handleApply = () => {
    onChange({ min: localMin, max: localMax });
  };
  
  return (
    <div className="price-filter">
      <h3>Price Range</h3>
      <div className="price-inputs">
        <label>
          Min: $
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            min={priceRange.min}
            max={priceRange.max}
          />
        </label>
        <label>
          Max: $
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            min={priceRange.min}
            max={priceRange.max}
          />
        </label>
      </div>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}
```

### Product Option Filter Component
```tsx
function OptionFilter({ option, selectedChoices, onChange }) {
  const handleChoiceToggle = (choiceId) => {
    const newChoices = selectedChoices.includes(choiceId)
      ? selectedChoices.filter(id => id !== choiceId)
      : [...selectedChoices, choiceId];
    onChange(newChoices);
  };
  
  if (option.optionRenderType === 'color') {
    return (
      <div className="color-filter">
        <h4>{option.name}</h4>
        <div className="color-choices">
          {option.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => handleChoiceToggle(choice.id)}
              className={`color-choice ${selectedChoices.includes(choice.id) ? 'selected' : ''}`}
              style={{ backgroundColor: choice.colorCode }}
              title={choice.name}
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="option-filter">
      <h4>{option.name}</h4>
      <div className="option-choices">
        {option.choices.map(choice => (
          <label key={choice.id} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedChoices.includes(choice.id)}
              onChange={() => handleChoiceToggle(choice.id)}
            />
            {choice.name}
          </label>
        ))}
      </div>
    </div>
  );
}
```

### Advanced Filter Panel
```tsx
function AdvancedFilterPanel() {
  const filterService = useService(FilterServiceDefinition);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentFilters = filterService.currentFilters.use();
  const availableOptions = filterService.availableOptions.use();
  
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    // Count price filter if not at defaults
    if (currentFilters.priceRange.min > availableOptions.priceRange.min ||
        currentFilters.priceRange.max < availableOptions.priceRange.max) {
      count++;
    }
    
    // Count option filters
    Object.values(currentFilters.selectedOptions).forEach(choices => {
      if (choices.length > 0) count++;
    });
    
    return count;
  }, [currentFilters, availableOptions]);
  
  return (
    <div className="filter-panel">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="filter-toggle"
      >
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-header">
            <h3>Filter Products</h3>
            {activeFilterCount > 0 && (
              <button 
                onClick={() => filterService.clearFilters()}
                className="clear-all"
              >
                Clear All
              </button>
            )}
          </div>
          
          <FilterComponent />
        </div>
      )}
    </div>
  );
}
```

### Filter Integration with Product List
```tsx
function ProductListWithFilters() {
  const filterService = useService(FilterServiceDefinition);
  const productService = useService(ProductListServiceDefinition);
  
  const currentFilters = filterService.currentFilters.use();
  const products = productService.products.use();
  
  useEffect(() => {
    // Load catalog options and price range when component mounts
    filterService.loadCatalogOptions();
    filterService.loadCatalogPriceRange();
  }, []);
  
  useEffect(() => {
    // Apply filters to product service when filters change
    productService.applyFilters(currentFilters);
  }, [currentFilters]);
  
  return (
    <div className="product-list-page">
      <aside className="filters-sidebar">
        <FilterComponent />
      </aside>
      
      <main className="products-main">
        <div className="products-header">
          <h2>Products ({products.length})</h2>
          <FilterSummary />
        </div>
        <ProductGrid products={products} />
      </main>
    </div>
  );
}
```

### Filter Summary Component
```tsx
function FilterSummary() {
  const filterService = useService(FilterServiceDefinition);
  const currentFilters = filterService.currentFilters.use();
  const availableOptions = filterService.availableOptions.use();
  
  const appliedFilters = useMemo(() => {
    const filters = [];
    
    // Add price filter
    const { min, max } = currentFilters.priceRange;
    const { min: availableMin, max: availableMax } = availableOptions.priceRange;
    
    if (min > availableMin || max < availableMax) {
      filters.push({
        type: 'price',
        label: `$${min} - $${max}`,
        clear: () => filterService.applyFilters({
          ...currentFilters,
          priceRange: { min: availableMin, max: availableMax }
        })
      });
    }
    
    // Add option filters
    Object.entries(currentFilters.selectedOptions).forEach(([optionId, choiceIds]) => {
      if (choiceIds.length > 0) {
        const option = availableOptions.productOptions.find(opt => opt.id === optionId);
        if (option) {
          const selectedChoices = option.choices.filter(choice => 
            choiceIds.includes(choice.id)
          );
          
          filters.push({
            type: 'option',
            label: `${option.name}: ${selectedChoices.map(c => c.name).join(', ')}`,
            clear: () => filterService.applyFilters({
              ...currentFilters,
              selectedOptions: {
                ...currentFilters.selectedOptions,
                [optionId]: []
              }
            })
          });
        }
      }
    });
    
    return filters;
  }, [currentFilters, availableOptions]);
  
  if (appliedFilters.length === 0) return null;
  
  return (
    <div className="filter-summary">
      <span>Filters:</span>
      {appliedFilters.map((filter, index) => (
        <div key={index} className="filter-tag">
          {filter.label}
          <button onClick={filter.clear} className="remove-filter">×</button>
        </div>
      ))}
    </div>
  );
}
```
