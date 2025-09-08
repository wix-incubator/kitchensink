import { BlogFeed } from '@wix/headless-blog/react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface BlogPostCardProps {
  className?: string;
  postPageBaseUrl: string;
  /** Categories will link to category pages if provided, otherwise they will be displayed as labels. */
  categoryPageBaseUrl?: string;
  dateLocale: string;
  readMoreText?: string;
  showCoverImage?: boolean;
  showCategories?: boolean;
  showAuthorAvatar?: boolean;
  showAuthorName?: boolean;
  showPublishDate?: boolean;
  showReadingTime?: boolean;
  /** If "auto", the excerpt will be shown if the cover image is not present. */
  showExcerpt?: boolean | 'auto';
}

function BlogFeedPostCategories({
  categoryPageBaseUrl,
}: Pick<BlogPostCardProps, 'categoryPageBaseUrl'>) {
  const CategoryLinkOrLabel = categoryPageBaseUrl
    ? BlogFeed.PostCategoryLink
    : BlogFeed.PostCategoryLabel;

  return (
    <BlogFeed.PostCategories className="flex flex-wrap gap-2 mb-4">
      <BlogFeed.PostCategoryRepeater>
        <CategoryLinkOrLabel
          baseUrl={categoryPageBaseUrl}
          className={cn(
            'border border-surface-strong text-foreground leading-tight px-3 py-1 rounded-full text-sm font-medium',
            {
              'hover:scale-105 transition-all': !!categoryPageBaseUrl,
            }
          )}
        />
      </BlogFeed.PostCategoryRepeater>
    </BlogFeed.PostCategories>
  );
}

export function BlogFeedPostCardSideBySide({
  className,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
  readMoreText,
  showCoverImage = true,
  showCategories = true,
  showAuthorAvatar = false,
  showAuthorName = false,
  showPublishDate = true,
  showExcerpt: showExcerptProp = 'auto',
  showReadingTime = false,
}: BlogPostCardProps) {
  const { post } = BlogFeed.useFeedPostRepeaterContext();
  const showExcerpt =
    showExcerptProp === 'auto'
      ? !post.resolvedFields.coverImageUrl
      : showExcerptProp;

  return (
    <article
      className={cn(
        'grid grid-flow-col auto-cols-fr rounded-xl text-foreground bg-surface-card overflow-hidden  *:box-border',
        className
      )}
    >
      {showCoverImage && (
        <BlogFeed.PostCoverImage className="w-full h-full aspect-video object-cover  mb-6" />
      )}
      <div className="flex flex-col grow p-8">
        {showCategories && (
          <BlogFeedPostCategories categoryPageBaseUrl={categoryPageBaseUrl} />
        )}

        <BlogFeed.PostLink
          baseUrl={postPageBaseUrl}
          className="block -mt-1 mb-3 "
        >
          <BlogFeed.PostTitle className="text-3xl font-semibold text-content-primary" />
        </BlogFeed.PostLink>

        {showExcerpt && (
          <BlogFeed.PostExcerpt className="text-content-secondary mb-4 line-clamp-3 flex-grow" />
        )}

        {(showAuthorAvatar || showAuthorName || showPublishDate) && (
          <div className="flex items-center text-sm gap-2 text-content-muted [&>*:not(:first-child)]:before:content-['•'] [&>*:not(:first-child)]:before:mr-2">
            {showAuthorName || showAuthorAvatar ? (
              <div className="flex items-center gap-3">
                {showAuthorAvatar && (
                  <BlogFeed.PostAuthorAvatar className="w-8 h-8 text-xs rounded-full flex items-center justify-center" />
                )}
                {showAuthorName && <BlogFeed.PostAuthorName />}
              </div>
            ) : null}

            {showPublishDate && (
              <BlogFeed.PostPublishDate locale={dateLocale} />
            )}
            {showReadingTime && (
              <BlogFeed.PostReadingTime asChild>
                {({ readingTime }) => <span>{readingTime} min read</span>}
              </BlogFeed.PostReadingTime>
            )}
          </div>
        )}

        <div className="mt-auto mb-0"></div>

        {readMoreText && (
          <Button className="w-fit gap-1 mt-4 flex items-center" asChild>
            <BlogFeed.PostLink baseUrl={postPageBaseUrl}>
              {readMoreText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="2 2 20 20"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6.5 19 12m0 0-5.5 5.5"
                />
              </svg>
            </BlogFeed.PostLink>
          </Button>
        )}
      </div>
    </article>
  );
}

export function BlogFeedPostCardEditorial({
  className,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
  readMoreText,
  showCoverImage = true,
  showCategories = true,
  showPublishDate = true,
  showAuthorAvatar = false,
  showAuthorName = false,
  showReadingTime = false,
  showExcerpt: showExcerptProp = 'auto',
}: BlogPostCardProps) {
  const { post } = BlogFeed.useFeedPostRepeaterContext();

  const showExcerpt =
    showExcerptProp === 'auto'
      ? !post.resolvedFields.coverImageUrl
      : showExcerptProp;

  return (
    <article
      className={cn('flex flex-col rounded-xl text-foreground', className)}
    >
      {showCoverImage && (
        <BlogFeed.PostCoverImage className="w-full aspect-[250/200] object-cover rounded-xl mb-6" />
      )}
      {showCategories && (
        <BlogFeedPostCategories categoryPageBaseUrl={categoryPageBaseUrl} />
      )}

      <BlogFeed.PostLink
        baseUrl={postPageBaseUrl}
        className="block -mt-1 mb-3 "
      >
        <BlogFeed.PostTitle className="text-3xl font-semibold text-content-primary" />
      </BlogFeed.PostLink>

      {showExcerpt && (
        <BlogFeed.PostExcerpt className="text-content-secondary mb-4 line-clamp-3 flex-grow" />
      )}

      <div className="mt-auto mb-0"></div>

      {(showAuthorAvatar || showAuthorName || showPublishDate) && (
        <div className="flex items-center text-sm gap-3 text-content-muted">
          {showAuthorAvatar && (
            <BlogFeed.PostAuthorAvatar className="w-8 h-8 text-xs rounded-full flex items-center justify-center" />
          )}
          {showAuthorName && <BlogFeed.PostAuthorName />}

          {showPublishDate && <BlogFeed.PostPublishDate locale={dateLocale} />}
          {showReadingTime && (
            <BlogFeed.PostReadingTime asChild>
              {({ readingTime }) => <span>{readingTime} min read</span>}
            </BlogFeed.PostReadingTime>
          )}
        </div>
      )}

      {readMoreText && (
        <Button className="w-fit gap-1 mt-4 flex items-center" asChild>
          <BlogFeed.PostLink baseUrl={postPageBaseUrl}>
            {readMoreText}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="2 2 20 20"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6.5 19 12m0 0-5.5 5.5"
              />
            </svg>
          </BlogFeed.PostLink>
        </Button>
      )}
    </article>
  );
}
