# ProductVariantSelector Components

The `ProductVariantSelector` components provide comprehensive product variant selection functionality, enabling customers to choose product options like size, color, and style, view pricing, check stock availability, and add items to their cart.

## Overview

The ProductVariantSelector module exports components that work together to provide complete product variant selection:

- **Options** - Container for all product options
- **Option** - Individual product option (e.g., Size, Color)
- **Choice** - Individual choice within an option (e.g., Small, Red)
- **Trigger** - Add to cart functionality with validation
- **Stock** - Stock status and availability information

## Exports

### Options

A headless component that provides access to all product options and current selections.

**Signature:**
```tsx
interface OptionsProps {
  children: (props: OptionsRenderProps) => React.ReactNode;
}

interface OptionsRenderProps {
  options: productsV3.ConnectedOption[];
  hasOptions: boolean;
  selectedChoices: Record<string, string>;
}

export const Options: React.FC<OptionsProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Options>
  {({ options, hasOptions, selectedChoices }) => (
    <div>
      {!hasOptions && <p>This product has no options</p>}
      
      {hasOptions && (
        <div className="product-options">
          <h3>Select Options</h3>
          <div className="space-y-4">
            {options.map(option => (
              <ProductVariantSelector.Option key={option.name} option={option}>
                {({ name, choices, selectedValue }) => (
                  <div className="option-group">
                    <label className="block text-sm font-medium mb-2">
                      {name}: {selectedValue || 'Please select'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {choices.map(choice => (
                        <ProductVariantSelector.Choice
                          key={choice.name}
                          option={option}
                          choice={choice}
                        >
                          {({ value, isSelected, isVisible, isInStock, onSelect }) => (
                            <button
                              onClick={onSelect}
                              disabled={!isVisible || !isInStock}
                              className={`px-3 py-1 border rounded ${
                                isSelected 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              } ${
                                !isVisible || !isInStock 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : ''
                              }`}
                            >
                              {value}
                            </button>
                          )}
                        </ProductVariantSelector.Choice>
                      ))}
                    </div>
                  </div>
                )}
              </ProductVariantSelector.Option>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</ProductVariantSelector.Options>
```

### Option

A headless component for individual product options (e.g., Size, Color).

**Signature:**
```tsx
interface OptionProps {
  option: productsV3.ConnectedOption;
  children: (props: OptionRenderProps) => React.ReactNode;
}

interface OptionRenderProps {
  name: string;
  type: any;
  choices: productsV3.ConnectedOptionChoice[];
  selectedValue: string | null;
  hasChoices: boolean;
}

export const Option: React.FC<OptionProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Option option={sizeOption}>
  {({ name, choices, selectedValue, hasChoices }) => (
    <div className="option-section">
      <h4 className="text-lg font-semibold mb-3">
        {name}
        {selectedValue && <span className="ml-2 text-blue-600">({selectedValue})</span>}
      </h4>
      
      {!hasChoices && <p className="text-gray-500">No choices available</p>}
      
      {hasChoices && (
        <div className="grid grid-cols-4 gap-2">
          {choices.map(choice => (
            <ProductVariantSelector.Choice
              key={choice.name}
              option={sizeOption}
              choice={choice}
            >
              {({ value, isSelected, isVisible, isInStock, onSelect }) => (
                <button
                  onClick={onSelect}
                  disabled={!isVisible}
                  className={`
                    p-2 border rounded text-center transition-colors
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'}
                    ${!isInStock 
                      ? 'bg-gray-100 text-gray-400 line-through' 
                      : ''}
                    ${!isVisible 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'cursor-pointer'}
                  `}
                >
                  {value}
                  {!isInStock && (
                    <span className="block text-xs text-red-500">Out of Stock</span>
                  )}
                </button>
              )}
            </ProductVariantSelector.Choice>
          ))}
        </div>
      )}
    </div>
  )}
</ProductVariantSelector.Option>
```

### Choice

A headless component for individual choices within an option.

**Signature:**
```tsx
interface ChoiceProps {
  option: productsV3.ConnectedOption;
  choice: productsV3.ConnectedOptionChoice;
  children: (props: ChoiceRenderProps) => React.ReactNode;
}

interface ChoiceRenderProps {
  value: string;
  description: string | undefined;
  isSelected: boolean;
  isVisible: boolean;
  isInStock: boolean;
  isPreOrderEnabled: boolean;
  onSelect: () => void;
  optionName: string;
  choiceValue: string;
}

export const Choice: React.FC<ChoiceProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Choice option={colorOption} choice={redChoice}>
  {({ 
    value, 
    isSelected, 
    isVisible, 
    isInStock, 
    isPreOrderEnabled, 
    onSelect,
    optionName,
    choiceValue
  }) => (
    <div className="choice-item">
      <button
        onClick={onSelect}
        disabled={!isVisible}
        className={`
          relative w-full p-3 border rounded-lg transition-all
          ${isSelected 
            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
            : 'border-gray-300 hover:border-gray-400'}
          ${!isVisible 
            ? 'opacity-30 cursor-not-allowed' 
            : 'cursor-pointer'}
        `}
        aria-label={`Select ${optionName}: ${choiceValue}`}
      >
        <span className="block font-medium">{value}</span>
        
        {/* Stock Status */}
        <span className={`block text-xs mt-1 ${
          isInStock ? 'text-green-600' : 
          isPreOrderEnabled ? 'text-orange-600' : 
          'text-red-600'
        }`}>
          {isInStock ? 'In Stock' : 
           isPreOrderEnabled ? 'Pre-Order' : 
           'Out of Stock'}
        </span>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
            </svg>
          </div>
        )}
      </button>
    </div>
  )}
</ProductVariantSelector.Choice>
```

