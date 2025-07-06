# Product Modifiers Service

The `product-modifiers-service` provides comprehensive product modifier management for products with customizable options like text inputs, swatch choices, and other modifiers that affect pricing and availability.

## Overview

The Product Modifiers Service handles:

- **Modifier Management** - Manages all product modifiers and their values
- **Choice Selection** - Handles swatch choices and text choices
- **Free Text Input** - Manages free text modifiers
- **Validation** - Validates required modifiers and input constraints
- **State Management** - Maintains modifier selections and validation states

## API Interface

```tsx
interface ProductModifiersServiceAPI {
  modifiers: ReadOnlySignal<productsV3.ConnectedModifier[]>;
  selectedModifiers: Signal<Record<string, ModifierValue>>;
  hasModifiers: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  setModifierChoice: (modifierName: string, choiceValue: string) => void;
  setModifierFreeText: (modifierName: string, freeTextValue: string) => void;
  clearModifier: (modifierName: string) => void;
  clearAllModifiers: () => void;
  getModifierValue: (modifierName: string) => ModifierValue | null;
  isModifierRequired: (modifierName: string) => boolean;
  hasRequiredModifiers: () => boolean;
  areAllRequiredModifiersFilled: () => boolean;
}

interface ModifierValue {
  modifierName: string;
  choiceValue?: string; // For SWATCH_CHOICES and TEXT_CHOICES
  freeTextValue?: string; // For FREE_TEXT
}
```

## Modifier Types

The service supports different types of modifiers:

- **SWATCH_CHOICES** - Color/pattern swatches with visual choices
- **TEXT_CHOICES** - Text-based dropdown/radio choices
- **FREE_TEXT** - Custom text input fields

## Core Functionality

### Getting Modifier Data

Access modifier information:

```tsx
import { useService } from "@wix/services-manager-react";
import { ProductModifiersServiceDefinition } from "../services/product-modifiers-service";

function ModifierComponent() {
  const modifierService = useService(ProductModifiersServiceDefinition);
  
  const modifiers = modifierService.modifiers.get();
  const selectedModifiers = modifierService.selectedModifiers.get();
  const hasModifiers = modifierService.hasModifiers.get();
  
  if (!hasModifiers) {
    return null;
  }
  
  return (
    <div>
      <h3>Product Customization:</h3>
      {modifiers.map(modifier => (
        <div key={modifier.name}>
          <label>{modifier.name}</label>
          {modifier.mandatory && <span className="required">*</span>}
          {/* Render modifier based on type */}
        </div>
      ))}
    </div>
  );
}
```

### Setting Modifier Values

Update modifier selections:

```tsx
// Set choice-based modifier
modifierService.setModifierChoice("Color", "Red");

// Set free text modifier
modifierService.setModifierFreeText("Custom Text", "My custom message");

// Clear specific modifier
modifierService.clearModifier("Color");

// Clear all modifiers
modifierService.clearAllModifiers();
```

### Validation

Check modifier validation:

```tsx
// Check if modifier is required
const isRequired = modifierService.isModifierRequired("Color");

// Check if product has required modifiers
const hasRequired = modifierService.hasRequiredModifiers();

// Check if all required modifiers are filled
const allFilled = modifierService.areAllRequiredModifiersFilled();

// Get specific modifier value
const colorValue = modifierService.getModifierValue("Color");
```

## Usage Example

