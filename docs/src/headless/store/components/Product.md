# Product Components

The `Product` components provide basic product information display functionality, focusing on core product data like name and description.

## Overview

The Product module exports simple components for displaying product information:

- **Name** - Component for product name display
- **Description** - Component for product description display

## Exports

### Name

A headless component that provides access to the product name.

**Signature:**
```tsx
interface ProductNameProps {
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

interface ProductNameRenderProps {
  name: string;
}

export const Name: React.FC<ProductNameProps>
```

**Example:**
```tsx
import { Product } from "../../headless/store/components";

<Product.Name>
  {({ name }) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      {name}
    </h1>
  )}
</Product.Name>
```

### Description

A headless component that provides access to the product description in both rich text and plain text formats.

**Signature:**
```tsx
interface ProductDescriptionProps {
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

interface ProductDescriptionRenderProps {
  description: NonNullable<productsV3.V3Product["description"]>;
  plainDescription: NonNullable<productsV3.V3Product["plainDescription"]>;
}

export const Description: React.FC<ProductDescriptionProps>
```

**Example:**
```tsx
import { Product } from "../../headless/store/components";

<Product.Description>
  {({ description, plainDescription }) => (
    <div className="product-description">
      {/* Rich text description */}
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      
      {/* Fallback to plain text if rich text is not available */}
      {!description && plainDescription && (
        <p className="text-gray-700 whitespace-pre-wrap">
          {plainDescription}
        </p>
      )}
    </div>
  )}
</Product.Description>
```

## Complete Examples

### Basic Product Header

```tsx
import { Product } from "../../headless/store/components";

export function ProductHeader() {
  return (
    <div className="product-header">
      <Product.Name>
        {({ name }) => (
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {name}
          </h1>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => (
          <div className="text-gray-600 mb-6">
            {description ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : plainDescription ? (
              <p className="whitespace-pre-wrap">{plainDescription}</p>
            ) : (
              <p className="italic">No description available</p>
            )}
          </div>
        )}
      </Product.Description>
    </div>
  );
}
```

### Product Card Display

```tsx
import { Product } from "../../headless/store/components";

export function ProductCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <Product.Name>
        {({ name }) => (
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {name}
          </h2>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <p className="text-gray-600 text-sm line-clamp-3">
            {plainDescription || "No description available"}
          </p>
        )}
      </Product.Description>
    </div>
  );
}
```

### SEO-Optimized Product Display

```tsx
import { Product } from "../../headless/store/components";

export function SEOProductDisplay() {
  return (
    <article className="product-article">
      <Product.Name>
        {({ name }) => (
          <header>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {name}
            </h1>
            {/* SEO structured data */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": name
              })}
            </script>
          </header>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => (
          <section className="product-description">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Product Description
            </h2>
            
            {description ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : plainDescription ? (
              <div className="text-gray-700 whitespace-pre-wrap">
                {plainDescription}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No description available for this product.
              </p>
            )}
          </section>
        )}
      </Product.Description>
    </article>
  );
}
```

### Product Summary with Truncation

```tsx
import { Product } from "../../headless/store/components";
import { useState } from "react";

export function ProductSummary() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="product-summary">
      <Product.Name>
        {({ name }) => (
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {name}
          </h3>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => {
          const shouldTruncate = plainDescription && plainDescription.length > 150;
          const displayText = shouldTruncate && !isExpanded 
            ? plainDescription.substring(0, 150) + "..."
            : plainDescription;
          
          return (
            <div className="text-gray-600 text-sm">
              {displayText && (
                <p className="whitespace-pre-wrap">{displayText}</p>
              )}
              
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
              
              {!plainDescription && (
                <p className="italic text-gray-400">
                  No description available
                </p>
              )}
            </div>
          );
        }}
      </Product.Description>
    </div>
  );
}
```

## Usage Examples

The Product components are used throughout the application:

### In Product Detail Pages

```tsx
// src/react-pages/store/example-1/products/[slug].tsx
import { Product } from "../../../../headless/store/components";

export const ProductDetailContent = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="product-images">
          {/* Product images would go here */}
        </div>
        
        <div className="product-info">
          <Product.Name>
            {({ name }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {name}
              </h1>
            )}
          </Product.Name>
          
          <Product.Description>
            {({ description, plainDescription }) => (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                {description ? (
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : plainDescription ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {plainDescription}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No description available
                  </p>
                )}
              </div>
            )}
          </Product.Description>
          
          {/* Other product components like variants, pricing, etc. */}
        </div>
      </div>
    </div>
  );
};
```

### In Product Lists

```tsx
// src/components/store/ProductList.tsx
import { Product } from "../../headless/store/components";

export const ProductListItem = ({ product }) => {
  return (
    <div className="product-list-item bg-white rounded-lg shadow-sm p-4">
      <Product.Name>
        {({ name }) => (
          <h3 className="font-semibold text-gray-900 mb-2">
            {name}
          </h3>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <p className="text-gray-600 text-sm line-clamp-2">
            {plainDescription || "No description available"}
          </p>
        )}
      </Product.Description>
    </div>
  );
};
```

### In Search Results

```tsx
// src/components/store/SearchResults.tsx
import { Product } from "../../headless/store/components";

export const SearchResultItem = ({ product }) => {
  return (
    <div className="search-result-item flex p-4 border-b border-gray-200">
      <div className="flex-1">
        <Product.Name>
          {({ name }) => (
            <h4 className="font-medium text-gray-900 mb-1">
              <a href={`/products/${product.slug}`} className="hover:text-blue-600">
                {name}
              </a>
            </h4>
          )}
        </Product.Name>
        
        <Product.Description>
          {({ plainDescription }) => (
            <p className="text-gray-600 text-sm line-clamp-2">
              {plainDescription || "No description available"}
            </p>
          )}
        </Product.Description>
      </div>
    </div>
  );
};
```

## Integration with Services

The Product components integrate with the ProductService:

### Product Service Integration
- Provides core product data (name, description)
- Handles both rich text and plain text descriptions
- Manages product information state and updates

### Content Formatting
- Supports HTML content in descriptions
- Provides fallback to plain text when rich content isn't available
- Handles content sanitization and display

### SEO Considerations
- Product names are suitable for H1 tags and page titles
- Descriptions can be used for meta descriptions
- Rich text content preserves formatting for better user experience

## Best Practices

### Content Display
- Always provide fallback content when descriptions are empty
- Use proper HTML sanitization when displaying rich text content
- Consider truncation for long descriptions in list views

### Accessibility
- Use semantic HTML elements (h1, h2, etc.) for product names
- Ensure proper heading hierarchy in product layouts
- Provide alternative text for users when content is unavailable

### Performance
- Product components are lightweight and don't perform heavy operations
- Rich text content should be sanitized on the server side when possible
- Consider lazy loading for product descriptions in long lists 