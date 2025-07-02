# Collection Headless Component

## Overview

The Collection headless component provides render-prop based components for managing and displaying product collections. It includes components for product grids, individual items, load more functionality, collection headers, and actions. The component integrates with the CollectionService to provide reactive product data with comprehensive error handling and loading states.

## Exports

### Grid

```typescript
interface GridProps {
  children: (props: GridRenderProps) => React.ReactNode;
}

interface GridRenderProps {
  products: productsV3.V3Product[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalProducts: number;
  hasProducts: boolean;
}

const Grid: React.FC<GridProps>
```

Headless component for product grid display with loading and error states.

**Render Props:**
- `products`: Array of product objects
- `isLoading`: Loading state indicator
- `error`: Error message if any
- `isEmpty`: Whether the collection is empty
- `totalProducts`: Total number of products
- `hasProducts`: Whether collection has any products

### Item

```typescript
interface ItemProps {
  product: productsV3.V3Product;
  children: (props: ItemRenderProps) => React.ReactNode;
}

interface ItemRenderProps {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  price: string;
  compareAtPrice: string | null;
  description: string;
  available: boolean;
  href: string;
}

const Item: React.FC<ItemProps>
```

Headless component for individual product item display.

**Props:**
- `product`: Product data object
- `children`: Render prop function

**Render Props:**
- `id`: Product ID
- `title`: Product name
- `slug`: URL-friendly product slug
- `image`: Main product image URL
- `price`: Formatted price string
- `compareAtPrice`: Original price for comparison
- `description`: Product description
- `available`: Availability status
- `href`: Product detail page URL

### LoadMore

```typescript
interface LoadMoreProps {
  children: (props: LoadMoreRenderProps) => React.ReactNode;
}

interface LoadMoreRenderProps {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
  hasProducts: boolean;
  totalProducts: number;
  hasMoreProducts: boolean;
}

const LoadMore: React.FC<LoadMoreProps>
```

Headless component for load more functionality.

**Render Props:**
- `loadMore`: Function to load additional products
- `refresh`: Function to refresh the collection
- `isLoading`: Loading state
- `hasProducts`: Whether products exist
- `totalProducts`: Current number of loaded products
- `hasMoreProducts`: Whether more products are available

### Header

```typescript
interface HeaderProps {
  children: (props: HeaderRenderProps) => React.ReactNode;
}

interface HeaderRenderProps {
  totalProducts: number;
  isLoading: boolean;
  hasProducts: boolean;
}

const Header: React.FC<HeaderProps>
```

Headless component for collection header with product count.

**Render Props:**
- `totalProducts`: Total number of products
- `isLoading`: Loading state
- `hasProducts`: Whether products exist

### Actions

```typescript
interface ActionsProps {
  children: (props: ActionsRenderProps) => React.ReactNode;
}

interface ActionsRenderProps {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const Actions: React.FC<ActionsProps>
```

Headless component for collection actions.

**Render Props:**
- `refresh`: Function to refresh collection
- `loadMore`: Function to load more products
- `isLoading`: Loading state
- `error`: Error message if any

## Usage Examples

### Basic Product Grid

```typescript
import { Collection } from './headless/store/components';

function ProductGrid() {
  return (
    <Collection.Grid>
      {({ products, isLoading, error, isEmpty }) => {
        if (isLoading) return <div>Loading products...</div>;
        if (error) return <div>Error: {error}</div>;
        if (isEmpty) return <div>No products found</div>;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Collection.Item key={product._id} product={product}>
                {({ title, image, price, compareAtPrice, href, available }) => (
                  <div className="product-card">
                    <a href={href}>
                      {image && <img src={image} alt={title} />}
                      <h3>{title}</h3>
                      <div className="price">
                        <span className="current-price">{price}</span>
                        {compareAtPrice && (
                          <span className="original-price">{compareAtPrice}</span>
                        )}
                      </div>
                      {!available && <span className="out-of-stock">Out of Stock</span>}
                    </a>
                  </div>
                )}
              </Collection.Item>
            ))}
          </div>
        );
      }}
    </Collection.Grid>
  );
}
```

### Collection with Header and Load More