```tsx
function ProductModifierForm() {
  const modifierService = useService(ProductModifiersServiceDefinition);
  
  const modifiers = modifierService.modifiers.get();
  const selectedModifiers = modifierService.selectedModifiers.get();
  const hasModifiers = modifierService.hasModifiers.get();
  const hasRequiredModifiers = modifierService.hasRequiredModifiers();
  const allRequiredFilled = modifierService.areAllRequiredModifiersFilled();
  
  if (!hasModifiers) {
    return null;
  }
  
  const renderModifier = (modifier: any) => {
    const isRequired = modifierService.isModifierRequired(modifier.name);
    const selectedValue = selectedModifiers[modifier.name];
    
    if (modifier.modifierRenderType === "SWATCH_CHOICES") {
      return (
        <div className="color-swatch-selector">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {modifier.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <div className="flex flex-wrap gap-2">
            {modifier.choices?.map((choice: any) => (
              <button
                key={choice._id}
                onClick={() => modifierService.setModifierChoice(modifier.name, choice.value)}
                className={`
                  w-10 h-10 rounded-full border-2 transition-all
                  ${selectedValue?.choiceValue === choice.value
                    ? 'border-blue-500 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                style={{ backgroundColor: choice.color || '#f3f4f6' }}
                title={choice.description}
              >
                {selectedValue?.choiceValue === choice.value && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (modifier.modifierRenderType === "TEXT_CHOICES") {
      return (
        <div className="text-choice-dropdown">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {modifier.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <select
            value={selectedValue?.choiceValue || ''}
            onChange={(e) => {
              if (e.target.value) {
                modifierService.setModifierChoice(modifier.name, e.target.value);
              } else {
                modifierService.clearModifier(modifier.name);
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select {modifier.name}</option>
            {modifier.choices?.map((choice: any) => (
              <option key={choice._id} value={choice.value}>
                {choice.description}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (modifier.modifierRenderType === "FREE_TEXT") {
      return (
        <div className="free-text-input">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {modifier.name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <textarea
            value={selectedValue?.freeTextValue || ''}
            onChange={(e) => {
              if (e.target.value.trim()) {
                modifierService.setModifierFreeText(modifier.name, e.target.value);
              } else {
                modifierService.clearModifier(modifier.name);
              }
            }}
            placeholder={`Enter ${modifier.name.toLowerCase()}...`}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          
          {modifier.maxLength && (
            <p className="text-sm text-gray-500 mt-1">
              {(selectedValue?.freeTextValue || '').length}/{modifier.maxLength} characters
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="product-modifier-form">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Customize Your Product
      </h3>
      
      <div className="space-y-4">
        {modifiers.map(modifier => (
          <div key={modifier.name} className="modifier-field">
            {renderModifier(modifier)}
          </div>
        ))}
      </div>
      
      {hasRequiredModifiers && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            * Required fields
          </p>
          {!allRequiredFilled && (
            <p className="text-sm text-red-600 mt-1">
              Please fill all required customization options
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

## Usage in Components

The Product Modifiers Service is used throughout the application:

### In Product Modifier Components
```tsx
// src/headless/store/components/ProductModifiers.tsx
export const Options = (props: ProductModifiersOptionsProps) => {
  const service = useService(ProductModifiersServiceDefinition);
  
  const modifiers = service.modifiers.get();
  const selectedModifiers = service.selectedModifiers.get();
  
  return props.children({ modifiers, selectedModifiers, service });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const modifierService = useService(ProductModifiersServiceDefinition);

// Used for product customization options
const hasModifiers = modifierService.hasModifiers.get();
const allRequiredFilled = modifierService.areAllRequiredModifiersFilled();
```

## Integration with Other Services

### Product Service Integration
- Modifier data is extracted from the product service
- Changes to product trigger modifier updates
- Coordinated loading states

### Cart Service Integration
- Modifier selections are included in cart operations
- Modifier values affect cart item identity
- Pricing calculations include modifier costs

### Selected Variant Service Integration
- Modifiers work alongside variant selections
- Both contribute to final product configuration
- Coordinated validation and state management

## Best Practices

### State Management
- Always validate required modifiers before cart operations
- Clear modifiers when switching products
- Provide immediate feedback for validation errors
- Use optimistic updates for better UX

### User Experience
- Show clear labels for required modifiers
- Provide visual feedback for selections
- Use appropriate input types for different modifiers
- Show modifier summaries before purchase

### Validation
- Implement client-side validation for better UX
- Validate on both selection and submission
- Show specific error messages for each modifier
- Handle edge cases like empty text inputs

### Performance
- Cache modifier data when possible
- Minimize re-renders during selection
- Use debouncing for free text inputs
- Implement proper loading states 