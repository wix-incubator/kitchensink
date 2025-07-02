# StoreHeader Component

## Overview

The `StoreHeader` component provides a header section for store pages that contains filtering and sorting controls. It combines the category picker and sort dropdown in a styled container with a backdrop blur effect and proper spacing.

## Exports

### StoreHeader (Default Export)

```typescript
interface StoreHeaderProps {
  className?: string;
}

function StoreHeader({ className }: StoreHeaderProps): JSX.Element
```

A header component that renders category filtering and sorting controls in a styled container.

**Props:**
- `className`: Optional additional CSS classes to apply to the header container

## Usage Examples

### Responsive Store Header

```typescript
import StoreHeader from './components/store/StoreHeader';

function ResponsiveStorePage() {
  return (
    <div className="container mx-auto">
      <StoreHeader className="lg:mx-0 mx-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Products */}
      </div>
    </div>
  );
}
```

## Key Features

- **Integrated Controls**: Combines category filtering and sorting in one header
- **Styled Container**: Provides consistent styling with backdrop blur and border
- **Flexible Positioning**: Accepts custom className for positioning and additional styling
- **Responsive Design**: Layout adapts to different screen sizes through flexbox
- **Clean Interface**: Minimal design that doesn't compete with product content
- **Reusable Component**: Can be used across different store pages and layouts

## Dependencies

- **CategoryFilter**: Component for category selection
- **SortDropdown**: Component for sorting options

The component acts as a composition of these child components, providing a consistent header interface for store functionality.
