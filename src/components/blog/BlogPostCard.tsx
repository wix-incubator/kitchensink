import { Blog } from '@wix/headless-blog/react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import PostCategories from './PostCategories';

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

export function BlogPostCardSideBySide({
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
  const { post } = Blog.Feed.useFeedPostRepeaterContext();
  const showExcerpt =
    showExcerptProp === 'auto'
      ? !post.resolvedFields.coverImageUrl
      : showExcerptProp;

  return (
    <article
      className={cn(
        'grid grid-flow-col auto-cols-fr rounded-xl text-foreground bg-surface-card overflow-hidden  *:box-border',
        className,
      )}
    >
      {showCoverImage && (
        <Blog.Post.CoverImage className="w-full h-full aspect-video object-cover  mb-6" />
      )}
      <div className="flex flex-col grow p-8">
        {showCategories && (
          <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />
        )}

        <Blog.Post.Link baseUrl={postPageBaseUrl} className="block -mt-1 mb-3 ">
          <Blog.Post.Title className="text-3xl font-semibold text-content-primary" />
        </Blog.Post.Link>

        {showExcerpt && (
          <Blog.Post.Excerpt className="text-content-secondary mb-4 line-clamp-3 flex-grow" />
        )}

        {(showAuthorAvatar || showAuthorName || showPublishDate) && (
          <div className="flex items-center text-sm gap-2 text-content-muted [&>*:not(:first-child)]:before:content-['•'] [&>*:not(:first-child)]:before:mr-2">
            {showAuthorName || showAuthorAvatar ? (
              <div className="flex items-center gap-3">
                {showAuthorAvatar && (
                  <Blog.Post.AuthorAvatar className="w-8 h-8 text-xs rounded-full flex items-center justify-center" />
                )}
                {showAuthorName && <Blog.Post.AuthorName />}
              </div>
            ) : null}

            {showPublishDate && <Blog.Post.PublishDate locale={dateLocale} />}
            {showReadingTime && (
              <Blog.Post.ReadingTime asChild>
                {({ readingTime }) => <span>{readingTime} min read</span>}
              </Blog.Post.ReadingTime>
            )}
          </div>
        )}

        <div className="mt-auto mb-0"></div>

        {readMoreText && (
          <Button className="w-fit gap-1 mt-4 flex items-center" asChild>
            <Blog.Post.Link baseUrl={postPageBaseUrl}>
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
            </Blog.Post.Link>
          </Button>
        )}
      </div>
    </article>
  );
}

export function BlogPostCardEditorial({
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
  const { post } = Blog.Feed.useFeedPostRepeaterContext();

  const showExcerpt =
    showExcerptProp === 'auto'
      ? !post.resolvedFields.coverImageUrl
      : showExcerptProp;

  return (
    <article
      className={cn('flex flex-col rounded-xl text-foreground', className)}
    >
      {showCoverImage && (
        <Blog.Post.CoverImage className="w-full aspect-[250/200] object-cover rounded-xl mb-6" />
      )}
      {showCategories && (
        <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />
      )}

      <Blog.Post.Link baseUrl={postPageBaseUrl} className="block -mt-1 mb-3 ">
        <Blog.Post.Title className="text-3xl font-semibold text-content-primary" />
      </Blog.Post.Link>

      {showExcerpt && (
        <Blog.Post.Excerpt className="text-content-secondary mb-4 line-clamp-3 flex-grow" />
      )}

      <div className="mt-auto mb-0"></div>

      {(showAuthorAvatar || showAuthorName || showPublishDate) && (
        <div className="flex items-center text-sm gap-3 text-content-muted">
          {showAuthorAvatar && (
            <Blog.Post.AuthorAvatar className="w-8 h-8 text-xs rounded-full flex items-center justify-center" />
          )}
          {showAuthorName && <Blog.Post.AuthorName />}

          {showPublishDate && <Blog.Post.PublishDate locale={dateLocale} />}
          {showReadingTime && (
            <Blog.Post.ReadingTime asChild>
              {({ readingTime }) => <span>{readingTime} min read</span>}
            </Blog.Post.ReadingTime>
          )}
        </div>
      )}

      {readMoreText && (
        <Button className="w-fit gap-1 mt-4 flex items-center" asChild>
          <Blog.Post.Link baseUrl={postPageBaseUrl}>
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
          </Blog.Post.Link>
        </Button>
      )}
    </article>
  );
}
