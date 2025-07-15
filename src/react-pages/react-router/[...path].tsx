import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from 'react-router-dom';
import '../../styles/theme-wix-vibe.css';

// Import route components and loaders
import { RootRoute, rootRouteLoader } from './routes/root';
import {
  ProductDetailsRoute,
  productRouteLoader,
} from './routes/product-details';
import {
  StoreCollectionRoute,
  storeCollectionRouteLoader,
} from './routes/store-collection';
import { defaultStoreCollectionRouteRedirectLoader } from './routes/store-redirect';
import Cart from '../../components/ecom/Cart';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/store" />,
    },
    {
      element: (
        <RootRoute>
          <Outlet />
        </RootRoute>
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
          element: (
            <StoreCollectionRoute
              productPageRoute="/products"
              storeRoute="/store"
            />
          ),
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
