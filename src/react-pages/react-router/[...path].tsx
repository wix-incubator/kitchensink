import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  rootRouteDefinition,
  productDetailsRouteDefinition,
  storeCollectionRouteDefinition,
  storeRedirectRouteDefinition,
  cartRouteDefinition,
} from './routes/index';
import '../../styles/theme-1.css'; // TODO: probaby needs fixing?
import '../../styles/theme-wix-vibe.css';

const router = createBrowserRouter(
  [
    {
      ...rootRouteDefinition,
      children: [
        productDetailsRouteDefinition,
        storeRedirectRouteDefinition,
        storeCollectionRouteDefinition,
        cartRouteDefinition,
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
