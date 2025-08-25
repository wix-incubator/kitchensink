import { Button } from '@/components/ui/button';
import {
  BlogCategoriesService,
  BlogCategoriesServiceDefinition,
  type BlogCategoriesServiceConfig,
} from '@/headless/blog/services/blog-categories-service';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { useState } from 'react';
import { BlogCategories, BlogFeed } from '../../headless/blog/components';
import {
  BlogFeedService,
  BlogFeedServiceDefinition,
  type BlogFeedServiceConfig,
} from '../../headless/blog/services/blog-feed-service';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import { cn } from '@/lib/utils';

interface BlogFeedPageProps {
  blogFeedConfig: BlogFeedServiceConfig;
  blogCategoriesConfig: BlogCategoriesServiceConfig;
}

export default function BlogFeedPage({
  blogFeedConfig,
  blogCategoriesConfig,
}: BlogFeedPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap()
        .addService(BlogFeedServiceDefinition, BlogFeedService, blogFeedConfig)
        .addService(
          BlogCategoriesServiceDefinition,
          BlogCategoriesService,
          blogCategoriesConfig
        )
    )
  );

  return (
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8 grid gap-8">
            <BlogCategories.Root>
              {({ activeCategory }) => {
                const isInverted = !!activeCategory?.imageUrl;
                return activeCategory ? (
                  <section
                    className={cn(
                      'relative bg-slate-200 overflow-hidden rounded-2xl',
                      { 'text-white': isInverted }
                    )}
                  >
                    {activeCategory?.imageUrl ? (
                      <figure className="absolute inset-0 after:bg-black after:opacity-55 after:absolute after:inset-0">
                        <img
                          src={activeCategory.imageUrl}
                          alt={activeCategory.label || 'Category Image'}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    ) : null}
                    <div className="grid gap-5 text-center place-items-center py-9 isolate">
                      <div className="grid gap-3">
                        <h1 className="text-5xl">{activeCategory.label}</h1>
                        {activeCategory.description ? (
                          <p>{activeCategory.description}</p>
                        ) : null}
                      </div>
                      <BlogCategories.List>
                        {({ categories }) =>
                          categories.length > 1 ? (
                            <div className="flex flex-wrap justify-center gap-4 ">
                              {categories.map(category => (
                                <a
                                  key={category._id}
                                  href={category.href ?? undefined}
                                  className={cn({
                                    'py-2 px-4 rounded-full border-1': true,
                                    'border-transparent': category.active,
                                    'bg-black text-white':
                                      category.active && !isInverted,
                                    'bg-white text-black':
                                      category.active && isInverted,
                                  })}
                                >
                                  {category.label}
                                </a>
                              ))}
                            </div>
                          ) : null
                        }
                      </BlogCategories.List>
                    </div>
                  </section>
                ) : null;
              }}
            </BlogCategories.Root>

            <BlogFeed.Root>
              {() => (
                <>
                  <BlogFeed.Posts>
                    {({
                      posts,
                      isEmpty,
                      hasNextPage,
                      loadNextPage,
                      isLoading,
                    }) => (
                      <>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full">
                          {isEmpty ? (
                            <div className="text-center py-8 col-span-full">
                              <p className="text-content-secondary">
                                No blog posts found.
                              </p>
                            </div>
                          ) : (
                            <>
                              {posts.map((post, i) => (
                                <BlogFeed.Item key={post._id} post={post}>
                                  {({
                                    postId,
                                    slug,
                                    title,
                                    publishDateFormatted: formattedDate,
                                    coverImageUrl,
                                    coverImageAlt,
                                    categories,
                                  }) =>
                                    i === 0 &&
                                    posts.length > 3 &&
                                    coverImageUrl ? (
                                      <article
                                        key={postId}
                                        className="relative col-span-3 grid grid-cols-[1fr_1fr] rounded-xl overflow-hidden"
                                      >
                                        {coverImageUrl && (
                                          <div className="aspect-video bg-surface-secondary relative">
                                            <img
                                              src={coverImageUrl}
                                              alt={coverImageAlt || ''}
                                              className="block absolute inset-0 w-full h-full object-cover "
                                            />
                                          </div>
                                        )}

                                        <div className="bg-zinc-50 flex flex-col gap-4 p-8 grow items-start">
                                          {categories.length > 0 ? (
                                            <div className="flex items-center gap-2 ">
                                              {categories.map(category => (
                                                <span
                                                  key={category._id}
                                                  className="text-xs border border-slate-300 px-2 py-1 rounded-full font-semibold"
                                                >
                                                  {category.label}
                                                </span>
                                              ))}
                                            </div>
                                          ) : null}

                                          <h2 className="text-3xl leading-tight text-balance font-semibold text-content-primary -my-1">
                                            {title}
                                          </h2>

                                          {/* <p className="text-content-secondary text-sm mb-4 line-clamp-3">
                                      {excerpt}
                                    </p> */}

                                          <div className="flex items-center justify-between text-sm text-slate-500">
                                            <div className="flex items-center gap-4">
                                              <span>{formattedDate}</span>
                                            </div>
                                          </div>

                                          <div className="grow"></div>

                                          <a
                                            href={`/blog/post/${slug}`}
                                            className="flex gap-2 items-center bg-black text-white text-base py-2 rounded-lg pl-6 pr-4 after:absolute after:inset-0"
                                          >
                                            Read More
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M3.3335 8H12.6668"
                                                stroke="currentColor"
                                                strokeWidth="1.33333"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                              <path
                                                d="M8 3.33301L12.6667 7.99967L8 12.6663"
                                                stroke="currentColor"
                                                strokeWidth="1.33333"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </a>
                                        </div>
                                      </article>
                                    ) : (
                                      <article
                                        key={postId}
                                        className="relative flex flex-col"
                                      >
                                        {coverImageUrl && (
                                          <div className="aspect-square bg-surface-secondary relative">
                                            <img
                                              src={coverImageUrl}
                                              alt={coverImageAlt || ''}
                                              className="block absolute inset-0 w-full h-full object-cover rounded-lg"
                                            />
                                          </div>
                                        )}

                                        <div className="flex flex-col gap-4 py-6 grow items-start">
                                          <div className="flex items-center gap-2 ">
                                            {categories.map(category => (
                                              <span
                                                key={category._id}
                                                className="text-xs border border-slate-300 px-2 py-1 rounded-full font-semibold"
                                              >
                                                {category.label}
                                              </span>
                                            ))}
                                          </div>

                                          <h2 className="text-3xl font-semibold text-content-primary -my-1">
                                            {title}
                                          </h2>

                                          <div className="flex items-center justify-between text-sm text-slate-500">
                                            <div className="flex items-center gap-4">
                                              <span>{formattedDate}</span>
                                            </div>
                                          </div>

                                          <div className="grow"></div>

                                          <a
                                            href={`/blog/post/${slug}`}
                                            className="flex gap-2 items-center bg-black text-white text-base py-2 rounded-lg pl-6 pr-4 after:absolute after:inset-0"
                                          >
                                            Read More
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M3.3335 8H12.6668"
                                                stroke="currentColor"
                                                strokeWidth="1.33333"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                              <path
                                                d="M8 3.33301L12.6667 7.99967L8 12.6663"
                                                stroke="currentColor"
                                                strokeWidth="1.33333"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </a>
                                        </div>
                                      </article>
                                    )
                                  }
                                </BlogFeed.Item>
                              ))}
                            </>
                          )}
                        </div>
                        {hasNextPage && (
                          <div className="flex justify-center items-center gap-2 mt-8">
                            <Button
                              onClick={loadNextPage}
                              disabled={isLoading}
                              variant="link"
                            >
                              {isLoading ? 'Loading...' : 'Load More'}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </BlogFeed.Posts>
                </>
              )}
            </BlogFeed.Root>
          </div>
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
