# Collection Components

The `Collection` components provide headless functionality for displaying product collections. These components handle product grids, individual product items, collection headers, and pagination/loading actions.

## Overview

The Collection module exports several headless components that work together to create product collection interfaces:

- **Grid** - Main product grid with loading states
- **Item** - Individual product item display
- **Header** - Collection header with statistics
- **LoadMore** - Load more products functionality
- **Actions** - Collection actions (refresh, load more)

## Exports

### Grid

A headless component for displaying product grid collections.

**Signature:**
```tsx
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

export const Grid: React.FC<GridProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Grid>
  {({ products, isLoading, error, isEmpty, totalProducts, hasProducts }) => (
    <div>
      {isLoading && <div>Loading products...</div>}
      {error && <div className="error">Error: {error}</div>}
      {isEmpty && <div>No products found</div>}
      {hasProducts && (
        <div>
          <p>Showing {products.length} of {totalProducts} products</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(product => (
              <Collection.Item key={product._id} product={product}>
                {({ title, image, price, href }) => (
                  <a href={href}>
                    <img src={image} alt={title} />
                    <h3>{title}</h3>
                    <p>{price}</p>
                  </a>
                )}
              </Collection.Item>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</Collection.Grid>
```

### Item

A headless component for individual product items within a collection.

**Signature:**
```tsx
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

export const Item: React.FC<ItemProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Item product={product}>
  {({ 
    id, 
    title, 
    slug, 
    image, 
    price, 
    compareAtPrice, 
    description, 
    available, 
    href 
  }) => (
    <div className="product-card">
      <a href={href}>
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="mt-2">
            <span className={`text-lg font-bold ${available ? 'text-green-600' : 'text-red-600'}`}>
              {price}
            </span>
            {compareAtPrice && (
              <span className="text-gray-500 line-through ml-2">
                {compareAtPrice}
              </span>
            )}
          </div>
          <p className="text-sm mt-1">
            {available ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </a>
    </div>
  )}
</Collection.Item>
```

### Header

A headless component for collection header with product count and statistics.

**Signature:**
```tsx
interface HeaderProps {
  children: (props: HeaderRenderProps) => React.ReactNode;
}

interface HeaderRenderProps {
  totalProducts: number;
  isLoading: boolean;
  hasProducts: boolean;
}

export const Header: React.FC<HeaderProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Header>
  {({ totalProducts, isLoading, hasProducts }) => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        Products
        {!isLoading && hasProducts && (
          <span className="text-gray-500 ml-2">
            ({totalProducts} items)
          </span>
        )}
      </h1>
      {isLoading && (
        <div className="text-gray-500">Loading...</div>
      )}
    </div>
  )}
</Collection.Header>
```

### LoadMore

A headless component for load more products functionality.

**Signature:**
```tsx
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

export const LoadMore: React.FC<LoadMoreProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.LoadMore>
  {({ 
    loadMore, 
    refresh, 
    isLoading, 
    hasProducts, 
    totalProducts, 
    hasMoreProducts 
  }) => (
    <div className="text-center mt-8">
      {hasProducts && (
        <p className="text-gray-600 mb-4">
          Showing {totalProducts} products
        </p>
      )}
      <div className="space-x-4">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
        {hasMoreProducts && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )}
</Collection.LoadMore>
```

### Actions

A headless component for collection actions (refresh, load more).

**Signature:**
```tsx
interface ActionsProps {
  children: (props: ActionsRenderProps) => React.ReactNode;
}

interface ActionsRenderProps {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const Actions: React.FC<ActionsProps>
```

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Actions>
  {({ refresh, loadMore, isLoading, error }) => (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          Error: {error}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Collection'}
        </button>
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Load More Products'}
        </button>
      </div>
    </div>
  )}
</Collection.Actions>
```

## Usage Examples

The Collection components are used extensively throughout the application:

### In FilteredCollection Component
```tsx
// src/headless/store/components/FilteredCollection.tsx
import { Collection } from "./Collection";

export const Grid: React.FC<GridProps> = ({ children }) => {
  return (
    <Collection.Grid>
      {(collectionProps) => (
        <div>
          {children(collectionProps)}
        </div>
      )}
    </Collection.Grid>
  );
};
```

### In ProductList Component
```tsx
// src/components/store/ProductList.tsx
import { Collection } from "../../headless/store/components";

export const ProductGridContent = () => (
  <Collection.Grid>
    {({ products, isLoading, error, isEmpty, totalProducts }) => (
      <div>
        <Collection.Header>
          {({ totalProducts, isLoading: headerLoading }) => (
            <h2>Products ({totalProducts})</h2>
          )}
        </Collection.Header>
        
        {products.map(product => (
          <Collection.Item key={product._id} product={product}>
            {({ title, image, price, href, available }) => (
              <ProductCard 
                title={title}
                image={image}
                price={price}
                href={href}
                available={available}
              />
            )}
          </Collection.Item>
        ))}
        
        <Collection.LoadMore>
          {({ loadMore, hasMoreProducts, isLoading }) => (
            hasMoreProducts && (
              <button onClick={loadMore} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            )
          )}
        </Collection.LoadMore>
      </div>
    )}
  </Collection.Grid>
);
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-1/index.tsx
import { Collection } from "../../../headless/store/components";

export default function StoreExample1Page() {
  return (
    <StoreLayout>
      <Collection.Grid>
        {({ products, isLoading, totalProducts, hasProducts }) => (
          <div>
            <Collection.Header>
              {({ totalProducts }) => (
                <h1>Store Collection ({totalProducts})</h1>
              )}
            </Collection.Header>
            
            {hasProducts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                  <Collection.Item key={product._id} product={product}>
                    {({ title, image, price, href }) => (
                      <a href={href} className="block">
                        <img src={image} alt={title} />
                        <h3>{title}</h3>
                        <p>{price}</p>
                      </a>
                    )}
                  </Collection.Item>
                ))}
              </div>
            )}
            
            <Collection.Actions>
              {({ refresh, loadMore, isLoading, error }) => (
                <div className="text-center mt-8">
                  {error && <p className="text-red-500">{error}</p>}
                  <button 
                    onClick={refresh} 
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    Refresh Products
                  </button>
                </div>
              )}
            </Collection.Actions>
          </div>
        )}
      </Collection.Grid>
    </StoreLayout>
  );
}
```

### In React Router Store
```tsx
// src/react-pages/react-router/Routes.tsx
import { Collection } from "../../headless/store/components";

function StoreRoute() {
  return (
    <div>
      <Collection.Grid>
        {({ products, isLoading, error, totalProducts }) => (
          <div>
            <Collection.Header>
              {({ totalProducts, isLoading, hasProducts }) => (
                <div className="mb-6">
                  <h1>React Router Store</h1>
                  {hasProducts && <p>Total Products: {totalProducts}</p>}
                </div>
              )}
            </Collection.Header>
            
            {error && <div className="error">{error}</div>}
            
            <div className="product-grid">
              {products.map(product => (
                <Collection.Item key={product._id} product={product}>
                  {({ title, image, price, href }) => (
                    <Link to={href}>
                      <img src={image} alt={title} />
                      <h3>{title}</h3>
                      <p>{price}</p>
                    </Link>
                  )}
                </Collection.Item>
              ))}
            </div>
          </div>
        )}
      </Collection.Grid>
    </div>
  );
}
``` 