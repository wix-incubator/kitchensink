import {
  loadBlogFeedServiceConfig,
  loadBlogPostServiceConfig,
} from '@wix/headless-blog/services';
import React from 'react';

import { useLoaderData, useLocation } from 'react-router-dom';
import PostPage from '@/components/blog/PostPage';
import RecentPostsSection from '@/components/blog/RecentPostsSection';

// Main Route Component
export function BlogPostRoute() {
  const { blogPostServiceConfig, recentPostsServiceConfig } =
    useLoaderData<typeof blogPostRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading blog post...</div>}>
      <div className="min-h-screen bg-background">
        <div className="px-6 py-12 space-y-14">
          <div className="max-w-3xl mx-auto">
            <PostPage
              blogPostServiceConfig={blogPostServiceConfig}
              href={location.pathname}
              feedPageHref="/react-router-blog"
              categoryPageBaseUrl="/react-router-blog/category/"
              dateLocale="en-US"
            />
          </div>
          <RecentPostsSection
            recentPostsServiceConfig={recentPostsServiceConfig}
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
export async function blogPostRouteLoader({
  params,
}: {
  params: { slug?: string };
}) {
  const { slug } = params;

  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const blogPostServiceConfigResult = await loadBlogPostServiceConfig({
    postSlug: slug,
  });

  if (blogPostServiceConfigResult.type === 'notFound') {
    throw new Response('Not Found', { status: 404 });
  }

  const blogPostServiceConfig = blogPostServiceConfigResult.config;

  const [recentPostsServiceConfig] = await Promise.all([
    loadBlogFeedServiceConfig({
      pageSize: 3,
      sort: [{ fieldName: 'firstPublishedDate', order: 'DESC' }],
      postIds: blogPostServiceConfig.post.relatedPostIds,
      excludePostIds: [blogPostServiceConfig.post._id],
    }),
  ]);

  return {
    blogPostServiceConfig,
    recentPostsServiceConfig,
  };
}
