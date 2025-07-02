# Cart Component

## Overview

The Cart component provides a comprehensive shopping cart interface for e-commerce applications. It displays cart items, handles quantity management, shows order summaries, and integrates with Wix's cart services for full e-commerce functionality. The component includes loading states, empty cart messaging, item management controls, order notes, coupon application, and checkout initiation.

This component is designed as a full-page cart experience with responsive design, supporting product images, variant displays, pricing information, and a complete checkout flow. It integrates seamlessly with Wix's headless commerce components and provides a polished shopping cart user experience.

## Exports

### `CartContent` (default export)
**Type**: `React.FC`

The main cart component that renders the complete shopping cart interface including item list, quantity controls, order summary, and checkout functionality. Uses Wix's CurrentCart headless components for state management.

## Usage Examples

### Basic Cart Page
```tsx
import CartContent from './components/ecom/Cart';

function CartPage() {
  return (
    <div className="app">
      <CartContent />
    </div>
  );
}
```

### With Navigation Integration
```tsx
import CartContent from './components/ecom/Cart';
import { NavigationProvider } from './components/NavigationContext';

function App() {
  return (
    <NavigationProvider>
      <CartContent />
    </NavigationProvider>
  );
}
```

### In Store Layout
```tsx
import CartContent from './components/ecom/Cart';
import { StoreLayout } from './layouts/StoreLayout';

function CartPage() {
  return (
    <StoreLayout currentCartServiceConfig={null}>
      <CartContent />
    </StoreLayout>
  );
}
```

### As Route Component
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CartContent from './components/ecom/Cart';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cart" element={<CartContent />} />
        <Route path="/store" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### With Custom Styling
```tsx
import CartContent from './components/ecom/Cart';

function CustomizedCartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <h1>My Store - Shopping Cart</h1>
      </header>
      
      <main className="container mx-auto">
        <CartContent />
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <p>&copy; 2023 My Store</p>
      </footer>
    </div>
  );
}
```

### Integration with Authentication
```tsx
import CartContent from './components/ecom/Cart';
import { useAuth } from './hooks/useAuth';

function AuthenticatedCart() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return (
      <div className="text-center p-8">
        <h2>Please sign in to view your cart</h2>
        <button>Sign In</button>
      </div>
    );
  }
  
  return <CartContent />;
}
```

### Mobile-Optimized Usage
```tsx
import CartContent from './components/ecom/Cart';
import { useMediaQuery } from './hooks/useMediaQuery';

function ResponsiveCart() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={isMobile ? 'mobile-cart' : 'desktop-cart'}>
      <CartContent />
    </div>
  );
}
```

### With Analytics Tracking
```tsx
import CartContent from './components/ecom/Cart';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function TrackedCart() {
  useEffect(() => {
    // Track cart page view
    analytics.track('Cart Page Viewed');
  }, []);
  
  return <CartContent />;
}
```

### Embedded in Checkout Flow
```tsx
import CartContent from './components/ecom/Cart';
import { useState } from 'react';

function CheckoutFlow() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="checkout-flow">
      <div className="steps-indicator">
        <span className={step === 1 ? 'active' : ''}>1. Cart</span>
        <span className={step === 2 ? 'active' : ''}>2. Shipping</span>
        <span className={step === 3 ? 'active' : ''}>3. Payment</span>
      </div>
      
      {step === 1 && (
        <div>
          <CartContent />
          <button onClick={() => setStep(2)}>
            Continue to Shipping
          </button>
        </div>
      )}
      
      {step === 2 && <ShippingForm />}
      {step === 3 && <PaymentForm />}
    </div>
  );
}
```
