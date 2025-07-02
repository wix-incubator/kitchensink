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

### Basic Product Detail Page
```tsx
import ProductDetails from './components/store/ProductDetails';

function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails />
    </div>
  );
}
```

### With Success Message Integration
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useState } from 'react';

function ProductPageWithNotifications() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  return (
    <div className="product-page">
      {showSuccess && (
        <div className="success-notification">
          Product added to cart successfully!
        </div>
      )}
      
      <ProductDetails
        setShowSuccessMessage={setShowSuccess}
        cartUrl="/shopping-cart"
      />
    </div>
  );
}
```

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

### With Breadcrumb Navigation
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useProduct } from './hooks/useProduct';

function ProductPageWithBreadcrumbs({ productSlug }) {
  const { product, category } = useProduct(productSlug);
  
  return (
    <div className="product-page">
      <nav className="breadcrumb mb-8">
        <a href="/">Home</a>
        <span> / </span>
        <a href="/products">Products</a>
        {category && (
          <>
            <span> / </span>
            <a href={`/categories/${category.slug}`}>{category.name}</a>
          </>
        )}
        <span> / </span>
        <span>{product?.name}</span>
      </nav>
      
      <ProductDetails />
    </div>
  );
}
```

### Mobile-Optimized Layout
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveProductPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`product-page ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
      {!isMobile && (
        <div className="desktop-controls">
          <button className="back-button">← Back to Products</button>
        </div>
      )}
      
      <ProductDetails />
      
      {isMobile && (
        <div className="mobile-footer">
          <button className="mobile-cart-button">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
```

### With Related Products
```tsx
import ProductDetails from './components/store/ProductDetails';
import { RelatedProducts } from './components/store/RelatedProducts';

function CompleteProductPage() {
  return (
    <div className="complete-product-page">
      <div className="main-product">
        <ProductDetails />
      </div>
      
      <div className="related-section mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <RelatedProducts />
      </div>
    </div>
  );
}
```

### With Reviews Integration
```tsx
import ProductDetails from './components/store/ProductDetails';
import { ProductReviews } from './components/store/ProductReviews';

function ProductPageWithReviews() {
  return (
    <div className="product-with-reviews">
      <div className="product-main">
        <ProductDetails />
      </div>
      
      <div className="reviews-section mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <ProductReviews />
      </div>
    </div>
  );
}
```

### With Analytics Tracking
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedProductPage({ productId, productName }) {
  useEffect(() => {
    analytics.track('Product Viewed', {
      product_id: productId,
      product_name: productName
    });
  }, [productId, productName]);
  
  const handleAddToCart = () => {
    analytics.track('Product Added to Cart', {
      product_id: productId,
      product_name: productName
    });
  };
  
  return (
    <div className="tracked-product-page">
      <ProductDetails 
        setShowSuccessMessage={(show) => {
          if (show) handleAddToCart();
        }}
      />
    </div>
  );
}
```

### With Wishlist Integration
```tsx
import ProductDetails from './components/store/ProductDetails';
import { WishlistButton } from './components/WishlistButton';

function ProductPageWithWishlist() {
  return (
    <div className="product-page-wishlist">
      <div className="product-header mb-4">
        <WishlistButton />
      </div>
      
      <ProductDetails />
    </div>
  );
}
```

### Custom Styled Layout
```tsx
import ProductDetails from './components/store/ProductDetails';

function CustomProductPage() {
  return (
    <div className="custom-product-page">
      <div className="product-container max-w-7xl mx-auto">
        <div className="product-wrapper bg-white rounded-lg shadow-lg p-8">
          <ProductDetails />
        </div>
      </div>
      
      <div className="product-footer mt-8 text-center">
        <p className="text-gray-600">Free shipping on orders over $50</p>
      </div>
    </div>
  );
}
```

### With Size Guide Modal
```tsx
import ProductDetails from './components/store/ProductDetails';
import { useState } from 'react';
import { SizeGuideModal } from './components/SizeGuideModal';

function ProductPageWithSizeGuide() {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  return (
    <div className="product-with-size-guide">
      <div className="size-guide-trigger mb-4">
        <button 
          onClick={() => setShowSizeGuide(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          View Size Guide
        </button>
      </div>
      
      <ProductDetails />
      
      <SizeGuideModal 
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </div>
  );
}
```
