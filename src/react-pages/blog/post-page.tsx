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
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import { BlogPost, BlogFeed } from '@wix/headless-blog/react';
import { BlogFeedPostCardEditorial } from '@/components/blog/BlogFeedPostCard';

import '@wix/headless-blog/react/styles.css';

import { Button } from '@/components/ui/button';

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
      <KitchensinkLayout>
        <div className="min-h-screen bg-background">
          <div className="px-6 py-12 space-y-14">
            <div className="max-w-3xl mx-auto">
              <BlogPost.Root
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
                      <a href={feedPageHref}>
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
                      </a>
                    </Button>

                    <BlogPost.Categories className="mb-4 flex flex-wrap gap-2">
                      <BlogPost.CategoryRepeater>
                        <BlogPost.CategoryLink
                          baseUrl={categoryPageBaseUrl}
                          className="border border-surface-strong text-foreground px-3 py-1 rounded-full leading-tight text-sm font-medium"
                        />
                      </BlogPost.CategoryRepeater>
                    </BlogPost.Categories>

                    <BlogPost.Title className="-mt-1 text-3xl tracking-tight md:text-5xl font-bold text-content-primary leading-tight " />

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-content-secondary [&>*:not(:first-child)]:before:content-['•'] [&>*:not(:first-child)]:before:mr-2">
                        <div className="flex items-center gap-2">
                          <BlogPost.AuthorAvatar className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-primary" />
                          <BlogPost.AuthorName />
                        </div>
                        <BlogPost.PublishDate locale="en-US" />
                        <BlogPost.ReadingTime asChild>
                          {({ readingTime }) => (
                            <span>{readingTime} min read</span>
                          )}
                        </BlogPost.ReadingTime>
                      </div>
                    </div>
                  </header>
                  <BlogPost.Content
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

                  <BlogPost.Tags className="flex flex-wrap gap-2">
                    <BlogPost.TagRepeater>
                      <BlogPost.Tag className="px-3 rounded-full text-sm leading-relaxed text-foreground border border-surface-subtle" />
                    </BlogPost.TagRepeater>
                  </BlogPost.Tags>
                  {/* Social Sharing */}
                  <section>
                    <div className="flex gap-2">
                      <BlogPost.ShareUrlToX href={href}>
                        {({ url }) => (
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
                        )}
                      </BlogPost.ShareUrlToX>

                      <BlogPost.ShareUrlToFacebook href={href}>
                        {({ url }) => (
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
                        )}
                      </BlogPost.ShareUrlToFacebook>

                      <BlogPost.ShareUrlToLinkedIn href={href}>
                        {({ url }) => (
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
                        )}
                      </BlogPost.ShareUrlToLinkedIn>
                    </div>
                  </section>
                </article>
              </BlogPost.Root>
            </div>
            <BlogFeed.Root>
              <BlogFeed.Posts>
                <section className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-2xl font-semibold leading-tight text-content-primary">
                    Recent posts
                  </h3>

                  <hr className="border-surface-primary" />

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BlogFeed.PostRepeater>
                      <BlogFeedPostCardEditorial
                        postPageBaseUrl={postPageBaseUrl}
                        categoryPageBaseUrl={categoryPageBaseUrl}
                        dateLocale={dateLocale}
                      />
                    </BlogFeed.PostRepeater>
                  </div>
                </section>
              </BlogFeed.Posts>
            </BlogFeed.Root>
          </div>
        </div>
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}
