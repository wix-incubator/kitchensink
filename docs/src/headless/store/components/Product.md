# Product Headless Component

## Overview

The Product headless component provides render-prop based components for displaying product information. It includes components for product name and description display, integrating with the ProductService to provide reactive product data. These components follow the headless pattern, allowing complete control over rendering while providing the data and logic.

## Exports

### Name

```typescript
interface ProductNameProps {
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

interface ProductNameRenderProps {
  name: string;
}

const Name: React.FC<ProductNameProps>
```

Headless component for product name display.

**Props:**
- `children`: Render prop function that receives product name data

**Render Props:**
- `name`: Product name string

### Description

```typescript
interface ProductDescriptionProps {
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

interface ProductDescriptionRenderProps {
  description: NonNullable<productsV3.V3Product["description"]>;
  plainDescription: NonNullable<productsV3.V3Product["plainDescription"]>;
}

const Description: React.FC<ProductDescriptionProps>
```

Headless component for product description display.

**Props:**
- `children`: Render prop function that receives product description data

**Render Props:**
- `description`: Rich text description (may contain HTML)
- `plainDescription`: Plain text version of description

## Usage Examples

### Basic Product Name Display

```typescript
import { Product } from './headless/store/components';

function ProductNameDisplay() {
  return (
    <Product.Name>
      {({ name }) => (
        <h1 className="product-title">{name}</h1>
      )}
    </Product.Name>
  );
}
```

### Product Description with Rich Content

```typescript
import { Product } from './headless/store/components';

function ProductDescriptionDisplay() {
  return (
    <Product.Description>
      {({ description, plainDescription }) => (
        <div className="product-description">
          {/* Rich content description */}
          <div 
            className="rich-description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          
          {/* Fallback to plain description if needed */}
          {!description && (
            <p className="plain-description">{plainDescription}</p>
          )}
        </div>
      )}
    </Product.Description>
  );
}
```

### Complete Product Header

```typescript
import { Product } from './headless/store/components';

function ProductHeader() {
  return (
    <div className="product-header">
      <Product.Name>
        {({ name }) => (
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => (
          <div className="text-gray-600 mb-6">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p>{plainDescription}</p>
            )}
          </div>
        )}
      </Product.Description>
    </div>
  );
}
```

### SEO-Optimized Product Info

```typescript
import { Product } from './headless/store/components';

function SEOProductInfo() {
  return (
    <>
      <Product.Name>
        {({ name }) => (
          <>
            <h1 className="sr-only">{name}</h1>
            <div className="product-name" itemProp="name">
              {name}
            </div>
          </>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <meta name="description" content={plainDescription} />
        )}
      </Product.Description>
    </>
  );
}
```

### Conditional Product Display

```typescript
import { Product } from './headless/store/components';

function ConditionalProductInfo() {
  return (
    <div className="product-info">
      <Product.Name>
        {({ name }) => (
          <h2 className={name.length > 50 ? 'text-lg' : 'text-xl'}>
            {name}
          </h2>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ description, plainDescription }) => {
          const hasRichContent = description && description.length > 0;
          const hasPlainContent = plainDescription && plainDescription.length > 0;
          
          if (!hasRichContent && !hasPlainContent) {
            return <p className="text-gray-500">No description available</p>;
          }
          
          return (
            <div className="description">
              {hasRichContent ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <p>{plainDescription}</p>
              )}
            </div>
          );
        }}
      </Product.Description>
    </div>
  );
}
```

### Product Card Component

```typescript
import { Product } from './headless/store/components';

function ProductCard() {
  return (
    <div className="product-card">
      <Product.Name>
        {({ name }) => (
          <h3 className="product-card-title">{name}</h3>
        )}
      </Product.Name>
      
      <Product.Description>
        {({ plainDescription }) => (
          <p className="product-card-description">
            {plainDescription.length > 100 
              ? `${plainDescription.substring(0, 100)}...`
              : plainDescription
            }
          </p>
        )}
      </Product.Description>
    </div>
  );
}
```

### Breadcrumb with Product Name

```typescript
import { Product } from './headless/store/components';

function ProductBreadcrumb() {
  return (
    <nav className="breadcrumb">
      <a href="/store">Store</a>
      <span> / </span>
      <Product.Name>
        {({ name }) => (
          <span className="current-product">{name}</span>
        )}
      </Product.Name>
    </nav>
  );
}
```

## Key Features

- **Render Props Pattern**: Provides maximum flexibility for UI implementation
- **Rich Content Support**: Handles both HTML and plain text descriptions
- **Service Integration**: Automatically connects to ProductService for data
- **Type Safety**: Full TypeScript support for all props and render props
- **Reactive Updates**: Automatically re-renders when product data changes
- **SEO Friendly**: Supports proper semantic HTML structure
- **Fallback Handling**: Graceful handling of missing or empty content

## Dependencies

- **ProductServiceDefinition**: Service for product data management
- **@wix/stores**: Wix Stores SDK for product types
- **@wix/services-manager-react**: React integration for service management

The components provide a clean, headless approach to product information display with full control over presentation and styling.
