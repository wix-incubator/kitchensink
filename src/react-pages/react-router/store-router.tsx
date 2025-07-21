import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from 'react-router-dom';

// Import route components and loaders
import {
  MiniCartLayout,
  rootRouteLoader,
  WixServicesProvider,
} from './routes/root';
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
import '../../styles/theme-wix-vibe-vars.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/store" />,
    },
    {
      element: (
        <WixServicesProvider>
          {/* A layout that includes the mini cart icon and the cart content, the cart icon is on the top right of the page */}
          <MiniCartLayout
            showMiniCart={true} // pass false to hide the mini cart
            // cartIcon={... optionally use your own icon...}
          >
            <Outlet />
          </MiniCartLayout>
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
