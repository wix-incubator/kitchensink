import { useState } from 'react';
import {
  BlogPostService,
  type BlogPostServiceConfig,
  BlogFeedService,
  type BlogFeedServiceConfig,
} from '@wix/headless-blog/services';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import {
  BlogPostServiceDefinition,
  BlogFeedServiceDefinition,
} from '@wix/headless-blog/services';
import { Blog } from '@wix/headless-blog/react';
import { BlogPostCardEditorial } from '@/components/blog/BlogPostCard';

import '@wix/headless-blog/react/styles.css';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ShareUrl from '@/components/blog/ShareUrl';
import PostCategories from '@/components/blog/PostCategories';
import { KitchensinkLayout } from '@/layouts/KitchensinkLayout';
import { useNavigation } from '@/components/NavigationContext';

interface BlogPostPageProps {
  blogPostServiceConfig: BlogPostServiceConfig;
  recentPostsServiceConfig: BlogFeedServiceConfig;
  href: string;
  feedPageHref: string;
  postPageBaseUrl: string;
  categoryPageBaseUrl: string;
  dateLocale: string;
}

export default function BlogPostPage({
  blogPostServiceConfig,
  recentPostsServiceConfig,
  href,
  feedPageHref,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: BlogPostPageProps) {
  const Navigation = useNavigation();
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap()
        .addService(
          BlogPostServiceDefinition,
          BlogPostService,
          blogPostServiceConfig
        )
        .addService(
          BlogFeedServiceDefinition,
          BlogFeedService,
          recentPostsServiceConfig
        )
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <div className="min-h-screen bg-background">
        <div className="px-6 py-12 space-y-14">
          <div className="max-w-3xl mx-auto">
            <Blog.Post.Root
              emptyState={
                <div className="bg-surface-card border border-border-card rounded-xl p-6 shadow-sm text-center py-12">
                  <p className="text-content-muted">Post not found</p>
                </div>
              }
            >
              <article className="space-y-4">
                <header className="mb-8 space-y-6">
                  <Button
                    asChild
                    variant="outline"
                    className="inline-flex items-center gap-2"
                  >
                    <Navigation route={feedPageHref}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Blog
                    </Navigation>
                  </Button>

                  <PostCategories
                    className="mb-4"
                    baseUrl={categoryPageBaseUrl}
                  />

                  <Blog.Post.Title className="-mt-1 text-3xl tracking-tight md:text-5xl font-bold text-content-primary leading-tight " />

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-content-secondary [&>*:not(:first-child)]:before:content-['•'] [&>*:not(:first-child)]:before:mr-2">
                      <div className="flex items-center gap-2">
                        <Blog.Post.AuthorAvatar className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-primary" />
                        <Blog.Post.AuthorName />
                      </div>
                      <Blog.Post.PublishDate locale="en-US" />
                      <Blog.Post.ReadingTime asChild>
                        {({ readingTime }) => (
                          <span>{readingTime} min read</span>
                        )}
                      </Blog.Post.ReadingTime>
                    </div>
                  </div>
                </header>
                <Blog.Post.Content
                  customStyles={{
                    h1: {
                      color: 'var(--color-foreground)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--text-5xl)',
                    },
                    h2: {
                      color: 'var(--color-foreground)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--text-4xl)',
                    },
                    h3: {
                      color: 'var(--color-foreground)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--text-3xl)',
                    },
                    h4: {
                      color: 'var(--color-foreground)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--text-2xl)',
                    },
                    h5: {
                      color: 'var(--color-foreground)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--text-xl)',
                    },
                    h6: {
                      color: 'var(--color-foreground)',
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: 'var(--text-lg)',
                    },
                    p: {
                      color: 'var(--color-foreground)',
                      fontSize: 'var(--text-lg)',
                    },
                    quote: {
                      color: 'var(--color-foreground)',
                    },
                    codeBlock: {
                      color: 'var(--color-foreground)',
                    },
                    audio: {
                      titleColor: 'var(--color-foreground)',
                      subtitleColor: 'var(--color-foreground)',
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      actionColor: 'var(--color-foreground)',
                      actionTextColor: 'var(--color-background)',
                    },
                    table: {
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                    },
                  }}
                />

                <Blog.Post.TagItems className="flex flex-wrap gap-2">
                  <Blog.Post.TagItemRepeater>
                    <Blog.Tag.Label className="px-3 rounded-full text-sm leading-relaxed text-foreground border border-surface-subtle" />
                  </Blog.Post.TagItemRepeater>
                </Blog.Post.TagItems>
                {/* Social Sharing */}
                <section>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <ShareUrl.X href={href}>
                        {({ url }) => (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild variant="ghost" size="icon">
                                <a
                                  href={url}
                                  target="_blank"
                                  title="Share on X"
                                  rel="noopener noreferrer"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                  </svg>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share on X</TooltipContent>
                          </Tooltip>
                        )}
                      </ShareUrl.X>

                      <ShareUrl.Facebook href={href}>
                        {({ url }) => (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild variant="ghost" size="icon">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Share on Facebook"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                  </svg>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share on Facebook</TooltipContent>
                          </Tooltip>
                        )}
                      </ShareUrl.Facebook>

                      <ShareUrl.LinkedIn href={href}>
                        {({ url }) => (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild variant="ghost" size="icon">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Share on LinkedIn"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                  </svg>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share on LinkedIn</TooltipContent>
                          </Tooltip>
                        )}
                      </ShareUrl.LinkedIn>

                      <ShareUrl.Clipboard href={href}>
                        {({ copyToClipboard, isCopied }) => (
                          <>
                            <Tooltip open={isCopied || undefined}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Copy Link"
                                  onClick={copyToClipboard}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 17 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.2 14.0935C4.4 14.8935 3.1 14.8935 2.3 14.0935C1.5 13.2935 1.5 11.9935 2.3 11.1935L5.6 7.89353C6.4 7.09353 7.7 7.09353 8.5 7.89353C8.8 8.19353 9.4 8.19353 9.7 7.89353C10 7.59353 10 6.99353 9.7 6.69353C8.2 5.19353 5.8 5.19353 4.4 6.69353L1.1 9.99353C0.4 10.6935 0 11.5935 0 12.5935C0 13.5935 0.4 14.5935 1.1 15.2935C1.8 15.9935 2.8 16.3935 3.8 16.3935C4.8 16.3935 5.7 15.9935 6.5 15.2935L8.2 13.5935C8.5 13.2935 8.5 12.6935 8.2 12.3935C7.8 12.0935 7.2 12.0935 6.9 12.3935L5.2 14.0935ZM9.6 1.49353L7.9 3.19353C7.6 3.49353 7.6 4.09353 7.9 4.39353C8.2 4.69353 8.8 4.69353 9.1 4.39353L10.8 2.69353C11.6 1.89353 12.9 1.89353 13.7 2.69353C14.5 3.49353 14.5 4.79353 13.7 5.59353L10.4 8.89353C9.6 9.69353 8.3 9.69353 7.5 8.89353C7.2 8.59353 6.6 8.59353 6.3 8.89353C6 9.19353 6 9.79353 6.3 10.0935C7 10.7935 8 11.1935 9 11.1935C10 11.1935 10.9 10.7935 11.7 10.0935L15 6.79353C16.4 5.39353 16.4 2.99353 14.9 1.49353C13.4 -0.00646973 11 -0.00646973 9.6 1.49353Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isCopied ? 'Copied!' : 'Copy Link'}
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </ShareUrl.Clipboard>
                    </TooltipProvider>
                  </div>
                </section>
              </article>
            </Blog.Post.Root>
          </div>
          <Blog.Feed.Root>
            <Blog.Feed.PostItems>
              <section className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-2xl font-semibold leading-tight text-content-primary">
                  Recent posts
                </h3>

                <hr className="border-surface-primary" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Blog.Feed.PostItemRepeater>
                    <BlogPostCardEditorial
                      postPageBaseUrl={postPageBaseUrl}
                      categoryPageBaseUrl={categoryPageBaseUrl}
                      dateLocale={dateLocale}
                    />
                  </Blog.Feed.PostItemRepeater>
                </div>
              </section>
            </Blog.Feed.PostItems>
          </Blog.Feed.Root>
        </div>
      </div>
    </ServicesManagerProvider>
  );
}
