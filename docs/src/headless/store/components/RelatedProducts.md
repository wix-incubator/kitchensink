# RelatedProducts Components

The `RelatedProducts` components provide functionality for displaying and managing related products, typically used to show similar or complementary items on product detail pages.

## Overview

The RelatedProducts module exports components for displaying related products:

- **List** - Container component for related products with loading states
- **Item** - Individual related product item with quick actions

## Exports

### List

A headless component that provides access to related products with state management.

**Signature:**
```tsx
interface ListProps {
  children: (props: ListRenderProps) => React.ReactNode;
}

interface ListRenderProps {
  products: productsV3.V3Product[];
  isLoading: boolean;
  error: string | null;
  hasProducts: boolean;
  refresh: () => Promise<void>;
}

export const List: React.FC<ListProps>
```

**Example:**
```tsx
import { RelatedProducts } from "../../headless/store/components";

<RelatedProducts.List>
  {({ products, isLoading, error, hasProducts, refresh }) => (
    <div className="related-products">
      <h3 className="text-xl font-semibold mb-4">Related Products</h3>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading related products...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading related products: {error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!isLoading && !error && !hasProducts && (
        <div className="text-center py-8">
          <p className="text-gray-600">No related products found</p>
        </div>
      )}
      
      {hasProducts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <RelatedProducts.Item key={product._id} product={product}>
              {({ title, image, price, available, href, onQuickAdd }) => (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <a href={href}>
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                    )}
                    <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                    <p className="text-lg font-bold text-blue-600">{price}</p>
                    <p className={`text-sm ${available ? 'text-green-600' : 'text-red-600'}`}>
                      {available ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </a>
                  <button
                    onClick={onQuickAdd}
                    disabled={!available}
                    className="w-full mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                  >
                    Quick Add
                  </button>
                </div>
              )}
            </RelatedProducts.Item>
          ))}
        </div>
      )}
    </div>
  )}
</RelatedProducts.List>
```

### Item

A headless component for individual related product items with quick actions.

**Signature:**
```tsx
interface ItemProps {
  product: productsV3.V3Product;
  children: (props: ItemRenderProps) => React.ReactNode;
}

interface ItemRenderProps {
  title: string;
  image: string | null;
  price: string;
  available: boolean;
  href: string;
  description: string;
  onQuickAdd: () => void;
}

export const Item: React.FC<ItemProps>
```

**Example:**
```tsx
import { RelatedProducts } from "../../headless/store/components";

<RelatedProducts.Item product={product}>
  {({ 
    title, 
    image, 
    price, 
    available, 
    href, 
    description, 
    onQuickAdd 
  }) => (
    <div className="related-product-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <a href={href} className="block">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h4>
          {description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              {price}
            </span>
            <span className={`text-sm ${
              available ? 'text-green-600' : 'text-red-600'
            }`}>
              {available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </a>
      
      <div className="p-4 pt-0">
        <button
          onClick={onQuickAdd}
          disabled={!available}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            available
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {available ? 'Quick Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )}
</RelatedProducts.Item>
```

## Complete Examples

### Simple Related Products Section

```tsx
import { RelatedProducts } from "../../headless/store/components";

export function SimpleRelatedProducts() {
  return (
    <section className="py-8">
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts, refresh }) => {
          if (isLoading) {
            return (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading related products...</p>
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load related products</p>
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            );
          }

          if (!hasProducts) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-600">No related products available</p>
              </div>
            );
          }

          return (
            <div>
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={href} className="block">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2">
                              {title}
                            </h3>
                            <p className="text-xl font-bold text-blue-600">
                              {price}
                            </p>
                          </div>
                        </a>
                        <div className="p-4 pt-0">
                          <button
                            onClick={onQuickAdd}
                            disabled={!available}
                            className={`w-full py-2 px-4 rounded font-medium ${
                              available
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {available ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>
            </div>
          );
        }}
      </RelatedProducts.List>
    </section>
  );
}
```

### Related Products Carousel

```tsx
import { RelatedProducts } from "../../headless/store/components";
import { useState } from "react";

