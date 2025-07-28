import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';
import { CurrentCart } from '@wix/headless-ecom/react';
import type { CurrentCartServiceConfig } from '@wix/headless-ecom/services';

interface CartPageProps {
  currentCartServiceConfig: CurrentCartServiceConfig;
}

export default function CartPage({ currentCartServiceConfig }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <CurrentCart.Root currentCartServiceConfig={currentCartServiceConfig}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-content-primary text-4xl font-bold mb-4">
            Shopping Cart
          </h1>
          <CartContent />
        </div>
      </CurrentCart.Root>
    </KitchensinkLayout>
  );
}
