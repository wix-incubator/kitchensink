import { useEffect, useState, type ReactNode } from 'react';
import { MiniCartContent, MiniCartIcon } from '@/components/ecom/MiniCart';
import { CurrentCart } from '@/components/ui/ecom/CurrentCart';
import { CartLineItemAdded } from '@/components/ui/ecom/Cart';
import type {
  CheckoutServiceConfig,
  CurrentCartServiceConfig,
} from '@wix/ecom/services';
import {
  MiniCartContextProvider,
  useMiniCartContext,
} from '@/components/MiniCartContextProvider';
import { Commerce } from '@/components/ui/ecom/Commerce';

interface StoreLayoutProps {
  children: ReactNode;
  currentCartServiceConfig: CurrentCartServiceConfig;
  checkoutServiceConfig?: CheckoutServiceConfig;
  showSuccessMessage?: boolean;
  onSuccessMessageChange?: (show: boolean) => void;
}

export function StoreLayout({
  children,
  currentCartServiceConfig,
  checkoutServiceConfig,
}: StoreLayoutProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <MiniCartContextProvider>
      <Commerce.Root checkoutServiceConfig={checkoutServiceConfig ?? {}}>
        <CurrentCart currentCartServiceConfig={currentCartServiceConfig}>
          <StoreLayoutContent
            children={children}
            showSuccessMessage={showSuccessMessage}
            setShowSuccessMessage={setShowSuccessMessage}
          />
        </CurrentCart>
      </Commerce.Root>
    </MiniCartContextProvider>
  );
}

function StoreLayoutContent({
  children,
  showSuccessMessage,
  setShowSuccessMessage,
}: {
  children: ReactNode;
  showSuccessMessage: boolean;
  setShowSuccessMessage: (show: boolean) => void;
}) {
  const { open } = useMiniCartContext();
  return (
    <>
      <CartLineItemAdded>
        {({ onAddedToCart }) => {
          useEffect(
            () =>
              onAddedToCart(() => {
                setShowSuccessMessage(true);
                setTimeout(() => {
                  setShowSuccessMessage(false);
                  open();
                }, 3000);
              }),
            [onAddedToCart]
          );

          return null;
        }}
      </CartLineItemAdded>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to cart successfully!
          </div>
        </div>
      )}

      <MiniCartIcon />

      {/* Main Content */}
      {children}

      <MiniCartContent />
    </>
  );
}
