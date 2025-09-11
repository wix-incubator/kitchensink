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
import { useState } from 'react';
import { Blog } from '@wix/headless-blog/react';
import { BlogFeedCardEditorial } from './BlogFeedCard';
import { Separator } from '../ui/separator';

import '@wix/headless-blog/react/styles.css';

interface RecentPostsSectionProps {
  /** Loaded result of `loadBlogFeedServiceConfig`, to be used for the recent posts section */
  recentPostsServiceConfig: BlogFeedServiceConfig;
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

export default function RecentPostsSection({
  recentPostsServiceConfig,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: RecentPostsSectionProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        BlogFeedServiceDefinition,
        BlogFeedService,
        recentPostsServiceConfig
      )
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <Blog.Feed.Root>
        <Blog.Feed.PostItems>
          <section className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl font-semibold leading-tight text-content-primary">
              Recent posts
            </h3>

            <Separator />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Blog.Feed.PostItemRepeater>
                <BlogFeedCardEditorial
                  postPageBaseUrl={postPageBaseUrl}
                  categoryPageBaseUrl={categoryPageBaseUrl}
                  dateLocale={dateLocale}
                />
              </Blog.Feed.PostItemRepeater>
            </div>
          </section>
        </Blog.Feed.PostItems>
      </Blog.Feed.Root>
    </ServicesManagerProvider>
  );
}
