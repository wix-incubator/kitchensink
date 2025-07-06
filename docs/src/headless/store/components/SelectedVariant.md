# SelectedVariant Components

The `SelectedVariant` components provide access to information about the currently selected product variant, including pricing, SKU, and physical properties.

## Overview

The SelectedVariant module exports components for displaying selected variant information:

- **Details** - Physical details like SKU and weight
- **Price** - Current pricing information with compare prices
- **SKU** - Product SKU display

## Exports

### Details

A headless component that provides access to the selected variant's physical details.

**Signature:**
```tsx
interface ProductDetailsProps {
  children: (props: ProductDetailsRenderProps) => React.ReactNode;
}

interface ProductDetailsRenderProps {
  sku: string | null;
  weight: string | null;
}

export const Details: React.FC<ProductDetailsProps>
```

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.Details>
  {({ sku, weight }) => (
    <div className="variant-details">
      <h3 className="text-lg font-semibold mb-3">Product Details</h3>
      <dl className="space-y-2">
        {sku && (
          <div className="flex">
            <dt className="font-medium text-gray-700 w-20">SKU:</dt>
            <dd className="text-gray-900">{sku}</dd>
          </div>
        )}
        {weight && (
          <div className="flex">
            <dt className="font-medium text-gray-700 w-20">Weight:</dt>
            <dd className="text-gray-900">{weight} lbs</dd>
          </div>
        )}
      </dl>
    </div>
  )}
</SelectedVariant.Details>
```

### Price

A headless component that provides comprehensive pricing information for the selected variant.

**Signature:**
```tsx
interface PriceProps {
  children: (props: PriceRenderProps) => React.ReactNode;
}

interface PriceRenderProps {
  price: string;
  compareAtPrice: string | null;
  currency: string;
}

export const Price: React.FC<PriceProps>
```

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.Price>
  {({ price, compareAtPrice, currency }) => (
    <div className="pricing">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {price}
        </span>
        {compareAtPrice && (
          <span className="text-xl text-gray-500 line-through">
            {compareAtPrice}
          </span>
        )}
        {compareAtPrice && (
          <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Currency: {currency}
      </p>
    </div>
  )}
</SelectedVariant.Price>
```

### SKU

A headless component that provides access to the selected variant's SKU.

**Signature:**
```tsx
interface SKUProps {
  children: (props: SKURenderProps) => React.ReactNode;
}

interface SKURenderProps {
  sku: string | null;
}

export const SKU: React.FC<SKUProps>
```

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.SKU>
  {({ sku }) => (
    <div className="sku-display">
      {sku ? (
        <span className="text-sm text-gray-600">
          SKU: <span className="font-mono">{sku}</span>
        </span>
      ) : (
        <span className="text-sm text-gray-400">
          No SKU available
        </span>
      )}
    </div>
  )}
</SelectedVariant.SKU>
```

## Complete Examples

### Product Information Panel

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function ProductInfoPanel() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Product Information</h2>
      
      {/* Current Pricing */}
      <div className="mb-6">
        <SelectedVariant.Price>
          {({ price, compareAtPrice, currency }) => (
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {price}
                </span>
                {compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {compareAtPrice}
                    </span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                      On Sale
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                All prices in {currency}
              </p>
            </div>
          )}
        </SelectedVariant.Price>
      </div>
      
      {/* Product Details */}
      <div className="border-t pt-4">
        <SelectedVariant.Details>
          {({ sku, weight }) => (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Details</h3>
              <dl className="space-y-2">
                {sku && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-700">SKU</dt>
                    <dd className="text-sm text-gray-900 font-mono">{sku}</dd>
                  </div>
                )}
                {weight && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-700">Weight</dt>
                    <dd className="text-sm text-gray-900">{weight} lbs</dd>
                  </div>
                )}
                {!sku && !weight && (
                  <p className="text-sm text-gray-500 italic">
                    No additional details available
                  </p>
                )}
              </dl>
            </div>
          )}
        </SelectedVariant.Details>
      </div>
    </div>
  );
}
```

### Pricing Display with Savings

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function PricingDisplay() {
  return (
    <SelectedVariant.Price>
      {({ price, compareAtPrice, currency }) => {
        // Calculate savings if compare price exists
        const currentPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.replace(/[^0-9.]/g, '')) : null;
        const savings = originalPrice ? originalPrice - currentPrice : 0;
        const savingsPercent = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;
        
        return (
          <div className="pricing-display">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-blue-600">
                {price}
              </span>
              {compareAtPrice && (
                <div className="text-right">
                  <div className="text-lg text-gray-500 line-through">
                    {compareAtPrice}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Save {savingsPercent}%
                  </div>
                </div>
              )}
            </div>
            
            {compareAtPrice && (
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Limited Time Sale
                </span>
                <span className="text-sm text-gray-600">
                  You save ${savings.toFixed(2)}
                </span>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              * Price shown in {currency}
            </p>
          </div>
        );
      }}
    </SelectedVariant.Price>
  );
}
```

### Product Summary Card

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function ProductSummaryCard() {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <SelectedVariant.Price>
            {({ price, compareAtPrice }) => (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {price}
                </span>
                {compareAtPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {compareAtPrice}
                  </span>
                )}
              </div>
            )}
          </SelectedVariant.Price>
        </div>
        
        <SelectedVariant.SKU>
          {({ sku }) => (
            <div className="text-right">
              {sku && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {sku}
                </span>
              )}
            </div>
          )}
        </SelectedVariant.SKU>
      </div>
      
      <SelectedVariant.Details>
        {({ weight }) => (
          <div className="text-sm text-gray-600">
            {weight && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                <span>Weight: {weight} lbs</span>
              </div>
            )}
          </div>
        )}
      </SelectedVariant.Details>
    </div>
  );
}
```

### Mobile-Optimized Price Display

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function MobilePriceDisplay() {
  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <SelectedVariant.Price>
        {({ price, compareAtPrice }) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {price}
              </span>
              {compareAtPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {compareAtPrice}
                </span>
              )}
            </div>
            
            <SelectedVariant.SKU>
              {({ sku }) => (
                <div className="text-right">
                  {sku && (
                    <span className="text-xs text-gray-500">
                      SKU: {sku}
                    </span>
                  )}
                </div>
              )}
            </SelectedVariant.SKU>
          </div>
        )}
      </SelectedVariant.Price>
    </div>
  );
}
```

### Product Specification List

```tsx
import { SelectedVariant } from "../../headless/store/components";

