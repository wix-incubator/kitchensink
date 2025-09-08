import {
  loadBlogFeedServiceConfig,
  loadBlogPostServiceConfig,
} from '@wix/headless-blog/services';
import React from 'react';

import { useLoaderData, useLocation } from 'react-router-dom';
import BlogPostPage from '../../../react-pages/blog/post-page';

// Main Route Component
export function BlogPostRoute() {
  const { blogPostServiceConfig, recentPostsServiceConfig } =
    useLoaderData<typeof blogPostRouteLoader>();
  const location = useLocation();

  return (
    <React.Suspense fallback={<div>Loading blog post...</div>}>
      <BlogPostPage
        blogPostServiceConfig={blogPostServiceConfig}
        recentPostsServiceConfig={recentPostsServiceConfig}
        href={location.pathname}
        feedPageHref="/react-router-blog"
        postPageBaseUrl="/react-router-blog/"
        categoryPageBaseUrl="/react-router-blog/category/"
        dateLocale="en-US"
      />
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
