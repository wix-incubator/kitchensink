# Product List Component

## Overview

The ProductList component provides a comprehensive product catalog interface for e-commerce applications. It displays products in a responsive grid layout with advanced filtering capabilities, search functionality, and infinite scroll loading. The component integrates with Wix's headless store services to provide real-time product data, filtering, and pagination.

This component serves as the main product browsing interface and includes features like product cards with images, pricing, options display, filter sidebar, loading states, empty states, and load more functionality. It's designed to work seamlessly with the broader store ecosystem and provides a complete product discovery experience.

## Exports

### `ProductGridContent`
**Type**: `React.FC<{ productPageRoute: string }>`

Core component that renders the product grid with filtering sidebar. Handles product display, filter integration, loading states, and navigation setup using the FilteredCollection headless components.

### `LoadMoreSection`
**Type**: `React.FC`

Component that handles infinite scroll functionality and load more actions. Provides buttons for loading additional products and refreshing the current product set.

### `ProductList` (default export)
**Type**: `React.FC<{ productPageRoute: string }>`

Main component that combines the product grid and load more functionality into a complete product listing interface.

## Usage Examples

### Collection-Based Product Display
```tsx
import ProductList from './components/store/ProductList';

function CollectionPage({ collectionId, collectionName }) {
  return (
    <div className="collection-page">
      <div className="collection-hero mb-8">
        <h1 className="text-4xl font-bold">{collectionName}</h1>
        <p className="text-lg text-gray-600 mt-2">
          Curated selection from our {collectionName.toLowerCase()} collection
        </p>
      </div>
      
      <ProductList productPageRoute={`/collections/${collectionId}`} />
    </div>
  );
}
```
