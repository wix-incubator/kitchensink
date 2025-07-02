# Product Service

## Overview

The ProductService is a headless service that manages individual product data and loading operations in a Wix e-commerce application. It provides reactive state management for product information, loading states, and error handling when fetching product details by slug. The service integrates with Wix's stores API to fetch comprehensive product data including descriptions, categories, media, and variant information.

This service follows the Wix services pattern and uses signals for reactive state updates. It's designed to be used in product detail pages where a single product needs to be loaded and displayed with full information.

## Exports

### `ProductServiceAPI`
**Type**: `interface`

TypeScript interface defining the API surface for product operations, including reactive signals for product state and methods for loading products.

### `ProductServiceDefinition`
**Type**: `ServiceDefinition<ProductServiceAPI>`

Service definition that identifies and types the product service within Wix's service manager system.

### `ProductService`
**Type**: `ServiceImplementation<ProductServiceAPI>`

Main service implementation that provides product loading functionality and reactive state management.

### `ProductServiceConfigResult`
**Type**: `{ type: "success"; config: ServiceFactoryConfig<typeof ProductService> } | { type: "notFound" }`

Type union representing the result of loading product configuration, either successful with config data or indicating the product was not found.

### `loadProductServiceConfig`
**Type**: `(productSlug: string) => Promise<ProductServiceConfigResult>`

Async function that loads product configuration by slug, handling not-found cases and returning appropriate result types.

## Usage Examples

### Service Registration
```typescript
import { ProductService, ProductServiceDefinition, loadProductServiceConfig } from './headless/store/services/product-service';

// Load configuration and register service
const configResult = await loadProductServiceConfig('my-product-slug');

if (configResult.type === 'success') {
  const servicesMap = createServicesMap()
    .addService(ProductServiceDefinition, ProductService, configResult.config);
}
```

### Using Product Service in React Components
```tsx
import { useService } from '@wix/services-manager-react';
import { ProductServiceDefinition } from './headless/store/services/product-service';

function ProductDetailPage() {
  const productService = useService(ProductServiceDefinition);
  
  const product = productService.product.use();
  const isLoading = productService.isLoading.use();
  const error = productService.error.use();
  
  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <div>Price: {product.priceData?.formatted?.price}</div>
      {product.media?.mainMedia && (
        <img 
          src={product.media.mainMedia.image?.url} 
          alt={product.name}
        />
      )}
    </div>
  );
}
```

### Dynamic Product Loading
```tsx
function ProductLoader({ productSlug }: { productSlug: string }) {
  const productService = useService(ProductServiceDefinition);
  const [loading, setLoading] = useState(false);
  
  const handleLoadProduct = async () => {
    setLoading(true);
    try {
      await productService.loadProduct(productSlug);
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    handleLoadProduct();
  }, [productSlug]);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      <ProductDetailPage />
    </div>
  );
}
```

### Product Information Display
```tsx
function ProductInfo() {
  const productService = useService(ProductServiceDefinition);
  const product = productService.product.use();
  
  return (
    <div className="product-info">
      <div className="product-header">
        <h1>{product.name}</h1>
        {product.ribbon && <span className="ribbon">{product.ribbon}</span>}
      </div>
      
      <div className="product-media">
        {product.media?.items?.map((media, index) => (
          <img
            key={index}
            src={media.image?.url}
            alt={`${product.name} image ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="product-details">
        <div className="price">
          {product.priceData?.formatted?.discountedPrice ? (
            <>
              <span className="original-price">
                {product.priceData.formatted.price}
              </span>
              <span className="discounted-price">
                {product.priceData.formatted.discountedPrice}
              </span>
            </>
          ) : (
            <span className="price">
              {product.priceData?.formatted?.price}
            </span>
          )}
        </div>
        
        <div className="description">
          {product.description && (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          )}
        </div>
        
        <div className="categories">
          {product.productType?.name && (
            <span>Category: {product.productType.name}</span>
          )}
        </div>
        
        {product.additionalInfoSections?.map((section, index) => (
          <div key={index} className="info-section">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Server-Side Product Loading (Astro)
```typescript
// In an Astro page or API route
import { loadProductServiceConfig } from './headless/store/services/product-service';

export async function getStaticPaths() {
  // Generate paths for all products
  return [
    { params: { slug: 'product-1' } },
    { params: { slug: 'product-2' } },
  ];
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const configResult = await loadProductServiceConfig(slug);
  
  if (configResult.type === 'notFound') {
    return { notFound: true };
  }
  
  return {
    props: {
      productConfig: configResult.config,
    },
  };
}
```
