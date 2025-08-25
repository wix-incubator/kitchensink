import { Button } from '@/components/ui/button';
import type { BlogPostServiceConfig } from '@/headless/blog';
import { BlogFeed, BlogPost } from '@/headless/blog/components';
import {
  BlogPostService,
  BlogPostServiceDefinition,
} from '@/headless/blog/services/blog-post-service';
import { KitchensinkLayout } from '@/layouts/KitchensinkLayout';
import { RicosViewer, quickStartViewerPlugins } from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { useState } from 'react';

interface BlogPostPageProps {
  postConfig: BlogPostServiceConfig;
  href: string;
  backUrl?: string;
}

export default function BlogPostPage({
  postConfig,
  href,
  backUrl,
}: BlogPostPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        BlogPostServiceDefinition,
        BlogPostService,
        postConfig
      )
    )
  );

  return (
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8 max-w-4xl space-y-10">
            {backUrl ? (
              <a className="inline-block" href={backUrl}>
                <Button variant="secondary">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.666 8L3.33268 8"
                      stroke="#18181B"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 12.667L3.33333 8.00032L8 3.33366"
                      stroke="#18181B"
                      stroke-width="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </Button>
              </a>
            ) : null}

            <BlogPost.Root>
              {({ post }) => {
                return (
                  <>
                    <article className="space-y-8">
                      <header className="grid gap-6">
                        <BlogPost.Categories>
                          {({ categories }) => (
                            <>
                              {categories.length > 0 && (
                                <div className="flex items-center gap-2">
                                  {categories.map(category => (
                                    <span
                                      key={category}
                                      className="text-xs border border-slate-300 px-2 py-1 rounded-full"
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </BlogPost.Categories>

                        <h1 className="text-4xl font-bold text-content-primary">
                          {post.title}
                        </h1>

                        <div className="flex gap-x-3 items-center">
                          <BlogPost.Author>
                            {({
                              authorName,
                              authorNickname,
                              hasAuthor,
                              authorImageUrl,
                              hasAuthorImage,
                            }) =>
                              hasAuthor && (
                                <div className="flex items-center gap-3">
                                  {hasAuthorImage && (
                                    <div className="w-9 h-9 rounded-full overflow-hidden">
                                      <img
                                        src={authorImageUrl!}
                                        alt={authorNickname || authorName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}

                                  <p>{authorNickname || authorName}</p>
                                </div>
                              )
                            }
                          </BlogPost.Author>
                          <span>•</span>
                          <BlogPost.PublishDate>
                            {({ formattedDate }) => (
                              <span>{formattedDate}</span>
                            )}
                          </BlogPost.PublishDate>
                          <span>•</span>
                          <BlogPost.ReadingTime>
                            {({ formattedReadingTime }) => (
                              <span>{formattedReadingTime}</span>
                            )}
                          </BlogPost.ReadingTime>
                        </div>

                        <ShareLinks href={href} />
                      </header>

                      <BlogPost.Content>
                        {({ ricosViewerContent }) => (
                          <RicosViewer
                            content={ricosViewerContent}
                            plugins={quickStartViewerPlugins()}
                          />
                        )}
                      </BlogPost.Content>

                      <footer className="grid gap-4">
                        <BlogPost.Tags>
                          {({ tags }) => (
                            <div className="flex items-center gap-2">
                              {tags.map(tag => (
                                <span
                                  key={tag}
                                  className="text-xs border border-slate-300 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </BlogPost.Tags>
                        <ShareLinks href={href} />
                      </footer>
                    </article>
                    <BlogPost.RecentPosts>
                      {({ recentPosts }) => (
                        <section className="mt-10 space-y-10">
                          <h3 className="text-xl font-semibold">
                            Recent posts
                          </h3>

                          <div className="grid grid-cols-3 gap-8">
                            {recentPosts.map(recentPost => (
                              <BlogFeed.Item post={recentPost}>
                                {({
                                  postId,
                                  coverImageAlt,
                                  coverImageUrl,
                                  categories,
                                  title,
                                  publishDateFormatted,
                                }) => (
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

                                      <h2 className="text-3xl font-semibold text-content-primary -my-1">
                                        {title}
                                      </h2>

                                      <div className="flex items-center justify-between text-sm text-slate-500">
                                        <div className="flex items-center gap-4">
                                          <span>{publishDateFormatted}</span>
                                        </div>
                                      </div>

                                      <div className="grow"></div>

                                      <a
                                        href={`/blog/post/${recentPost.slug}`}
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
                                )}
                              </BlogFeed.Item>
                            ))}
                          </div>
                        </section>
                      )}
                    </BlogPost.RecentPosts>
                  </>
                );
              }}
            </BlogPost.Root>
          </div>
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}

export function BlogPostPageMeta({
  postConfig,
}: {
  postConfig: BlogPostServiceConfig;
}) {
  const { coverImageUrl, coverImageAlt } = postConfig.post.resolvedFields;

  return (
    <>
      <meta name="title" content={postConfig.post.title} />
      <meta name="og:title" content={postConfig.post.title} />

      <meta name="description" content={postConfig.post.excerpt} />
      <meta name="og:description" content={postConfig.post.excerpt} />
      {coverImageUrl ? (
        <>
          <meta property="image" content={coverImageUrl} />
          <meta property="og:image" content={coverImageUrl} />
          <meta property="og:image:alt" content={coverImageAlt || ''} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={coverImageUrl} />
        </>
      ) : null}
    </>
  );
}

function ShareLinks({ href }: { href: string }) {
  return (
    <div className="flex gap-6">
      <BlogPost.ShareUrlToFacebook href={href}>
        {({ url }) => (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title="Share on Facebook"
          >
            <svg className="w-5 h-5" viewBox="0 0 22 22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 0.893555C16.799 0.893555 21.5 5.59456 21.5 11.3936C21.5 16.6344 17.6603 20.9783 12.6406 21.766V14.4287H15.0872L15.5527 11.3936H12.6406V9.42392C12.6406 8.59356 13.0474 7.78418 14.3518 7.78418H15.6758V5.2002C15.6758 5.2002 14.4742 4.99512 13.3254 4.99512C10.927 4.99512 9.35938 6.44871 9.35938 9.08027V11.3936H6.69336V14.4287H9.35938V21.766C4.3397 20.9783 0.5 16.6344 0.5 11.3936C0.5 5.59456 5.20101 0.893555 11 0.893555Z"
                fill="currentColor"
              />
            </svg>
          </a>
        )}
      </BlogPost.ShareUrlToFacebook>
      <BlogPost.ShareUrlToX href={href}>
        {({ url }) => (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title="Share on X"
          >
            <svg className="w-5 h-5" viewBox="0 0 19 16">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5532 4.66499C16.5532 4.49921 16.5532 4.33418 16.5427 4.16989C17.2454 3.62768 17.8519 2.95632 18.334 2.18725C17.6787 2.497 16.9836 2.70014 16.2718 2.78988C17.0213 2.3112 17.5823 1.55831 17.8503 0.671326C17.1455 1.11748 16.3744 1.43191 15.5704 1.60104C14.4574 0.338566 12.689 0.0295705 11.2567 0.847322C9.82435 1.66507 9.08438 3.4062 9.45168 5.09438C6.56481 4.93999 3.87512 3.48536 2.05198 1.0925C1.09902 2.84264 1.58578 5.08158 3.16358 6.20556C2.5922 6.18749 2.03328 6.02306 1.53398 5.72614C1.53398 5.74182 1.53398 5.75825 1.53398 5.77468C1.53445 7.59796 2.73921 9.16835 4.41448 9.52938C3.88589 9.68317 3.33129 9.70565 2.79328 9.5951C3.26365 11.1554 4.61159 12.2243 6.14768 12.2551C4.8763 13.321 3.30573 13.8997 1.68868 13.8979C1.40302 13.8973 1.11763 13.8789 0.833984 13.8427C2.47593 14.9667 4.38642 15.563 6.33738 15.5602C12.9412 15.5632 16.5532 9.72653 16.5532 4.66499Z"
                fill="currentColor"
              />
            </svg>
          </a>
        )}
      </BlogPost.ShareUrlToX>
      <BlogPost.ShareUrlToLinkedIn href={href}>
        {({ url }) => (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            title="Share on LinkedIn"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 19">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.9993 0.0605469C18.288 0.0605469 19.3327 1.10522 19.3327 2.39388V16.3939C19.3327 17.6825 18.288 18.7272 16.9993 18.7272H2.99935C1.71068 18.7272 0.666016 17.6825 0.666016 16.3939V2.39388C0.666016 1.10522 1.71068 0.0605469 2.99935 0.0605469H16.9993ZM5.33268 7.06055H2.99935V15.2272H5.33268V7.06055ZM9.99935 7.06055H7.66602V15.2272H9.99935V11.1439L10.0074 10.9753C10.0922 10.0879 10.8397 9.39388 11.7493 9.39388C12.659 9.39388 13.4065 10.0879 13.4913 10.9753L13.4993 11.1439V15.2272H15.8327V10.5605L15.8267 10.3549C15.7203 8.51762 14.1966 7.06055 12.3327 7.06055C11.526 7.06055 10.783 7.33348 10.1911 7.79204L9.99946 7.95165L9.99935 7.06055ZM4.16602 3.56055C3.52168 3.56055 2.99935 4.08288 2.99935 4.72721C2.99935 5.37155 3.52168 5.89388 4.16602 5.89388C4.81035 5.89388 5.33268 5.37155 5.33268 4.72721C5.33268 4.08288 4.81035 3.56055 4.16602 3.56055Z"
                fill="currentColor"
              />
            </svg>
          </a>
        )}
      </BlogPost.ShareUrlToLinkedIn>
      <button
        type="button"
        title="Copy link to clipboard"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
      >
        <svg className="w-5 h-5" viewBox="0 0 17 17">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.2 14.0932C4.4 14.8932 3.1 14.8932 2.3 14.0932C1.5 13.2932 1.5 11.9932 2.3 11.1932L5.6 7.89316C6.4 7.09316 7.7 7.09316 8.5 7.89316C8.8 8.19316 9.4 8.19316 9.7 7.89316C10 7.59316 10 6.99316 9.7 6.69316C8.2 5.19316 5.8 5.19316 4.4 6.69316L1.1 9.99316C0.4 10.6932 0 11.5932 0 12.5932C0 13.5932 0.4 14.5932 1.1 15.2932C1.8 15.9932 2.8 16.3932 3.8 16.3932C4.8 16.3932 5.7 15.9932 6.5 15.2932L8.2 13.5932C8.5 13.2932 8.5 12.6932 8.2 12.3932C7.8 12.0932 7.2 12.0932 6.9 12.3932L5.2 14.0932ZM9.6 1.49316L7.9 3.19316C7.6 3.49316 7.6 4.09316 7.9 4.39316C8.2 4.69316 8.8 4.69316 9.1 4.39316L10.8 2.69316C11.6 1.89316 12.9 1.89316 13.7 2.69316C14.5 3.49316 14.5 4.79316 13.7 5.59316L10.4 8.89316C9.6 9.69316 8.3 9.69316 7.5 8.89316C7.2 8.59316 6.6 8.59316 6.3 8.89316C6 9.19316 6 9.79316 6.3 10.0932C7 10.7932 8 11.1932 9 11.1932C10 11.1932 10.9 10.7932 11.7 10.0932L15 6.79316C16.4 5.39316 16.4 2.99316 14.9 1.49316C13.4 -0.00683594 11 -0.00683594 9.6 1.49316Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
