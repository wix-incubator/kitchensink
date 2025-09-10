import FeedPage from '@/components/blog/FeedPage';
import {
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import React from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';

// Main Route Component
export function BlogCategoryRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogCategoryRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading category...</div>}>
      <FeedPage
        pathname={location.pathname}
        blogFeedServiceConfig={blogFeedServiceConfig}
        blogCategoriesServiceConfig={blogCategoriesServiceConfig}
        feedPageHref="/react-router-blog"
        postPageBaseUrl="/react-router-blog/"
        categoryPageBaseUrl="/react-router-blog/category/"
        dateLocale="en-US"
      />
    </React.Suspense>
  );
}

// Route Loader
export async function blogCategoryRouteLoader({
  params,
}: {
  params: { slug?: string };
}) {
  const { slug } = params;

  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  try {
    const [blogFeedServiceConfig, blogCategoriesServiceConfig] =
      await Promise.all([
        loadBlogFeedServiceConfig({
          categorySlug: slug,
          pageSize: 10,
          sort: [
            {
              fieldName: 'firstPublishedDate',
              order: 'DESC',
            },
          ],
        }),
        loadBlogCategoriesServiceConfig(),
      ]);

    return {
      blogFeedServiceConfig,
      blogCategoriesServiceConfig,
    };
  } catch (error) {
    // If category not found, throw 404
    throw new Response('Not Found', { status: 404 });
  }
}
