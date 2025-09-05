import React, { useState } from 'react';
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
import '../../styles/theme-dark.css';

interface BlogPostPageProps {
  blogPostServiceConfig: BlogPostServiceConfig;
  recentPostsServiceConfig: BlogFeedServiceConfig;
  href: string;
}

export default function BlogPostPage({
  blogPostServiceConfig,
  recentPostsServiceConfig,
  href,
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
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            {/* Back to Blog */}
            <div>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 hover:underline transition-colors"
              >
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
            </div>
            <BlogPost.Root
              emptyState={
                <div className="bg-surface-card border border-border-card rounded-xl p-6 shadow-sm text-center py-12">
                  <p className="text-content-muted">Post not found</p>
                </div>
              }
            >
              <article className="space-y-4">
                <header className="mb-8">
                  <BlogPost.Categories className="mb-4 flex flex-wrap gap-2">
                    <BlogPost.CategoryRepeater>
                      <BlogPost.CategoryLink
                        baseUrl="/blog/category/"
                        className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
                        style={{
                          backgroundColor: 'var(--theme-bg-info-10)',
                          color: 'var(--theme-text-info)',
                          borderColor: 'var(--theme-border-info-20)',
                          borderWidth: '1px',
                        }}
                      />
                    </BlogPost.CategoryRepeater>
                  </BlogPost.Categories>

                  <BlogPost.Title className="text-4xl md:text-5xl font-bold text-content-primary leading-tight mb-4" />

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BlogPost.AuthorAvatar
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--theme-gradient-primary)' }}
                      />
                      <BlogPost.AuthorName className="text-content-secondary" />
                      <BlogPost.PublishDate
                        className="text-content-muted"
                        locale="en-US"
                      />
                      <BlogPost.ReadingTime asChild>
                        {({ readingTime }) => (
                          <span className="text-content-muted">
                            {readingTime} min read
                          </span>
                        )}
                      </BlogPost.ReadingTime>
                    </div>
                  </div>
                </header>
                <BlogPost.Content />

                <BlogPost.Tags className="flex flex-wrap gap-2">
                  <BlogPost.TagRepeater>
                    <BlogPost.Tag
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--theme-bg-accent-20)',
                        color: 'var(--theme-text-accent)',
                        borderColor: 'var(--theme-border-accent-20)',
                        borderWidth: '1px',
                      }}
                    />
                  </BlogPost.TagRepeater>
                </BlogPost.Tags>
                {/* Social Sharing */}
                <section>
                  <h3 className="text-lg font-semibold text-content-primary mb-4">
                    Share this post
                  </h3>
                  <div className="flex gap-4">
                    <BlogPost.ShareUrlToX href={href}>
                      {({ url }) => (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
                          style={{
                            backgroundColor: 'var(--theme-bg-social-x)',
                            color: 'var(--theme-text-social-x)',
                            borderColor: 'var(--theme-border-social-subtle)',
                            borderWidth: '1px',
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Share on X
                        </a>
                      )}
                    </BlogPost.ShareUrlToX>

                    <BlogPost.ShareUrlToFacebook href={href}>
                      {({ url }) => (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
                          style={{
                            backgroundColor: 'var(--theme-bg-social-facebook)',
                            color: 'var(--theme-text-social-facebook)',
                            borderColor: 'var(--theme-border-social-subtle)',
                            borderWidth: '1px',
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Share on Facebook
                        </a>
                      )}
                    </BlogPost.ShareUrlToFacebook>

                    <BlogPost.ShareUrlToLinkedIn href={href}>
                      {({ url }) => (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
                          style={{
                            backgroundColor: 'var(--theme-bg-social-linkedin)',
                            color: 'var(--theme-text-social-linkedin)',
                            borderColor: 'var(--theme-border-social-subtle)',
                            borderWidth: '1px',
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          Share on LinkedIn
                        </a>
                      )}
                    </BlogPost.ShareUrlToLinkedIn>
                  </div>
                </section>
              </article>
            </BlogPost.Root>
            <BlogFeed.Root>
              <BlogFeed.Posts>
                <section>
                  <h3 className="text-2xl font-semibold text-content-primary mb-6">
                    Recent posts
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BlogFeed.PostRepeater>
                      <BlogFeed.PostLink
                        baseUrl="/blog"
                        className="bg-surface-card border border-border-card rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hover:scale-105 h-full flex flex-col"
                      >
                        <BlogFeed.PostCoverImage className="w-full aspect-video object-cover rounded-xl mb-3" />

                        <div className="flex-1 flex flex-col">
                          <BlogFeed.PostTitle className="text-lg font-semibold text-content-primary mb-2 line-clamp-2" />
                          <BlogFeed.PostExcerpt className="text-content-secondary text-sm line-clamp-3 flex-1" />
                          <div className="mt-3 pt-3 flex items-center gap-2 text-xs text-content-muted">
                            <BlogFeed.PostPublishDate locale="en-US" />
                            <span>•</span>
                            <BlogFeed.PostReadingTime asChild>
                              {({ readingTime }) => (
                                <span>{readingTime} min read</span>
                              )}
                            </BlogFeed.PostReadingTime>
                          </div>
                        </div>
                      </BlogFeed.PostLink>
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
