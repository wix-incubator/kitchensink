import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from 'react-router-dom';

// Import route components and loaders
import { rootRouteLoader, WixServicesProvider } from './routes/root';
import { BlogIndexRoute, blogIndexRouteLoader } from './routes/blog-index';
import { BlogPostRoute, blogPostRouteLoader } from './routes/blog-post';
import {
  BlogCategoryRoute,
  blogCategoryRouteLoader,
} from './routes/blog-category';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/" />,
    },
    {
      element: (
        <WixServicesProvider>
          <Outlet />
        </WixServicesProvider>
      ),
      loader: rootRouteLoader,
      children: [
        {
          path: '/',
          element: <BlogIndexRoute />,
          loader: blogIndexRouteLoader,
          index: true,
        },
        {
          path: '/:slug',
          element: <BlogPostRoute />,
          loader: blogPostRouteLoader,
        },
        {
          path: '/category/:slug',
          element: <BlogCategoryRoute />,
          loader: blogCategoryRouteLoader,
        },
      ],
    },
  ],
  {
    basename: '/react-router-blog',
  }
);

export default function ReactRouterBlogApp() {
  return <RouterProvider router={router} />;
}
