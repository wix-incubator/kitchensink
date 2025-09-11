import FeedPage from '@/components/blog/FeedPage';
import BlogCategoriesSection from '@/components/blog/BlogCategoriesSection';
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
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <BlogCategoriesSection
            pathname={location.pathname}
            categoryPageBaseUrl="/react-router-blog/category/"
            blogCategoriesServiceConfig={blogCategoriesServiceConfig}
            allPostsConfig={{
              label: 'All posts',
              href: '/react-router-blog',
              description:
                'Discover the latest insights, tutorials, and best practices for building modern web applications with headless components.',
            }}
          />
          <FeedPage
            blogFeedServiceConfig={blogFeedServiceConfig}
            postPageBaseUrl="/react-router-blog/"
            categoryPageBaseUrl="/react-router-blog/category/"
            dateLocale="en-US"
          />
        </div>
      </div>
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
