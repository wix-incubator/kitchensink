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

### Basic Product Listing
```tsx
import ProductList from './components/store/ProductList';

function ProductCatalogPage() {
  return (
    <div className="container mx-auto">
      <ProductList productPageRoute="/products" />
    </div>
  );
}
```

### Category-Specific Product List
```tsx
import ProductList from './components/store/ProductList';

function CategoryPage({ categorySlug }) {
  return (
    <div className="category-page">
      <header className="category-header">
        <h1>Category: {categorySlug}</h1>
      </header>
      <ProductList productPageRoute={`/products/category/${categorySlug}`} />
    </div>
  );
}
```

### With Custom Container and Layout
```tsx
import ProductList from './components/store/ProductList';

function CustomProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection</p>
        </div>
        
        <ProductList productPageRoute="/store/products" />
      </div>
    </div>
  );
}
```

### Integration with Store Layout
```tsx
import ProductList from './components/store/ProductList';
import { StoreLayout } from './layouts/StoreLayout';

function StorePage() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <div className="store-page">
        <ProductList productPageRoute="/store" />
      </div>
    </StoreLayout>
  );
}
```

### With Search Integration
```tsx
import ProductList from './components/store/ProductList';
import { useState } from 'react';

function SearchableProductPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="search-page">
      <div className="search-header mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>
      
      <ProductList productPageRoute="/products/search" />
    </div>
  );
}
```

### Mobile-Optimized Layout
```tsx
import ProductList from './components/store/ProductList';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveProductPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`product-page ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
      {!isMobile && (
        <div className="page-header">
          <h1>Product Catalog</h1>
          <p>Browse our complete selection</p>
        </div>
      )}
      
      <ProductList productPageRoute="/products" />
    </div>
  );
}
```

### With Analytics Tracking
```tsx
import ProductList from './components/store/ProductList';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedProductPage() {
  useEffect(() => {
    analytics.track('Product Catalog Viewed');
  }, []);
  
  return (
    <div className="tracked-catalog">
      <ProductList productPageRoute="/catalog" />
    </div>
  );
}
```

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

### Sale/Promotional Products
```tsx
import ProductList from './components/store/ProductList';

function SalePage() {
  return (
    <div className="sale-page">
      <div className="sale-banner bg-red-600 text-white p-6 mb-8">
        <h1 className="text-3xl font-bold">Flash Sale!</h1>
        <p className="text-lg">Limited time offers on selected products</p>
      </div>
      
      <ProductList productPageRoute="/sale" />
    </div>
  );
}
```

### With Breadcrumb Navigation
```tsx
import ProductList from './components/store/ProductList';

function ProductPageWithBreadcrumbs({ category, subcategory }) {
  return (
    <div className="product-page-with-nav">
      <nav className="breadcrumb mb-6">
        <a href="/">Home</a>
        <span> / </span>
        <a href="/products">Products</a>
        {category && (
          <>
            <span> / </span>
            <a href={`/products/${category}`}>{category}</a>
          </>
        )}
        {subcategory && (
          <>
            <span> / </span>
            <span>{subcategory}</span>
          </>
        )}
      </nav>
      
      <ProductList productPageRoute={`/products/${category}/${subcategory || ''}`} />
    </div>
  );
}
```

### Integration with Wishlist
```tsx
import ProductList from './components/store/ProductList';
import { WishlistProvider } from './providers/WishlistProvider';

function ProductPageWithWishlist() {
  return (
    <WishlistProvider>
      <div className="wishlist-enabled-catalog">
        <div className="page-header mb-8">
          <h1>All Products</h1>
          <a href="/wishlist" className="wishlist-link">
            View Wishlist
          </a>
        </div>
        
        <ProductList productPageRoute="/products" />
      </div>
    </WishlistProvider>
  );
}
```
