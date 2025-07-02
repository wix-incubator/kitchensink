# SortDropdown Component

## Overview

The `SortDropdown` component provides sorting functionality for store product lists. It renders a styled dropdown select element that allows users to sort products by various criteria including name, price, and latest arrivals. The component integrates with Wix's Sort service to manage sorting state and updates.

## Exports

### SortDropdownContent

```typescript
interface SortDropdownContentProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  className?: string;
}

function SortDropdownContent({
  sortBy,
  setSortBy,
  className = "",
}: SortDropdownContentProps): JSX.Element
```

Presentational component that renders the actual dropdown with sort options.

**Props:**
- `sortBy`: Current sort option value
- `setSortBy`: Function to update the sort option
- `className`: Optional CSS classes for styling

### SortDropdown (Default Export)

```typescript
interface SortDropdownProps {
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps>
```

Context-aware wrapper that provides sort state management through Wix's Sort components.

**Props:**
- `className`: Optional CSS classes for styling

## Usage Examples

### Mobile-Responsive Layout

```typescript
import SortDropdown from './components/store/SortDropdown';

function ResponsiveProductPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Our Products</h1>
        <SortDropdown className="w-full md:w-auto" />
      </div>
      <div className="product-grid">
        {/* Products */}
      </div>
    </div>
  );
}
```

## Sort Options Available

The dropdown provides the following sorting options:

- **Latest Arrivals** (`""`) - Default option, shows newest products first
- **Name (A-Z)** (`"name-asc"`) - Alphabetical order by product name
- **Name (Z-A)** (`"name-desc"`) - Reverse alphabetical order
- **Price (Low to High)** (`"price-asc"`) - Ascending price order
- **Price (High to Low)** (`"price-desc"`) - Descending price order

## Key Features

- **Multiple Sort Options**: Supports sorting by name, price, and recency
- **Custom Styling**: Styled dropdown with custom arrow and focus states
- **Context Integration**: Seamlessly integrates with Wix's Sort context
- **Responsive Design**: Adapts to different screen sizes
- **Accessible**: Proper select semantics and keyboard navigation
- **Visual Feedback**: Focus ring and hover states for better UX
- **Theme Support**: Uses CSS custom properties for theming
- **Minimal Width**: Ensures consistent dropdown size across different content

## Dependencies

- **Sort components**: Headless sort components for state management
- **SortBy type**: TypeScript type definitions for sort options

The component provides a clean interface for product sorting that integrates with the broader store filtering system.
