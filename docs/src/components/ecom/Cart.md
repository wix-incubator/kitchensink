# Cart Component

## Overview

The Cart component provides a comprehensive shopping cart interface for e-commerce applications. It displays cart items, handles quantity management, shows order summaries, and integrates with Wix's cart services for full e-commerce functionality. The component includes loading states, empty cart messaging, item management controls, order notes, coupon application, and checkout initiation.

This component is designed as a full-page cart experience with responsive design, supporting product images, variant displays, pricing information, and a complete checkout flow. It integrates seamlessly with Wix's headless commerce components and provides a polished shopping cart user experience.

## Exports

### `CartContent` (default export)
**Type**: `React.FC`

The main cart component that renders the complete shopping cart interface including item list, quantity controls, order summary, and checkout functionality. Uses Wix's CurrentCart headless components for state management.

## Usage Examples

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
