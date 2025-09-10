import {
  BlogFeedCardEditorial,
  BlogFeedCardSideBySide,
} from '@/components/blog/BlogFeedCard';
import BlogFeedCategoriesSection from '@/components/blog/BlogFeedCategoriesSection';
import { EmptyState } from '@/components/ui/blog/EmptyState';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Blog } from '@wix/headless-blog/react';
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
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
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
          <Blog.Feed.Sort className="mb-4 text-content-primary" />
          <Blog.Feed.Root>
            <Blog.Feed.PostItems
              className="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
              emptyState={
                <EmptyState
                  title="No Posts Found"
                  subtitle="There are no blog posts available at the moment. Check back later for new content!"
                />
              }
            >
              <Blog.Feed.PostItemRepeater offset={0} limit={1}>
                <BlogFeedCardSideBySide
                  className="col-span-full"
                  dateLocale={dateLocale}
                  postPageBaseUrl={postPageBaseUrl}
                  categoryPageBaseUrl={categoryPageBaseUrl}
                  readMoreText="Read more"
                  showReadingTime
                />
              </Blog.Feed.PostItemRepeater>
              <Blog.Feed.PostItemRepeater offset={1}>
                <BlogFeedCardEditorial
                  dateLocale={dateLocale}
                  postPageBaseUrl={postPageBaseUrl}
                  categoryPageBaseUrl={categoryPageBaseUrl}
                  readMoreText="Read more"
                  showReadingTime
                />
              </Blog.Feed.PostItemRepeater>

              {/* Load More Button */}
              <div className="col-span-full text-center mt-12">
                <Blog.Feed.LoadMore
                  asChild
                  loading={
                    <LoadingSpinner
                      className="min-h-auto"
                      innerClassName="space-x-3"
                      spinnerClassName="w-4 h-4"
                      messageClassName="text-sm"
                    />
                  }
                >
                  <Button variant="outline">Load More Posts</Button>
                </Blog.Feed.LoadMore>
              </div>
            </Blog.Feed.PostItems>
          </Blog.Feed.Root>
        </div>
      </div>
    </ServicesManagerProvider>
  );
}
