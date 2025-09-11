import FeedPage from '@/components/blog/FeedPage';
import BlogCategoriesSection from '@/components/blog/BlogCategoriesSection';
import {
  loadBlogCategoriesServiceConfig,
  loadBlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import React from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';

// Main Route Component
export function BlogIndexRoute() {
  const { blogFeedServiceConfig, blogCategoriesServiceConfig } =
    useLoaderData<typeof blogIndexRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading blog...</div>}>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <BlogCategoriesSection
            pathname={location.pathname}
            categoryPageBaseUrl="/category/"
            blogCategoriesServiceConfig={blogCategoriesServiceConfig}
            allPostsConfig={{
              label: 'All posts',
              href: '/',
              description:
                'Discover the latest insights, tutorials, and best practices for building modern web applications with headless components.',
            }}
          />
          <FeedPage
            blogFeedServiceConfig={blogFeedServiceConfig}
            postPageBaseUrl="/"
            categoryPageBaseUrl="/category/"
            dateLocale="en-US"
          />
        </div>
      </div>
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
