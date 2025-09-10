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
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../ui/blog/EmptyState';
import { Button } from '../ui/button';
import { BlogFeedCardEditorial, BlogFeedCardSideBySide } from './BlogFeedCard';
import BlogFeedCategoriesSection from './BlogFeedCategoriesSection';

interface FeedPageProps {
  /** The pathname of the current page */
  pathname: string;
  /** Loaded result of `loadBlogFeedServiceConfig` */
  blogFeedServiceConfig: BlogFeedServiceConfig;
  /** Loaded result of `loadBlogCategoriesServiceConfig` */
  blogCategoriesServiceConfig: BlogCategoriesServiceConfig;
  /** The href of the feed page, used for the "All posts" link */
  feedPageHref: string;
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

export default function FeedPage({
  pathname,
  blogFeedServiceConfig,
  blogCategoriesServiceConfig,
  feedPageHref,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: FeedPageProps) {
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
                    <>
                      <Loader2Icon className="animate-spin" />
                      Loading...
                    </>
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
