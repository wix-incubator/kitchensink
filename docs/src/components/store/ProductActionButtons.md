# ProductActionButtons Component

## Overview

The `ProductActionButtons` component provides action buttons for product interactions, specifically "Add to Cart" and "Buy Now" functionality. It handles different product states including stock availability, pre-order scenarios, and loading states. The component integrates with Wix's cart service to manage cart operations and checkout flow.

## Exports

### ProductActionButtons (Default Export)

```typescript
interface ProductActionButtonsProps {
  onAddToCart: () => Promise<void>;
  canAddToCart: boolean;
  isLoading: boolean;
  isPreOrderEnabled: boolean;
  inStock: boolean;
  onShowSuccessMessage: (show: boolean) => void;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps>
```

Main component that renders product action buttons with appropriate states and behaviors.

**Props:**
- `onAddToCart`: Function to handle adding product to cart
- `canAddToCart`: Whether the product can be added to cart
- `isLoading`: Loading state for button interactions
- `isPreOrderEnabled`: Whether pre-order is enabled for the product
- `inStock`: Whether the product is in stock
- `onShowSuccessMessage`: Callback to show/hide success messages

### AddToCartButton

```typescript
interface AddToCartButtonProps extends BaseButtonProps {
  isPreOrderEnabled: boolean;
  inStock: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps>
```

Button component for adding products to cart or pre-ordering. Displays different text based on stock status and pre-order availability.

### BuyNowButton

```typescript
interface BuyNowButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onAddToCart: () => Promise<void>;
  className?: string;
}

const BuyNowButton: React.FC<BuyNowButtonProps>
```

Button component for immediate purchase that clears the cart, adds the product, and proceeds to checkout.

## Usage Examples

### Basic Product Actions

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function ProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add product to cart logic
      await cartService.addToCart(productId, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ProductActionButtons
        onAddToCart={handleAddToCart}
        canAddToCart={true}
        isLoading={isLoading}
        isPreOrderEnabled={false}
        inStock={true}
        onShowSuccessMessage={setShowSuccess}
      />
      {showSuccess && <div>Added to cart successfully!</div>}
    </div>
  );
}
```

### Pre-Order Product

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function PreOrderProduct() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePreOrder = async () => {
    setIsLoading(true);
    try {
      await preOrderService.addPreOrder(productId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductActionButtons
      onAddToCart={handlePreOrder}
      canAddToCart={true}
      isLoading={isLoading}
      isPreOrderEnabled={true}
      inStock={false}
      onShowSuccessMessage={() => {}}
    />
  );
}
```

### Out of Stock Product

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function OutOfStockProduct() {
  return (
    <ProductActionButtons
      onAddToCart={async () => {}}
      canAddToCart={false}
      isLoading={false}
      isPreOrderEnabled={false}
      inStock={false}
      onShowSuccessMessage={() => {}}
    />
  );
}
```

### With Custom Styling

```typescript
import { ProductActionButtons } from './components/store/ProductActionButtons';

function StyledProductActions() {
  return (
    <div className="product-actions-container">
      <ProductActionButtons
        onAddToCart={handleAddToCart}
        canAddToCart={true}
        isLoading={false}
        isPreOrderEnabled={false}
        inStock={true}
        onShowSuccessMessage={setShowMessage}
      />
    </div>
  );
}
```

## Key Features

- **Dual Action Support**: Provides both "Add to Cart" and "Buy Now" functionality
- **State Management**: Handles loading, disabled, and success states
- **Pre-Order Support**: Adapts button text and behavior for pre-order products
- **Stock Awareness**: Only shows "Buy Now" for in-stock items
- **Visual Feedback**: Includes loading spinners and hover effects
- **Cart Integration**: Integrates with Wix cart service for immediate purchase flow
- **Success Messaging**: Provides callback for showing success notifications
- **Responsive Design**: Buttons adapt to different screen sizes with proper styling
