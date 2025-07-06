# Product Service

The `product-service` provides comprehensive product data management for individual product pages, handling product loading, state management, and error handling with server-side configuration support.

## Overview

The Product Service handles:

- **Product Loading** - Fetches product data by slug from Wix Stores
- **State Management** - Manages product data, loading states, and error states
- **Server-Side Configuration** - Supports server-side product loading for performance
- **Error Handling** - Provides comprehensive error handling for missing products
- **Rich Product Data** - Includes comprehensive product fields for display

## API Interface

```tsx
interface ProductServiceAPI {
  product: Signal<productsV3.V3Product>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadProduct: (slug: string) => Promise<void>;
}

type ProductServiceConfigResult =
  | { type: "success"; config: ServiceFactoryConfig<typeof ProductService> }
  | { type: "notFound" };
```

## Product Fields

The service fetches comprehensive product data including:

- **Description** - Full product description
- **Direct Categories** - Category information
- **Breadcrumbs** - Navigation breadcrumbs
- **Info Section** - Additional product information
- **Media Items** - Product images and media
- **Plain Description** - Text-only description
- **Thumbnail** - Product thumbnail image
- **URL** - Product URL
- **Variant Options** - Product variant choice names
- **Weight Measurement** - Product weight information

## Core Functionality

### Getting Product Data

Access the current product data:

```tsx
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service";

function ProductComponent() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.media?.[0]?.url} alt={product.name} />
    </div>
  );
}
```

### Loading Products

Load a product by slug:

```tsx
// Load product by slug
await productService.loadProduct("my-product-slug");

// Check loading state
const isLoading = productService.isLoading.get();

// Check for errors
const error = productService.error.get();
```

## Usage Examples

### Product Detail Page

