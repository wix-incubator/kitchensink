# Product Details Component

## Overview

The ProductDetails component provides a comprehensive product detail page interface for e-commerce applications. It displays product information including images in a gallery format, pricing, descriptions, variant selection, product modifiers, and purchase options. The component integrates with Wix's headless commerce services to provide real-time product data, variant management, and cart functionality.

This component serves as the main product detail page and includes features like image galleries with thumbnails, variant selection for options like size and color, product modifiers for customization, pricing display with compare-at pricing, and integration with cart services for adding products to cart.

## Exports

### `FreeTextInput`
**Type**: `React.FC<{ modifier: any; name: string }>`

Reusable component for handling free text input modifiers. Provides a textarea with character counting and validation for custom product personalization options.

### `ProductDetails` (default export)
**Type**: `React.FC<{ setShowSuccessMessage?: (show: boolean) => void; cartUrl?: string }>`

Main product details component that renders the complete product information interface including media gallery, product information, variant selection, modifiers, and purchase options.

## Usage Examples

### In Store Layout
```tsx
import ProductDetails from './components/store/ProductDetails';
import { StoreLayout } from './layouts/StoreLayout';

function ProductPage() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  return (
    <StoreLayout 
      currentCartServiceConfig={null}
      showSuccessMessage={showSuccessMessage}
      onSuccessMessageChange={setShowSuccessMessage}
    >
      <div className="product-detail-page">
        <ProductDetails setShowSuccessMessage={setShowSuccessMessage} />
      </div>
    </StoreLayout>
  );
}
```
