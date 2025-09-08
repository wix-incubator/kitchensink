import {
  BlogFeedPostCardSideBySide,
  BlogFeedPostCardEditorial,
} from '@/components/blog/BlogFeedPostCard';
import BlogFeedCategoriesSection from '@/components/blog/BlogFeedCategoriesSection';
import { BlogFeed } from '@wix/headless-blog/react';
import {
  BlogCategoriesService,
  BlogCategoriesServiceDefinition,
  BlogFeedService,
  BlogFeedServiceDefinition,
  type BlogCategoriesServiceConfig,
  type BlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { useState } from 'react';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';

import { Button } from '@/components/ui/button';

interface BlogFeedPageProps {
  pathname: string;
  blogFeedServiceConfig: BlogFeedServiceConfig;
  blogCategoriesServiceConfig: BlogCategoriesServiceConfig;
  feedPageHref: string;
  postPageBaseUrl: string;
  categoryPageBaseUrl: string;
  dateLocale: string;
}

export default function BlogFeedPage({
  pathname,
  blogFeedServiceConfig,
  blogCategoriesServiceConfig,
  feedPageHref,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: BlogFeedPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap()
        .addService(
          BlogFeedServiceDefinition,
          BlogFeedService,
          blogFeedServiceConfig
        )
        .addService(
          BlogCategoriesServiceDefinition,
          BlogCategoriesService,
          blogCategoriesServiceConfig
        )
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <KitchensinkLayout>
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {' '}
                Headless Components Blog
              </h1>
            </div>

            <BlogFeedCategoriesSection
              pathname={pathname}
              baseUrl={categoryPageBaseUrl}
              allPostsConfig={{
                label: 'All posts',
                href: feedPageHref,
                description:
                  'Discover the latest insights, tutorials, and best practices for building modern web applications with headless components.',
              }}
            />
            <BlogFeed.Sort className="mb-4 text-content-primary" />
            <BlogFeed.Root>
              <BlogFeed.Posts
                className="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
                emptyState={
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-content-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-content-primary mb-4">
                      No Posts Found
                    </h3>
                    <p className="text-content-muted">
                      There are no blog posts available at the moment. Check
                      back later for new content!
                    </p>
                  </div>
                }
              >
                <BlogFeed.PostRepeater>
                  <DynamicBlogFeedPostCard
                    postPageBaseUrl={postPageBaseUrl}
                    categoryPageBaseUrl={categoryPageBaseUrl}
                    dateLocale={dateLocale}
                  />
                </BlogFeed.PostRepeater>

                {/* Load More Button */}
                <div className="col-span-full text-center mt-12">
                  <BlogFeed.LoadMore asChild>
                    {({ isLoading, loadNextPage }) => {
                      return (
                        <Button
                          onClick={loadNextPage}
                          variant="outline"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                              Loading...
                            </>
                          ) : (
                            <>Load More Posts</>
                          )}
                        </Button>
                      );
                    }}
                  </BlogFeed.LoadMore>
                </div>
              </BlogFeed.Posts>
            </BlogFeed.Root>
          </div>
        </div>
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}

function DynamicBlogFeedPostCard({
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: {
  postPageBaseUrl: string;
  categoryPageBaseUrl: string;
  dateLocale: string;
}) {
  const { index, amount } = BlogFeed.useFeedPostRepeaterContext();

  if (index === 0 && amount > 3) {
    return (
      <BlogFeedPostCardSideBySide
        className="col-span-full"
        dateLocale={dateLocale}
        postPageBaseUrl={postPageBaseUrl}
        categoryPageBaseUrl={categoryPageBaseUrl}
        readMoreText="Read more"
        showReadingTime
      />
    );
  }

  return (
    <BlogFeedPostCardEditorial
      dateLocale={dateLocale}
      postPageBaseUrl={postPageBaseUrl}
      categoryPageBaseUrl={categoryPageBaseUrl}
      readMoreText="Read more"
    />
  );
}
