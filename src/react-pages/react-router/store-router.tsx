import { Navigate, createBrowserRouter, Outlet } from 'react-router-dom';
import { RouterProvider } from 'react-router/dom';
import {
  type StaticHandlerContext,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';

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
  return (
    <div id="react-router-root">
      {import.meta.env.SSR ? (
        <StaticRouterProvider
          router={createStaticRouter(routes, context)}
          context={context}
        />
      ) : (
        <RouterProvider router={createBrowserRouter(routes, { basename })} />
      )}
    </div>
  );
}