```typescript
import { Collection } from './headless/store/components';

function ProductCollection() {
  return (
    <div className="product-collection">
      <Collection.Header>
        {({ totalProducts, isLoading, hasProducts }) => (
          <div className="collection-header">
            <h2>Our Products</h2>
            {hasProducts && !isLoading && (
              <p>{totalProducts} products available</p>
            )}
          </div>
        )}
      </Collection.Header>

      <Collection.Grid>
        {({ products, isLoading, error, isEmpty }) => (
          <div className="products-container">
            {isLoading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {isEmpty && <div className="empty">No products found</div>}
            
            <div className="product-grid">
              {products.map(product => (
                <Collection.Item key={product._id} product={product}>
                  {(itemProps) => <ProductCard {...itemProps} />}
                </Collection.Item>
              ))}
            </div>
          </div>
        )}
      </Collection.Grid>

      <Collection.LoadMore>
        {({ loadMore, hasMoreProducts, isLoading }) => (
          hasMoreProducts && (
            <div className="load-more-container">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="load-more-btn"
              >
                {isLoading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )
        )}
      </Collection.LoadMore>
    </div>
  );
}
```

### Product Card Component

```typescript
import { Collection } from './headless/store/components';

function ProductCard({ product }: { product: productsV3.V3Product }) {
  return (
    <Collection.Item product={product}>
      {({ 
        title, 
        image, 
        price, 
        compareAtPrice, 
        description, 
        available, 
        href 
      }) => (
        <div className={`product-card ${!available ? 'unavailable' : ''}`}>
          <a href={href} className="product-link">
            <div className="product-image">
              {image ? (
                <img src={image} alt={title} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              {!available && (
                <div className="availability-overlay">Out of Stock</div>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-title">{title}</h3>
              <p className="product-description">
                {description.substring(0, 100)}...
              </p>
              
              <div className="product-pricing">
                <span className="current-price">{price}</span>
                {compareAtPrice && (
                  <span className="compare-price">{compareAtPrice}</span>
                )}
              </div>
            </div>
          </a>
        </div>
      )}
    </Collection.Item>
  );
}
```

### Collection with Actions

```typescript
import { Collection } from './headless/store/components';

function CollectionWithActions() {
  return (
    <div className="collection-container">
      <Collection.Actions>
        {({ refresh, error, isLoading }) => (
          <div className="collection-actions">
            <button 
              onClick={refresh}
              disabled={isLoading}
              className="refresh-btn"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Products'}
            </button>
            {error && (
              <div className="error-message">
                Error: {error}
                <button onClick={refresh}>Try Again</button>
              </div>
            )}
          </div>
        )}
      </Collection.Actions>

      <Collection.Grid>
        {({ products, isLoading, isEmpty }) => (
          <div className="product-grid">
            {/* Product grid content */}
          </div>
        )}
      </Collection.Grid>
    </div>
  );
}
```

### Responsive Product List

```typescript
import { Collection } from './headless/store/components';

function ResponsiveProductList() {
  return (
    <div className="responsive-collection">
      <Collection.Header>
        {({ totalProducts, hasProducts }) => (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            {hasProducts && (
              <span className="text-gray-600">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>
        )}
      </Collection.Header>

      <Collection.Grid>
        {({ products, isLoading, error, isEmpty }) => {
          if (isLoading) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded"></div>
                    <div className="mt-2 bg-gray-200 h-4 rounded"></div>
                    <div className="mt-1 bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load products</p>
                <Collection.Actions>
                  {({ refresh }) => (
                    <button 
                      onClick={refresh}
                      className="mt-4 btn-primary"
                    >
                      Try Again
                    </button>
                  )}
                </Collection.Actions>
              </div>
            );
          }

          if (isEmpty) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Collection.Item key={product._id} product={product}>
                  {(itemProps) => <ProductCard {...itemProps} />}
                </Collection.Item>
              ))}
            </div>
          );
        }}
      </Collection.Grid>
    </div>
  );
}
```

## Key Features

- **Render Props Pattern**: Maximum flexibility for UI implementation
- **Error Handling**: Comprehensive error boundaries and fallback states
- **Loading States**: Built-in loading indicators and skeleton screens
- **Responsive Design**: Adapts to different screen sizes and layouts
- **Type Safety**: Full TypeScript support for all props and render props
- **Service Integration**: Seamless integration with CollectionService
- **Price Formatting**: Automatic price formatting with compare-at prices
- **Availability Checking**: Stock status and availability indicators
- **URL Generation**: Automatic product detail page URLs

## Dependencies

- **CollectionServiceDefinition**: Service for collection data management
- **@wix/stores**: Wix Stores SDK for product types
- **@wix/services-manager-react**: React integration for service management

The components provide a complete headless solution for product collection display with robust error handling and flexible rendering options.
