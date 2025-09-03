import { useLoaderData } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';

import { loadCurrentCartServiceConfig } from '@wix/headless-ecom/services';
import { MiniCartContent, MiniCartIcon } from '@/components/ecom/MiniCart';
import { CurrentCart } from '@/components/ui/ecom/CurrentCart';
import { CartLineItemAdded } from '@/components/ui/ecom/Cart';
import {
  NavigationProvider,
  type NavigationComponent,
} from '@/components/NavigationContext';
import { Link } from 'react-router-dom';
import '@wix/wix-vibe-plugins/plugins-vars.css';
import {
  MiniCartContextProvider,
  useMiniCartContext,
} from '@/components/MiniCartContextProvider';
import { Commerce } from '@/components/ui/ecom/Commerce';

const ReactRouterNavigationComponent: NavigationComponent = ({
  route,
  children,
  ...props
}) => {
  return (
    <Link to={route} {...props}>
      {children}
    </Link>
  );
};

export async function rootRouteLoader() {
  const [currentCartServiceConfig] = await Promise.all([
    loadCurrentCartServiceConfig(),
  ]);

  return {
    currentCartServiceConfig,
  };
}

export function WixServicesProvider(props: { children: React.ReactNode }) {
  const { currentCartServiceConfig } = useLoaderData<typeof rootRouteLoader>();

  return (
    <div data-testid="main-container">
      <MiniCartContextProvider>
        <Commerce.Root checkoutServiceConfig={{}}>
          <CurrentCart currentCartServiceConfig={currentCartServiceConfig}>
            <NavigationProvider
              navigationComponent={ReactRouterNavigationComponent}
            >
              {props.children}
            </NavigationProvider>
          </CurrentCart>
        </Commerce.Root>
      </MiniCartContextProvider>
    </div>
  );
}

export function MiniCart({ children }: { children?: ReactNode }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { currentCartServiceConfig } = useLoaderData<typeof rootRouteLoader>();

  return (
    <>
      <MiniCartIcon />

      <CurrentCart currentCartServiceConfig={currentCartServiceConfig}>
        <StoreLayoutContent
          children={children}
          showSuccessMessage={showSuccessMessage}
          setShowSuccessMessage={setShowSuccessMessage}
        />
      </CurrentCart>
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
          Added to cart successfully!
        </div>
      )}
      <MiniCartContent />
    </>
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

      {/* Main Content */}
      {children}

      <MiniCartContent />
    </>
  );
}
