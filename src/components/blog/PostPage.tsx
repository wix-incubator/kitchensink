import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { Blog } from '@wix/headless-blog/react';
import {
  BlogPostService,
  BlogPostServiceDefinition,
  type BlogFeedServiceConfig,
  type BlogPostServiceConfig,
} from '@wix/headless-blog/services';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { useState } from 'react';
import { useNavigation } from '../NavigationContext';
import { Chip } from '../ui/blog/Chip';
import { EmptyState } from '../ui/blog/EmptyState';
import { PostContent } from '../ui/blog/PostContent';
import { PostMeta } from '../ui/blog/PostMeta';
import { PostTitle } from '../ui/blog/PostTitle';
import { Button } from '../ui/button';
import PostCategories from './PostCategories';
import SharePostActions from './SharePostActions';

import '@wix/headless-blog/react/styles.css';

interface PostPageProps {
  /** Loaded result of `loadBlogPostServiceConfig` */
  blogPostServiceConfig: BlogPostServiceConfig;
  /** Full href of the post page, used for social sharing */
  href: string;
  /** The href of the feed page, used for the "Back to Blog" link */
  feedPageHref: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

export default function PostPage({
  blogPostServiceConfig,
  href,
  feedPageHref,
  categoryPageBaseUrl,
  dateLocale,
}: PostPageProps) {
  const Navigation = useNavigation();
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        BlogPostServiceDefinition,
        BlogPostService,
        blogPostServiceConfig
      )
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <Blog.Post.Root emptyState={<EmptyState title="Post not found" />}>
        <article className="space-y-4">
          <header className="mb-8 space-y-6">
            <Button asChild variant="outline">
              <Navigation route={feedPageHref}>
                <ChevronLeftIcon strokeWidth={2} className="w-4 h-4" />
                Back to Blog
              </Navigation>
            </Button>

            <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />

            <PostTitle variant="xl" />

            <PostMeta
              showAuthor
              showAuthorAvatar
              showPublishDate
              showReadingTime
              dateLocale={dateLocale}
              avatarSize="md"
            />
          </header>
          <PostContent />

          <Blog.Post.TagItems className="flex flex-wrap gap-2">
            <Blog.Post.TagItemRepeater>
              <Chip asChild>
                <Blog.Tag.Label />
              </Chip>
            </Blog.Post.TagItemRepeater>
          </Blog.Post.TagItems>
          <section>
            <SharePostActions href={href} />
          </section>
        </article>
      </Blog.Post.Root>
    </ServicesManagerProvider>
  );
}
