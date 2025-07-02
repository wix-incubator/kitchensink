# Selected Variant Service

## Overview

The `SelectedVariantService` is a comprehensive service for managing product variant selection in e-commerce applications. It handles variant choices, inventory tracking, pricing calculations, and integrates with cart functionality. The service provides reactive state management for all variant-related data including options, quantities, stock status, and pricing information.

This service is essential for product detail pages where users need to select product variants (size, color, etc.) and see real-time updates to pricing, availability, and media display.

## Exports

### SelectedVariantServiceAPI

```typescript
interface SelectedVariantServiceAPI {
  // Core variant selection state
  selectedQuantity: Signal<number>;
  selectedChoices: Signal<Record<string, string>>;
  selectedVariantId: ReadOnlySignal<string | null>;
  currentVariant: ReadOnlySignal<productsV3.Variant | null>;
  
  // Pricing signals
  currentPrice: ReadOnlySignal<string>;
  currentCompareAtPrice: ReadOnlySignal<string | null>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  
  // Inventory & availability
  isInStock: ReadOnlySignal<boolean>;
  isPreOrderEnabled: ReadOnlySignal<boolean>;
  quantityAvailable: Signal<number | null>;
  trackQuantity: Signal<boolean>;
  
  // Product data
  product: ReadOnlySignal<productsV3.V3Product | null>;
  productOptions: ReadOnlySignal<productsV3.ConnectedOption[]>;
  variants: Signal<productsV3.Variant[]>;
  options: Signal<Record<string, string[]>>;
  
  // UI state
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  ribbonLabel: Signal<string | null>;
  
  // Utility properties
  productId: Signal<string>;
  currency: ReadOnlySignal<string>;
  
  // Selection methods
  setSelectedChoices: (choices: Record<string, string>) => void;
  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  resetSelections: () => void;
  
  // Quantity methods
  setSelectedQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  
  // Cart integration
  addToCart: (quantity?: number, modifiers?: Record<string, any>) => Promise<void>;
  
  // Computed methods
  selectedVariant: () => productsV3.Variant | null;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;
  
  // Smart variant selection
  getAvailableChoicesForOption: (optionName: string) => string[];
  getChoiceInfo: (optionName: string, choiceValue: string) => 
    { isAvailable: boolean; isInStock: boolean };
  isChoiceAvailable: (optionName: string, choiceValue: string) => boolean;
  isChoiceInStock: (optionName: string, choiceValue: string) => boolean;
  hasAnySelections: () => boolean;
}
```

### SelectedVariantServiceDefinition

```typescript
const SelectedVariantServiceDefinition = defineService<SelectedVariantServiceAPI>("selectedVariant")
```

Service definition for dependency injection and service registration.

### SelectedVariantService

```typescript
const SelectedVariantService = implementService.withConfig<{}>()(
  SelectedVariantServiceDefinition,
  ({ getService }) => SelectedVariantServiceAPI
)
```

Service implementation that coordinates with product, cart, and media services.

## Usage Examples

### Smart Variant Selection

```typescript
import { SelectedVariantServiceDefinition } from './headless/store/services/selected-variant-service';

function SmartVariantSelector() {
  const variantService = useService(SelectedVariantServiceDefinition);
  const options = useSignal(variantService.options);

  return (
    <div className="smart-selector">
      {Object.entries(options).map(([optionName, choices]) => (
        <div key={optionName} className="option-group">
          <h4>{optionName}</h4>
          <div className="choices">
            {choices.map(choice => {
              const choiceInfo = variantService.getChoiceInfo(optionName, choice);
              return (
                <button
                  key={choice}
                  onClick={() => variantService.setOption(optionName, choice)}
                  className={`choice-btn ${!choiceInfo.isAvailable ? 'unavailable' : ''} ${!choiceInfo.isInStock ? 'out-of-stock' : ''}`}
                  disabled={!choiceInfo.isAvailable}
                >
                  {choice}
                  {!choiceInfo.isInStock && <span className="stock-indicator">Out of Stock</span>}
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

## Key Features

- **Reactive State Management**: All variant data is managed through reactive signals
- **Inventory Integration**: Real-time inventory tracking and stock validation
- **Smart Selection**: Prevents invalid variant combinations
- **Price Calculations**: Automatic price updates based on selected variant
- **Media Integration**: Automatically updates product media based on selections
- **Cart Integration**: Seamless add-to-cart functionality
- **Quantity Management**: Built-in quantity controls with validation
- **Pre-order Support**: Handles pre-order scenarios and availability
- **Stock Alerts**: Low stock warnings and availability checking
- **Error Handling**: Comprehensive error states and loading indicators

## Dependencies

- **@wix/services-definitions**: Service definition framework
- **@wix/stores**: Wix Stores SDK for product and inventory data
- **CurrentCartServiceDefinition**: For cart operations
- **ProductServiceDefinition**: For product data
- **MediaGalleryServiceDefinition**: For media management
- **SignalsServiceDefinition**: For reactive state management

The service provides a complete solution for product variant management with sophisticated state handling and integration capabilities.