```tsx
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service";

function ProductDetailPage() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-8 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">❌ Product Not Found</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.media && product.media.length > 0 && (
            <img
              src={product.media[0].url}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
          
          {/* Additional Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.media?.slice(1, 5).map((media, index) => (
              <img
                key={index}
                src={media.url}
                alt={`${product.name} ${index + 2}`}
                className="w-full h-20 object-cover rounded border cursor-pointer hover:border-blue-500"
              />
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900">
            ${product.price?.price}
          </div>
          
          {/* Stock Status */}
          {product.stock && (
            <div className="text-sm text-gray-600">
              {product.stock.inventoryStatus === "IN_STOCK" 
                ? "✅ In Stock" 
                : "❌ Out of Stock"}
            </div>
          )}
          
          {/* Add to Cart Button */}
          <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Product with Variants

```tsx
function ProductWithVariants() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  if (isLoading || error) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="product-page">
      <div className="product-header">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </div>
      
      {/* Product Variants */}
      {product.productOptions && product.productOptions.length > 0 && (
        <div className="variants-section">
          <h3>Available Options:</h3>
          <div className="variants-grid">
            {product.productOptions.map((option, index) => (
              <div key={index} className="variant-option">
                <label className="font-medium">{option.name}:</label>
                <div className="flex gap-2 mt-1">
                  {option.choices?.map((choice, choiceIndex) => (
                    <button
                      key={choiceIndex}
                      className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      {choice.description}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Product Info */}
      <div className="product-info">
        <div className="price">
          <span className="text-2xl font-bold">${product.price?.price}</span>
          {product.price?.compareAtPrice && (
            <span className="text-gray-500 line-through ml-2">
              ${product.price.compareAtPrice}
            </span>
          )}
        </div>
        
        <div className="stock-info">
          {product.manageVariants && (
            <p className="text-sm text-gray-600">
              Stock varies by selected options
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Product Breadcrumbs

```tsx
function ProductBreadcrumbs() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  
  if (isLoading || !product.breadcrumbs) {
    return null;
  }
  
  return (
    <nav className="breadcrumbs mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-500">Home</a>
        <span>›</span>
        <a href="/store" className="hover:text-blue-500">Store</a>
        
        {product.breadcrumbs.map((breadcrumb, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span>›</span>
            <a
              href={breadcrumb.url}
              className="hover:text-blue-500"
            >
              {breadcrumb.name}
            </a>
          </div>
        ))}
        
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>
    </nav>
  );
}
```

### Product Media Gallery

```tsx
import { useState } from "react";

function ProductMediaGallery() {
  const productService = useService(ProductServiceDefinition);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  
  if (isLoading || !product.media || product.media.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }
  
  return (
    <div className="media-gallery">
      {/* Main Image */}
      <div className="main-image mb-4">
        <img
          src={product.media[selectedImage]?.url}
          alt={`${product.name} - Image ${selectedImage + 1}`}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>
      
      {/* Thumbnail Grid */}
      <div className="thumbnails grid grid-cols-6 gap-2">
        {product.media.map((media, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`
              aspect-square rounded border-2 overflow-hidden transition-colors
              ${selectedImage === index 
                ? 'border-blue-500' 
                : 'border-gray-200 hover:border-gray-400'
              }
            `}
          >
            <img
              src={media.url}
              alt={`${product.name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Server-Side Configuration

The service supports server-side product loading for better performance:

### Server-Side Setup

```tsx
// In Astro page (.astro file)
---
import { loadProductServiceConfig } from "../services/product-service";

export async function getStaticPaths() {
  // Get all product slugs for static generation
  return [
    { params: { slug: "product-1" } },
    { params: { slug: "product-2" } },
    // ... more products
  ];
}

const { slug } = Astro.params;
const productConfig = await loadProductServiceConfig(slug);

if (productConfig.type === "notFound") {
  return Astro.redirect("/404");
}
---

<ProductPage config={productConfig.config} />
```

### Service Configuration

```tsx
// Client-side service configuration
import { ServiceFactory } from "@wix/services-manager-react";

function ProductPage({ config }) {
  return (
    <ServiceFactory services={[ProductService.withConfig(config)]}>
      <ProductDetailPage />
    </ServiceFactory>
  );
}
```

## Error Handling

The service provides comprehensive error handling:

### Error Types

```tsx
// Product not found
const error = productService.error.get();
// → "Product not found"

// Network errors
// → "Failed to load product"

// Invalid configuration
// → Service configuration error
```

### Error Recovery

```tsx
function ProductWithRetry() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.get();
  const isLoading = productService.isLoading.get();
  const error = productService.error.get();
  
  const handleRetry = () => {
    const slug = window.location.pathname.split('/').pop();
    if (slug) {
      productService.loadProduct(slug);
    }
  };
  
  if (error) {
    return (
      <div className="error-state text-center py-12">
        <div className="text-red-500 text-lg mb-4">❌ Failed to Load Product</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-x-4">
          <button
            onClick={handleRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return <ProductDetailPage />;
}
```

## Usage in Components

The Product Service is used throughout the application:

### In Product Components
```tsx
// src/headless/store/components/Product.tsx
export const Name = (props: ProductNameProps) => {
  const service = useService(ProductServiceDefinition);
  const product = service.product.get();
  
  return props.children({ name: product.name });
};

export const Description = (props: ProductDescriptionProps) => {
  const service = useService(ProductServiceDefinition);
  const product = service.product.get();
  
  return props.children({ description: product.description });
};
```

### In Product Detail Pages
```tsx
// src/react-pages/store/example-1/products/[slug].tsx
const productService = useService(ProductServiceDefinition);

// Used for displaying product information
const product = productService.product.get();
const isLoading = productService.isLoading.get();
const error = productService.error.get();
```

## Integration with Other Services

### Selected Variant Service Integration
- Product data is used to configure variant options
- Variant selections affect product pricing and availability
- Coordinated loading states and error handling

### Media Gallery Service Integration
- Product media data is used for image galleries
- Media service handles image optimization and display
- Shared loading states for media content

### Cart Service Integration
- Product data is used for cart item information
- Variant selections are coordinated with cart operations
- Stock information affects cart availability

## Best Practices

### Data Loading
- Always use server-side configuration for initial load
- Handle loading states gracefully
- Provide comprehensive error handling
- Cache product data when possible

### Error Handling
- Display user-friendly error messages
- Provide retry mechanisms
- Implement proper fallback states
- Handle network failures gracefully

### Performance
- Use server-side rendering for initial product data
- Implement proper loading states
- Optimize image loading
- Cache frequently accessed products

### User Experience
- Show loading skeletons during data fetching
- Provide clear error messages
- Enable easy navigation back to product lists
- Implement retry functionality for failures 