export function ProductSpecifications() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Specifications</h3>
      
      <SelectedVariant.Details>
        {({ sku, weight }) => (
          <dl className="grid grid-cols-1 gap-3">
            {sku && (
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                <dt className="font-medium text-gray-700">Product Code</dt>
                <dd className="font-mono text-gray-900 text-sm mt-1 sm:mt-0">
                  {sku}
                </dd>
              </div>
            )}
            
            {weight && (
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                <dt className="font-medium text-gray-700">Shipping Weight</dt>
                <dd className="text-gray-900 mt-1 sm:mt-0">
                  {weight} pounds
                </dd>
              </div>
            )}
            
            <SelectedVariant.Price>
              {({ currency }) => (
                <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                  <dt className="font-medium text-gray-700">Currency</dt>
                  <dd className="text-gray-900 mt-1 sm:mt-0">
                    {currency}
                  </dd>
                </div>
              )}
            </SelectedVariant.Price>
          </dl>
        )}
      </SelectedVariant.Details>
    </div>
  );
}
```

## Usage Examples

The SelectedVariant components are used throughout product detail pages:

### In Product Detail Pages

```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { SelectedVariant } from "../../../../headless/store/components";

export const ProductDetailContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="product-images">
          {/* Product images */}
        </div>
        
        <div className="product-info">
          {/* Product name and description */}
          
          {/* Pricing Section */}
          <div className="mb-6">
            <SelectedVariant.Price>
              {({ price, compareAtPrice, currency }) => (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {price}
                  </span>
                  {compareAtPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {compareAtPrice}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        Sale
                      </span>
                    </>
                  )}
                </div>
              )}
            </SelectedVariant.Price>
          </div>
          
          {/* Variant selectors */}
          
          {/* Product details */}
          <div className="mt-8 pt-8 border-t">
            <SelectedVariant.Details>
              {({ sku, weight }) => (
                <div>
                  <h3 className="text-lg font-medium mb-3">Product Details</h3>
                  <div className="space-y-2">
                    {sku && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">SKU</span>
                        <span className="font-mono text-gray-900">{sku}</span>
                      </div>
                    )}
                    {weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight</span>
                        <span className="text-gray-900">{weight} lbs</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SelectedVariant.Details>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### In Product Action Buttons

```tsx
// src/components/store/ProductActionButtons.tsx
import { SelectedVariant } from "../../headless/store/components";

export const ProductActionButtons = () => {
  return (
    <div className="space-y-4">
      {/* Pricing display */}
      <SelectedVariant.Price>
        {({ price, compareAtPrice }) => (
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">
              {price}
            </span>
            {compareAtPrice && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                {compareAtPrice}
              </span>
            )}
          </div>
        )}
      </SelectedVariant.Price>
      
      {/* Add to cart button */}
      <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600">
        Add to Cart
      </button>
      
      {/* SKU reference */}
      <SelectedVariant.SKU>
        {({ sku }) => (
          <div className="text-center text-sm text-gray-600">
            {sku && <span>Item: {sku}</span>}
          </div>
        )}
      </SelectedVariant.SKU>
    </div>
  );
};
```

## Integration with Services

The SelectedVariant components integrate with multiple services:

### Selected Variant Service Integration
- Automatically tracks the currently selected product variant
- Provides reactive updates when variant selections change
- Handles pricing calculations and currency formatting

### Product Service Integration
- Integrates with base product data
- Provides fallback information when variant data isn't available
- Maintains consistency with overall product information

## Best Practices

### Pricing Display
- Always show current price prominently
- Use visual cues (strikethrough, badges) for sale prices
- Provide currency context for international customers

### Product Information
- Show SKU for customer service and inventory tracking
- Display weight for shipping calculations
- Handle missing data gracefully with fallbacks

### Responsive Design
- Adapt pricing display for mobile screens
- Use appropriate typography scales for different screen sizes
- Ensure touch targets are appropriately sized

### Accessibility
- Use semantic markup for pricing information
- Provide clear labels for product specifications
- Ensure sufficient color contrast for sale indicators 