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
