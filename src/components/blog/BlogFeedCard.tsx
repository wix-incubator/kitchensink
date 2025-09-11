import { useNavigation } from '@/components/NavigationContext';
import { PostMeta } from '@/components/ui/blog/PostMeta';
import { PostTitle } from '@/components/ui/blog/PostTitle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Blog } from '@wix/headless-blog/react';
import PostCategories from './PostCategories';

interface BlogFeedCardProps {
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

export function BlogFeedCardSideBySide({
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
}: BlogFeedCardProps) {
  const Navigation = useNavigation();
  const { post } = Blog.Feed.useFeedPostRepeaterContext();
  const showExcerpt =
    showExcerptProp === 'auto'
      ? !post.resolvedFields.coverImageUrl
      : showExcerptProp;

  return (
    <article
      className={cn(
        'grid grid-flow-col auto-cols-fr rounded-xl bg-surface-card overflow-hidden  *:box-border',
        className
      )}
    >
      {showCoverImage && (
        <Blog.Post.CoverImage className="w-full h-full aspect-video object-cover  mb-6" />
      )}
      <div className="flex flex-col grow p-8">
        {showCategories && (
          <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />
        )}

        <Blog.Post.Link
          baseUrl={postPageBaseUrl}
          className="block -mt-1 mb-3 "
          asChild
        >
          {({ href }) => (
            <Navigation route={href}>
              <PostTitle variant="lg" />
            </Navigation>
          )}
        </Blog.Post.Link>

        {showExcerpt && (
          <Blog.Post.Excerpt className="text-content-secondary mb-4 line-clamp-3 flex-grow" />
        )}

        {(showAuthorAvatar ||
          showAuthorName ||
          showPublishDate ||
          showReadingTime) && (
          <PostMeta
            showAuthor={showAuthorName || showAuthorAvatar}
            showAuthorAvatar={showAuthorAvatar}
            showPublishDate={showPublishDate}
            showReadingTime={showReadingTime}
            dateLocale={dateLocale}
            avatarSize="md"
          />
        )}

        <div className="mt-auto mb-0"></div>

        {readMoreText && (
          <Button className="w-fit mt-4" asChild>
            <Blog.Post.Link baseUrl={postPageBaseUrl} asChild>
              {({ href }) => (
                <Navigation route={href}>
                  {readMoreText}
                  <ChevronRightIcon strokeWidth={2} className="w-4 h-4" />
                </Navigation>
              )}
            </Blog.Post.Link>
          </Button>
        )}
      </div>
    </article>
  );
}

export function BlogFeedCardEditorial({
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
}: BlogFeedCardProps) {
  const { post } = Blog.Feed.useFeedPostRepeaterContext();
  const Navigation = useNavigation();
  const showExcerpt =
    showExcerptProp === 'auto'
      ? !post.resolvedFields.coverImageUrl
      : showExcerptProp;

  return (
    <article className={cn('flex flex-col rounded-xl', className)}>
      {showCoverImage && (
        <Blog.Post.CoverImage className="w-full aspect-[250/200] object-cover rounded-xl mb-6" />
      )}
      {showCategories && (
        <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />
      )}

      <Blog.Post.Link
        baseUrl={postPageBaseUrl}
        className="block -mt-1 mb-3 "
        asChild
      >
        {({ href }) => (
          <Navigation route={href}>
            <PostTitle variant="lg" />
          </Navigation>
        )}
      </Blog.Post.Link>

      {showExcerpt && (
        <Blog.Post.Excerpt className="text-content-secondary mb-4 line-clamp-3 flex-grow" />
      )}

      <div className="mt-auto mb-0"></div>

      {(showAuthorAvatar ||
        showAuthorName ||
        showPublishDate ||
        showReadingTime) && (
        <PostMeta
          showAuthor={showAuthorName || showAuthorAvatar}
          showAuthorAvatar={showAuthorAvatar}
          showPublishDate={showPublishDate}
          showReadingTime={showReadingTime}
          dateLocale={dateLocale}
          avatarSize="md"
        />
      )}

      {readMoreText && (
        <Button className="w-fit mt-4" asChild>
          <Blog.Post.Link baseUrl={postPageBaseUrl} asChild>
            {({ href }) => (
              <Navigation route={href}>
                {readMoreText}
                <ChevronRightIcon strokeWidth={2} className="w-4 h-4" />
              </Navigation>
            )}
          </Blog.Post.Link>
        </Button>
      )}
    </article>
  );
}
