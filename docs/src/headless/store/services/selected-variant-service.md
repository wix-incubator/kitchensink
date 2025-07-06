# Selected Variant Service

The `selected-variant-service` is a comprehensive service that manages product variant selection, pricing, inventory, and cart operations. It provides reactive state management for product options, handles variant calculations, and integrates with the cart system.

## Overview

The Selected Variant Service handles:

- **Variant Selection** - Managing product option choices and variant calculation
- **Pricing** - Current pricing, discounts, and price formatting
- **Inventory** - Stock status, quantities, and pre-order availability
- **Cart Operations** - Adding selected variants to cart with modifiers
- **Choice Validation** - Determining available and valid option combinations

## API Interface

```tsx
interface SelectedVariantServiceAPI {
  // Core Selection State
  selectedQuantity: Signal<number>;
  selectedChoices: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<productsV3.Variant | null>;
  
  // Pricing Signals
  currentPrice: ReadOnlySignal<string>;
  currentCompareAtPrice: ReadOnlySignal<string | null>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  
  // Inventory Signals
  isInStock: ReadOnlySignal<boolean>;
  isPreOrderEnabled: ReadOnlySignal<boolean>;
  quantityAvailable: Signal<number | null>;
  trackQuantity: Signal<boolean>;
  
  // Product Data
  product: ReadOnlySignal<productsV3.V3Product | null>;
  productOptions: ReadOnlySignal<productsV3.ConnectedOption[]>;
  variants: Signal<productsV3.Variant[]>;
  options: Signal<Record<string, string[]>>;
  
  // State Management
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  productId: Signal<string>;
  ribbonLabel: Signal<string | null>;
  currency: ReadOnlySignal<string>;
  
  // Methods
  selectedVariant: () => productsV3.Variant | null;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;
  setSelectedChoices: (choices: Record<string, string>) => void;
  addToCart: (quantity?: number, modifiers?: Record<string, any>) => Promise<void>;
  setOption: (group: string, value: string) => void;
  setSelectedQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  selectVariantById: (id: string) => void;
  resetSelections: () => void;
  
  // Choice Validation
  getAvailableChoicesForOption: (optionName: string) => string[];
  getChoiceInfo: (optionName: string, choiceValue: string) => {
    isAvailable: boolean;
    isInStock: boolean;
    isPreOrderEnabled: boolean;
  };
  isChoiceAvailable: (optionName: string, choiceValue: string) => boolean;
  isChoiceInStock: (optionName: string, choiceValue: string) => boolean;
  isChoicePreOrderEnabled: (optionName: string, choiceValue: string) => boolean;
  hasAnySelections: () => boolean;
}
```

## Core Functionality

### Variant Selection Management

The service tracks selected product options and automatically calculates the matching variant:

```tsx
// Example usage in a component
const variantService = useService(SelectedVariantServiceDefinition);

// Get current selections
const selectedChoices = variantService.selectedChoices.get();
const currentVariant = variantService.currentVariant.get();

// Update selections
variantService.setSelectedChoices({
  "Size": "Large",
  "Color": "Red"
});

// Set individual option
variantService.setOption("Size", "Medium");
```

### Price Calculation

The service provides reactive pricing information:

```tsx
// Get current pricing
const currentPrice = variantService.currentPrice.get(); // "$29.99"
const compareAtPrice = variantService.currentCompareAtPrice.get(); // "$39.99" or null
const isOnSale = variantService.isOnSale.get(); // true/false

// Get numeric price for calculations
const numericPrice = variantService.finalPrice(); // 29.99
```

### Inventory Management

Stock status and quantity tracking:

```tsx
// Check stock status
const inStock = variantService.isInStock.get();
const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
const availableQuantity = variantService.quantityAvailable.get();

// Check if stock is low
const isLowStock = variantService.isLowStock(5); // threshold of 5 items
```

### Choice Validation

Validate option combinations and availability:

