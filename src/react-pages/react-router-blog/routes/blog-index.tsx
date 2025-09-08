import {
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import React from 'react';

import { useLoaderData, useLocation } from 'react-router-dom';
import BlogFeedPage from '../../blog/feed-page';

// Main Route Component
export function BlogIndexRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogIndexRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading blog...</div>}>
      <BlogFeedPage
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
export async function blogIndexRouteLoader() {
  const [blogFeedServiceConfig, blogCategoriesServiceConfig] =
    await Promise.all([
      loadBlogFeedServiceConfig({
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
}
