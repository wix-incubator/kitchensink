import { useEffect, useState, type ReactNode } from 'react';
import { MiniCartContent, MiniCartIcon } from '../components/ecom/MiniCart';
import { CurrentCart, Cart } from '@wix/headless-ecom/react';
import type { CurrentCartServiceConfig } from '@wix/headless-ecom/services';
import {
  MiniCartModalProvider,
  useMiniCartModal,
} from '../components/MiniCartModal';

interface StoreLayoutProps {
  children: ReactNode;
  currentCartServiceConfig: CurrentCartServiceConfig;
  showSuccessMessage?: boolean;
  onSuccessMessageChange?: (show: boolean) => void;
}

export function StoreLayout({
  children,
  currentCartServiceConfig,
}: StoreLayoutProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <MiniCartModalProvider>
      <CurrentCart.Root currentCartServiceConfig={currentCartServiceConfig}>
        <StoreLayoutContent
          children={children}
          showSuccessMessage={showSuccessMessage}
          setShowSuccessMessage={setShowSuccessMessage}
        />
      </CurrentCart.Root>
    </MiniCartModalProvider>
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
  const { open } = useMiniCartModal();
  return (
    <>
      <Cart.LineItemAdded>
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
      </Cart.LineItemAdded>

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
