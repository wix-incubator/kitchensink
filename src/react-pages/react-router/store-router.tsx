import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from 'react-router-dom';

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

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/store" />,
    },
    {
      element: (
        <WixServicesProvider>
          <MiniCart
            // cartIcon={... optionally use your own icon...}
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
  ],
  {
    basename: '/react-router',
  }
);

export default function ReactRouterApp() {
  return <RouterProvider router={router} />;
}