### Trigger

A headless component for add to cart functionality with comprehensive validation.

**Signature:**
```tsx
interface TriggerProps {
  quantity?: number;
  children: (props: TriggerRenderProps) => React.ReactNode;
}

interface TriggerRenderProps {
  onAddToCart: () => Promise<void>;
  canAddToCart: boolean;
  isLoading: boolean;
  price: string;
  inStock: boolean;
  isPreOrderEnabled: boolean;
  error: string | null;
  availableQuantity: number | null;
}

export const Trigger: React.FC<TriggerProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Trigger quantity={2}>
  {({ 
    onAddToCart, 
    canAddToCart, 
    isLoading, 
    price, 
    inStock, 
    isPreOrderEnabled, 
    error, 
    availableQuantity 
  }) => (
    <div className="add-to-cart-section">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">{price}</span>
        {availableQuantity !== null && (
          <span className="text-sm text-gray-600">
            {availableQuantity} available
          </span>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={onAddToCart}
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
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding to Cart...
          </span>
        ) : inStock ? (
          'Add to Cart'
        ) : isPreOrderEnabled ? (
          'Pre-Order Now'
        ) : (
          'Out of Stock'
        )}
      </button>
      
      <div className="mt-2 text-xs text-gray-600">
        {inStock ? (
          '✓ In stock and ready to ship'
        ) : isPreOrderEnabled ? (
          '⏳ Available for pre-order'
        ) : (
          '❌ Currently out of stock'
        )}
      </div>
    </div>
  )}
</ProductVariantSelector.Trigger>
```

### Stock

A headless component for displaying stock status and availability information.

**Signature:**
```tsx
interface StockProps {
  children: (props: StockRenderProps) => React.ReactNode;
}

interface StockRenderProps {
  inStock: boolean;
  isPreOrderEnabled: boolean;
  status: string;
  trackInventory: boolean;
  currentVariantId: string | null;
  availableQuantity: number | null;
}

export const Stock: React.FC<StockProps>
```

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Stock>
  {({ 
    inStock, 
    isPreOrderEnabled, 
    status, 
    trackInventory, 
    currentVariantId, 
    availableQuantity 
  }) => (
    <div className="stock-info">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        inStock 
          ? 'bg-green-100 text-green-800' 
          : isPreOrderEnabled 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-red-100 text-red-800'
      }`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${
          inStock ? 'bg-green-500' : 
          isPreOrderEnabled ? 'bg-orange-500' : 
          'bg-red-500'
        }`}></span>
        {status}
      </div>
      
      {availableQuantity !== null && (
        <div className="mt-2 text-sm text-gray-600">
          {availableQuantity > 0 ? (
            <span>
              {availableQuantity} {availableQuantity === 1 ? 'item' : 'items'} available
            </span>
          ) : (
            <span>No items available</span>
          )}
        </div>
      )}
      
      {currentVariantId && (
        <div className="mt-1 text-xs text-gray-400">
          Variant: {currentVariantId}
        </div>
      )}
    </div>
  )}
</ProductVariantSelector.Stock>
```

## Complete Example

Here's a complete example showing how all ProductVariantSelector components work together:

```tsx
import { ProductVariantSelector } from "../../headless/store/components";

