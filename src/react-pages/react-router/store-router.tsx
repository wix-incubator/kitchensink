import {
  Navigate,
  Outlet,
  createBrowserRouter,
  RouterProvider,
  type StaticHandlerContext,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';
import { useMemo } from 'react';

// Import route components and loaders
import { MiniCart, rootRouteLoader, WixServicesProvider } from './routes/root';
import {
  ProductDetailsRoute,
  productRouteLoader,
} from './routes/product-details';
import {
  StoreCollectionRoute,
  storeCollectionRouteLoader,
} from './routes/store-collection';
import { defaultStoreCollectionRouteRedirectLoader } from './routes/store-redirect';
import { Cart } from './routes/cart';

export const routes = [
  {
    path: '/',
    element: <Navigate to="/store" />,
  },
  {
    element: (
      <WixServicesProvider>
        <MiniCart
          // cartIcon={... optionally use your own mini cart icon...}
          cartIconClassName="fixed top-2 right-2 z-50"
        />
        <Outlet />
      </WixServicesProvider>
    ),
    loader: rootRouteLoader,
    children: [
      {
        path: '/products/:slug',
        element: <ProductDetailsRoute />,
        loader: productRouteLoader,
      },
      {
        path: '/store',
        element: <></>,
        loader: defaultStoreCollectionRouteRedirectLoader,
        index: true,
      },
      {
        path: '/store/:categorySlug',
        element: <StoreCollectionRoute productPageRoute="/products" />,
        loader: storeCollectionRouteLoader,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
    ],
  },
];

export default function ReactRouterApp({
  context,
  basename,
}: {
  context: StaticHandlerContext;
  basename: string;
}) {
  // Check if we're running on server at runtime, not build time
  const isSSR = typeof window === 'undefined';

  // Memoize router creation to prevent recreating on every render
  // This prevents hydration mismatches between SSR and CSR
  const router = useMemo(() => {
    if (isSSR) {
      return createStaticRouter(routes, context);
    }
    return createBrowserRouter(routes, { basename });
  }, [isSSR, context, basename]);

  if (isSSR) {
    return <StaticRouterProvider router={router} context={context} />;
  }

  return <RouterProvider router={router} />;
}
