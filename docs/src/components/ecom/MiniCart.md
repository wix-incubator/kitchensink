# MiniCart Components

## Overview

The MiniCart components provide a compact shopping cart interface that displays as a slide-out panel from the right side of the screen. This includes a cart icon with item count badge and a detailed cart sidebar showing items, quantities, pricing, and checkout functionality. The components are designed for optimal user experience in e-commerce applications where users need quick access to their cart without leaving the current page.

The MiniCart system consists of multiple components that work together: a floating cart icon, a modal cart content area, and an internal coupon form. All components integrate with Wix's headless cart services and provide responsive design suitable for both desktop and mobile experiences.

## Exports

### `CouponFormMini`
**Type**: `React.FC<{ onApply: (code: string) => void; isLoading: boolean }>`

Internal component that provides a collapsible coupon code input form within the mini cart. Initially shows as a "Have a promo code?" link that expands to show input field and apply/cancel actions.

### `MiniCartIcon`
**Type**: `React.FC`

Fixed positioned cart icon component that displays in the top-right corner of the screen. Shows cart item count as a badge and triggers the mini cart modal when clicked.

### `MiniCartContent`
**Type**: `React.FC`

Main mini cart modal component that slides in from the right side. Displays cart items, quantities, pricing, coupon form, and checkout/continue shopping buttons in a responsive sidebar format.

## Usage Examples

### Full E-commerce Implementation
```tsx
import { MiniCartIcon, MiniCartContent } from './components/ecom/MiniCart';
import { ProductList } from './components/store/ProductList';
import { WixServicesProvider } from './providers/WixServicesProvider';

function EcommerceStore() {
  return (
    <WixServicesProvider showCartIcon={false}>
      <div className="store-layout">
        <header className="store-header">
          <h1>My Store</h1>
          <nav>
            <a href="/store">Products</a>
            <a href="/categories">Categories</a>
          </nav>
        </header>
        
        <main className="store-main">
          <ProductList />
        </main>
        
        <footer className="store-footer">
          <p>&copy; 2023 My Store</p>
        </footer>
        
        {/* MiniCart overlay */}
        <MiniCartIcon />
        <MiniCartContent />
      </div>
    </WixServicesProvider>
  );
}
```