export function ProductVariantSelection() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Select Product Options</h2>
      
      {/* Product Options */}
      <ProductVariantSelector.Options>
        {({ options, hasOptions, selectedChoices }) => (
          <div className="space-y-6">
            {!hasOptions && (
              <p className="text-gray-500 text-center">
                This product has no customizable options
              </p>
            )}
            
            {hasOptions && (
              <div className="space-y-4">
                {options.map(option => (
                  <ProductVariantSelector.Option key={option.name} option={option}>
                    {({ name, choices, selectedValue, hasChoices }) => (
                      <div className="option-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {name}
                          {selectedValue && (
                            <span className="ml-2 text-blue-600 font-normal">
                              ({selectedValue})
                            </span>
                          )}
                        </label>
                        
                        {hasChoices && (
                          <div className="grid grid-cols-3 gap-2">
                            {choices.map(choice => (
                              <ProductVariantSelector.Choice
                                key={choice.name}
                                option={option}
                                choice={choice}
                              >
                                {({ 
                                  value, 
                                  isSelected, 
                                  isVisible, 
                                  isInStock, 
                                  isPreOrderEnabled, 
                                  onSelect 
                                }) => (
                                  <button
                                    onClick={onSelect}
                                    disabled={!isVisible}
                                    className={`
                                      p-2 border rounded text-center transition-all
                                      ${isSelected 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                                        : 'border-gray-300 hover:border-gray-400'}
                                      ${!isInStock && isVisible
                                        ? 'bg-gray-100 text-gray-400' 
                                        : ''}
                                      ${!isVisible 
                                        ? 'opacity-30 cursor-not-allowed' 
                                        : 'cursor-pointer'}
                                    `}
                                  >
                                    <span className="block font-medium">
                                      {value}
                                    </span>
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
                                )}
                              </ProductVariantSelector.Choice>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </ProductVariantSelector.Option>
                ))}
              </div>
            )}
          </div>
        )}
      </ProductVariantSelector.Options>
      
      {/* Stock Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <ProductVariantSelector.Stock>
          {({ inStock, isPreOrderEnabled, status, availableQuantity }) => (
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                inStock 
                  ? 'bg-green-100 text-green-800' 
                  : isPreOrderEnabled 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  inStock ? 'bg-green-500' : 
                  isPreOrderEnabled ? 'bg-orange-500' : 
                  'bg-red-500'
                }`}></span>
                {status}
              </div>
              
              {availableQuantity !== null && (
                <span className="text-sm text-gray-600">
                  {availableQuantity} available
                </span>
              )}
            </div>
          )}
        </ProductVariantSelector.Stock>
      </div>
      
      {/* Add to Cart */}
      <div className="mt-6">
        <ProductVariantSelector.Trigger quantity={1}>
          {({ 
            onAddToCart, 
            canAddToCart, 
            isLoading, 
            price, 
            inStock, 
            isPreOrderEnabled, 
            error 
          }) => (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {price}
                </span>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <button
                onClick={onAddToCart}
                disabled={!canAddToCart || isLoading}
                className={`
                  w-full py-3 px-6 rounded-lg font-medium transition-colors
                  ${canAddToCart && !isLoading
                    ? inStock 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart...
                  </span>
                ) : inStock ? (
                  'Add to Cart'
                ) : isPreOrderEnabled ? (
                  'Pre-Order Now'
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
          )}
        </ProductVariantSelector.Trigger>
      </div>
    </div>
  );
}
```

## Usage Examples

The ProductVariantSelector components are used extensively throughout the application:

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { ProductVariantSelector } from "../../../../headless/store/components";

export const ProductVariantSelectorContent = ({ product }) => {
  return (
    <div className="space-y-6">
      <ProductVariantSelector.Options>
        {({ options, hasOptions }) => (
          <div className="space-y-4">
            {hasOptions && options.map(option => (
              <ProductVariantSelector.Option key={option.name} option={option}>
                {({ name, choices, selectedValue }) => (
                  <VariantOptionGroup
                    name={name}
                    choices={choices}
                    selectedValue={selectedValue}
                    option={option}
                  />
                )}
              </ProductVariantSelector.Option>
            ))}
          </div>
        )}
      </ProductVariantSelector.Options>
      
      <ProductVariantSelector.Stock>
        {({ inStock, isPreOrderEnabled, status, availableQuantity }) => (
          <StockIndicator
            inStock={inStock}
            isPreOrderEnabled={isPreOrderEnabled}
            status={status}
            availableQuantity={availableQuantity}
          />
        )}
      </ProductVariantSelector.Stock>
      
      <ProductVariantSelector.Trigger>
        {({ onAddToCart, canAddToCart, isLoading, price, error }) => (
          <AddToCartButton
            onAddToCart={onAddToCart}
            canAddToCart={canAddToCart}
            isLoading={isLoading}
            price={price}
            error={error}
          />
        )}
      </ProductVariantSelector.Trigger>
    </div>
  );
};
```

### In Product Action Buttons
```tsx
// src/components/store/ProductActionButtons.tsx
import { ProductVariantSelector } from "../../headless/store/components";

export const ProductActionButtons = ({ product }) => {
  return (
    <div className="flex space-x-4">
      <ProductVariantSelector.Trigger>
        {({ onAddToCart, canAddToCart, isLoading, price }) => (
          <button
            onClick={onAddToCart}
            disabled={!canAddToCart || isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : `Add to Cart - ${price}`}
          </button>
        )}
      </ProductVariantSelector.Trigger>
      
      <ProductVariantSelector.Stock>
        {({ inStock, isPreOrderEnabled, status }) => (
          <span className={`px-3 py-2 rounded text-sm ${
            inStock ? 'bg-green-100 text-green-800' : 
            isPreOrderEnabled ? 'bg-orange-100 text-orange-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        )}
      </ProductVariantSelector.Stock>
    </div>
  );
};
```

## Integration with Services

The ProductVariantSelector components integrate with multiple services:

### Selected Variant Service Integration
- Manages product option selections and variant calculation
- Provides pricing, stock status, and availability information
- Handles add to cart operations with variant data

### Product Modifiers Service Integration
- Manages optional product modifiers (when available)
- Validates required modifier selections
- Includes modifier data in cart operations

### Service Coordination
- Automatic validation of required selections before add to cart
- Coordinated loading states across options and actions
- Unified error handling for variant selection and cart operations 