```tsx
// Check if a choice is available
const isAvailable = variantService.isChoiceAvailable("Size", "Large");
const isInStock = variantService.isChoiceInStock("Color", "Red");

// Get all available choices for an option
const availableSizes = variantService.getAvailableChoicesForOption("Size");

// Get detailed choice information
const choiceInfo = variantService.getChoiceInfo("Size", "Large");
// Returns: { isAvailable: true, isInStock: true, isPreOrderEnabled: false }
```

### Cart Operations

Add selected variants to cart:

```tsx
// Add to cart with current selections
await variantService.addToCart(2); // quantity of 2

// Add to cart with modifiers
await variantService.addToCart(1, {
  "Custom Text": "Happy Birthday!",
  "Gift Wrap": true
});
```

## Usage Examples

### Basic Variant Selection

```tsx
import { useService } from "@wix/services-manager-react";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service";

function ProductVariantSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedChoices = variantService.selectedChoices.get();
  const productOptions = variantService.productOptions.get();
  const currentPrice = variantService.currentPrice.get();
  const inStock = variantService.isInStock.get();
  
  return (
    <div className="variant-selector">
      <div className="price text-2xl font-bold mb-4">
        {currentPrice}
      </div>
      
      {productOptions.map(option => (
        <div key={option.name} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {option.name}
          </label>
          <div className="flex gap-2">
            {option.choicesSettings?.choices?.map(choice => (
              <button
                key={choice.name}
                onClick={() => variantService.setOption(option.name!, choice.name!)}
                className={`px-3 py-1 border rounded ${
                  selectedChoices[option.name!] === choice.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                {choice.name}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-6">
        <span className={`px-2 py-1 rounded text-sm ${
          inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
}
```

### Smart Choice Validation

```tsx
function SmartVariantSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedChoices = variantService.selectedChoices.get();
  const productOptions = variantService.productOptions.get();
  
  return (
    <div className="smart-variant-selector">
      {productOptions.map(option => (
        <div key={option.name} className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {option.name}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {option.choicesSettings?.choices?.map(choice => {
              const isSelected = selectedChoices[option.name!] === choice.name;
              const isAvailable = variantService.isChoiceAvailable(option.name!, choice.name!);
              const isInStock = variantService.isChoiceInStock(option.name!, choice.name!);
              const isPreOrderEnabled = variantService.isChoicePreOrderEnabled(option.name!, choice.name!);
              
              return (
                <button
                  key={choice.name}
                  onClick={() => variantService.setOption(option.name!, choice.name!)}
                  disabled={!isAvailable}
                  className={`
                    p-2 border rounded text-center transition-colors
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'}
                    ${!isInStock 
                      ? 'bg-gray-100 text-gray-400' 
                      : ''}
                    ${!isAvailable 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'cursor-pointer'}
                  `}
                >
                  <span className="block font-medium">{choice.name}</span>
                  <span className={`block text-xs mt-1 ${
                    isInStock ? 'text-green-600' : 
                    isPreOrderEnabled ? 'text-orange-600' : 
                    'text-red-600'
                  }`}>
                    {isInStock ? 'In Stock' : 
                     isPreOrderEnabled ? 'Pre-Order' : 
                     'Out of Stock'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Add to Cart with Validation

```tsx
function AddToCartButton() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedQuantity = variantService.selectedQuantity.get();
  const currentPrice = variantService.currentPrice.get();
  const inStock = variantService.isInStock.get();
  const isPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const isLoading = variantService.isLoading.get();
  const error = variantService.error.get();
  
  const canAddToCart = inStock || isPreOrderEnabled;
  
  const handleAddToCart = async () => {
    try {
      await variantService.addToCart(selectedQuantity);
      // Handle success (e.g., show notification)
    } catch (error) {
      // Handle error
      console.error('Failed to add to cart:', error);
    }
  };
  
  return (
    <div className="add-to-cart-section">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border rounded">
          <button
            onClick={() => variantService.decrementQuantity()}
            className="px-3 py-1 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-1 border-l border-r">
            {selectedQuantity}
          </span>
          <button
            onClick={() => variantService.incrementQuantity()}
            className="px-3 py-1 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        <span className="text-lg font-bold">{currentPrice}</span>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart || isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-medium transition-colors
          ${canAddToCart && !isLoading
            ? inStock 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
        `}
      >
        {isLoading ? 'Adding...' : 
         inStock ? 'Add to Cart' : 
         isPreOrderEnabled ? 'Pre-Order' : 
         'Out of Stock'}
      </button>
    </div>
  );
}
```

### Quantity Management

```tsx
function QuantitySelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  
  const selectedQuantity = variantService.selectedQuantity.get();
  const availableQuantity = variantService.quantityAvailable.get();
  const trackQuantity = variantService.trackQuantity.get();
  
  const isLowStock = variantService.isLowStock(5);
  
  return (
    <div className="quantity-selector">
      <label className="block text-sm font-medium mb-2">
        Quantity
      </label>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => variantService.decrementQuantity()}
          disabled={selectedQuantity <= 1}
          className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        
        <input
          type="number"
          value={selectedQuantity}
          onChange={(e) => variantService.setSelectedQuantity(parseInt(e.target.value) || 1)}
          min="1"
          max={availableQuantity || undefined}
          className="w-16 px-2 py-1 border rounded text-center"
        />
        
        <button
          onClick={() => variantService.incrementQuantity()}
          disabled={trackQuantity && availableQuantity !== null && selectedQuantity >= availableQuantity}
          className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
      </div>
      
      {trackQuantity && availableQuantity !== null && (
        <p className="text-sm text-gray-600 mt-1">
          {availableQuantity} available
          {isLowStock && <span className="text-orange-600 ml-1">(Low Stock!)</span>}
        </p>
      )}
    </div>
  );
}
```

## Integration with Other Services

### Product Service Integration

The Selected Variant Service automatically integrates with the Product Service:

```tsx
// The service automatically loads product data
const product = variantService.product.get();
const productOptions = variantService.productOptions.get();
```

### Cart Service Integration

Cart operations are handled automatically:

```tsx
// Adding to cart integrates with the current cart
await variantService.addToCart(2);

// The cart service will be updated with the new item
```

### Media Gallery Integration

The service automatically updates the media gallery based on selected options:

```tsx
// When choices are selected, the media gallery updates
variantService.setSelectedChoices({
  "Color": "Red" // If red variant has specific images, they'll be shown
});
```

## Error Handling

The service provides comprehensive error handling:

```tsx
const error = variantService.error.get();

if (error) {
  // Handle various error types
  console.error('Variant service error:', error);
}

// Common error scenarios:
// - Invalid option combinations
// - Out of stock items
// - Cart operation failures
// - Network connectivity issues
```

## Best Practices

### State Management
- Always check loading states before showing UI
- Subscribe to relevant signals for reactive updates
- Handle error states gracefully

### Validation
- Use choice validation methods to show only available options
- Provide clear feedback for out-of-stock items
- Validate selections before allowing cart operations

### Performance
- The service is optimized for reactive updates
- Avoid unnecessary re-renders by using specific signals
- Cache expensive operations when possible

### User Experience
- Show loading states during operations
- Provide clear feedback for successful actions
- Handle edge cases (no variants, out of stock, etc.)

## Usage in Components

The Selected Variant Service is used extensively throughout the application:

### In ProductVariantSelector Components
```tsx
// src/headless/store/components/ProductVariantSelector.tsx
export const Options = (props: OptionsProps) => {
  const variantService = useService(SelectedVariantServiceDefinition);
  const selectedChoices = variantService.selectedChoices.get();
  const options = variantService.productOptions.get();
  
  return props.children({
    options,
    hasOptions: options.length > 0,
    selectedChoices,
  });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const variantService = useService(SelectedVariantServiceDefinition);

// Used for variant selection, pricing, and cart operations
```

### In Product Action Buttons
```tsx
// src/components/store/ProductActionButtons.tsx
const variantService = useService(SelectedVariantServiceDefinition);

// Used for add to cart functionality with variant data
``` 