export function RelatedProductsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  return (
    <section className="py-8">
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => {
          if (isLoading) {
            return (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-48 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (error || !hasProducts) {
            return null; // Hide section if no products
          }

          const itemsPerPage = 4;
          const totalPages = Math.ceil(products.length / itemsPerPage);
          const currentProducts = products.slice(
            currentIndex * itemsPerPage,
            (currentIndex + 1) * itemsPerPage
          );

          return (
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Related Products</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentIndex(Math.min(totalPages - 1, currentIndex + 1))}
                    disabled={currentIndex === totalPages - 1}
                    className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProducts.map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={href} className="block">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {title}
                            </h3>
                            <p className="text-xl font-bold text-blue-600">
                              {price}
                            </p>
                            <p className={`text-sm ${
                              available ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {available ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </a>
                        <div className="p-4 pt-0">
                          <button
                            onClick={onQuickAdd}
                            disabled={!available}
                            className={`w-full py-2 px-4 rounded font-medium ${
                              available
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>

              <div className="flex justify-center mt-6 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        }}
      </RelatedProducts.List>
    </section>
  );
}
```

### Compact Related Products Sidebar

```tsx
import { RelatedProducts } from "../../headless/store/components";

export function RelatedProductsSidebar() {
  return (
    <aside className="w-64 bg-gray-50 p-4 rounded-lg">
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => {
          if (isLoading) {
            return (
              <div>
                <div className="h-5 bg-gray-200 rounded mb-4 w-32"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (error || !hasProducts) {
            return null;
          }

          return (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Related Products</h3>
              <div className="space-y-4">
                {products.slice(0, 3).map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <a href={href} className="flex-shrink-0">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </a>
                        <div className="flex-1 min-w-0">
                          <a href={href} className="block">
                            <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                              {title}
                            </h4>
                            <p className="text-sm font-bold text-blue-600 mb-1">
                              {price}
                            </p>
                          </a>
                          <button
                            onClick={onQuickAdd}
                            disabled={!available}
                            className={`text-xs px-2 py-1 rounded ${
                              available
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {available ? 'Add' : 'N/A'}
                          </button>
                        </div>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>
            </div>
          );
        }}
      </RelatedProducts.List>
    </aside>
  );
}
```

## Usage Examples

The RelatedProducts components are used in product detail pages and other locations:

### In Product Detail Pages

```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { RelatedProducts } from "../../../../headless/store/components";

export const ProductDetailPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Main product content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product images and details */}
      </div>
      
      {/* Related Products Section */}
      <RelatedProducts.List>
        {({ products, isLoading, error, hasProducts }) => {
          if (!hasProducts && !isLoading) {
            return null; // Don't show section if no products
          }
          
          return (
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Failed to load related products</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <RelatedProducts.Item key={product._id} product={product}>
                      {({ title, image, price, available, href }) => (
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <a href={href} className="block">
                            {image && (
                              <img
                                src={image}
                                alt={title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            )}
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 mb-2">
                                {title}
                              </h3>
                              <p className="text-xl font-bold text-blue-600">
                                {price}
                              </p>
                              <p className={`text-sm ${
                                available ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {available ? 'In Stock' : 'Out of Stock'}
                              </p>
                            </div>
                          </a>
                        </div>
                      )}
                    </RelatedProducts.Item>
                  ))}
                </div>
              )}
            </section>
          );
        }}
      </RelatedProducts.List>
    </div>
  );
};
```

### In Shopping Cart

```tsx
// src/react-pages/cart.tsx
import { RelatedProducts } from "../headless/store/components";

export const CartPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Cart items */}
      <div className="mb-12">
        {/* Cart content */}
      </div>
      
      {/* Related Products for Cross-selling */}
      <RelatedProducts.List>
        {({ products, hasProducts, isLoading }) => {
          if (!hasProducts || isLoading) {
            return null;
          }
          
          return (
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-6">Complete Your Purchase</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map(product => (
                  <RelatedProducts.Item key={product._id} product={product}>
                    {({ title, image, price, available, href, onQuickAdd }) => (
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <a href={href} className="block">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-32 object-cover rounded mb-3"
                            />
                          )}
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">
                            {title}
                          </h3>
                          <p className="text-lg font-bold text-blue-600">
                            {price}
                          </p>
                        </a>
                        <button
                          onClick={onQuickAdd}
                          disabled={!available}
                          className={`w-full mt-3 py-2 px-3 rounded text-sm font-medium ${
                            available
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {available ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    )}
                  </RelatedProducts.Item>
                ))}
              </div>
            </section>
          );
        }}
      </RelatedProducts.List>
    </div>
  );
};
```

## Integration with Services

The RelatedProducts components integrate with the RelatedProductsService:

### Service Integration
- Automatically loads related products for the current context
- Provides loading states and error handling
- Supports refresh functionality for updated recommendations

### Quick Add Functionality
- Integrates with cart services for quick add operations
- Handles inventory checks and availability
- Provides immediate feedback for user actions

### URL Generation
- Automatically generates product page URLs
- Supports different store layouts and routing patterns
- Maintains consistent navigation experience

## Best Practices

### Loading States
- Always show loading indicators while fetching related products
- Use skeleton screens for better perceived performance
- Handle empty states gracefully

### Error Handling
- Provide retry mechanisms for failed requests
- Hide sections when no products are available
- Log errors for debugging while maintaining user experience

### Performance
- Limit the number of related products shown
- Use responsive design for different screen sizes
- Implement lazy loading for below-fold content

### User Experience
- Show clear product information (title, price, availability)
- Provide quick actions (add to cart, view details)
- Maintain consistent styling with the rest of the application
``` 