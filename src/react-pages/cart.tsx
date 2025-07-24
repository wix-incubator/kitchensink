import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';
import { CurrentCart } from '@wix/headless-ecom/react';

interface CartPageProps {
  data?: any;
}

export default function CartPage({ data }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <CurrentCart.Root currentCartServiceConfig={data}>
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
