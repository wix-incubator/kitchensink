import { EmptyState } from '@/components/ui/blog/EmptyState';
import { Button } from '@/components/ui/button';
import { Blog } from '@wix/headless-blog/react';
import {
  BlogFeedService,
  BlogFeedServiceDefinition,
  type BlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { BlogFeedCardEditorial, BlogFeedCardSideBySide } from './BlogFeedCard';

interface FeedPageProps {
  /** Loaded result of `loadBlogFeedServiceConfig` */
  blogFeedServiceConfig: BlogFeedServiceConfig;
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

export default function FeedPage({
  blogFeedServiceConfig,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: FeedPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        BlogFeedServiceDefinition,
        BlogFeedService,
        blogFeedServiceConfig
      )
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <Blog.Feed.Root>
        <Blog.Feed.Sort className="mb-4 text-content-primary" />
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
    </ServicesManagerProvider>
  );
}
