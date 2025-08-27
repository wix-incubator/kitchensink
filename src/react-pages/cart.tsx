import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '@/components/ecom/Cart';
import { CurrentCart } from '@/components/ui/ecom/CurrentCart';
import type { CurrentCartServiceConfig } from '@wix/headless-ecom/services';
import { Commerce } from '@/components/ui/ecom/Commerce';

interface CartPageProps {
  currentCartServiceConfig: CurrentCartServiceConfig;
}

export default function CartPage({ currentCartServiceConfig }: CartPageProps) {
  return (
    <KitchensinkLayout>
      <Commerce.Root checkoutServiceConfig={{}}>
        <CurrentCart currentCartServiceConfig={currentCartServiceConfig}>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-content-primary text-4xl font-bold mb-4">
              Shopping Cart
            </h1>
            <CartContent />
          </div>
        </CurrentCart>
      </Commerce.Root>
    </KitchensinkLayout>
  );
}
