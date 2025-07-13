import { useLoaderData, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
  loadCurrentCartServiceConfig,
} from '../../../headless/ecom/services/current-cart-service';
import { MiniCartContent, MiniCartIcon } from '../../../components/ecom/MiniCart';
import { type LineItem } from '../../../headless/ecom/components/CurrentCart';
import { CurrentCart } from '../../../headless/ecom/components';
import {
  NavigationProvider,
  type NavigationComponent,
} from '../../../components/NavigationContext';
import { Link } from 'react-router-dom';

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

export function RootRoute(props: { children: React.ReactNode }) {
  const { currentCartServiceConfig } = useLoaderData<typeof rootRouteLoader>();

  const servicesMap = createServicesMap().addService(
    CurrentCartServiceDefinition,
    CurrentCartService,
    currentCartServiceConfig
  );

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <div
      className="min-h-screen bg-surface-primary p-4 pt-16"
      data-testid="main-container"
    >
      <WixServices servicesMap={servicesMap}>
        <NavigationProvider
          navigationComponent={ReactRouterNavigationComponent}
        >
          <MiniCartIcon />

          <CurrentCart.Trigger>
            {({ onOpen }) => (
              <CurrentCart.LineItemAdded>
                {({ onAddedToCart }) => {
                  useEffect(
                    () =>
                      onAddedToCart((lineItems: LineItem[] | undefined) => {
                        setShowSuccessMessage(true);
                        setTimeout(() => {
                          setShowSuccessMessage(false);
                          onOpen();
                        }, 3000);
                      }),
                    [onAddedToCart]
                  );

                  return null;
                }}
              </CurrentCart.LineItemAdded>
            )}
          </CurrentCart.Trigger>

          {showSuccessMessage && (
            <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
              Added to cart successfully blyat!
            </div>
          )}

          {/* Main Content */}
          {props.children}

          <MiniCartContent />
        </NavigationProvider>
      </WixServices>
    </div>
  );
}

export const rootRouteDefinition = {
  path: '/',
  element: (
    <RootRoute>
      <Outlet />
    </RootRoute>
  ),
  loader: rootRouteLoader,
}; 