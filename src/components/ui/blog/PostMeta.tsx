import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Blog } from '@wix/headless-blog/react';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';

const postMetaVariants = cva('flex items-center gap-2 text-content-secondary', {
  variants: {
    variant: {
      compact:
        'text-sm gap-2 [&>*:not(:first-child)]:before:content-["•"] [&>*:not(:first-child)]:before:mr-2',
      detailed:
        'text-sm gap-3 flex-wrap [&>*:not(:first-child)]:before:content-["•"] [&>*:not(:first-child)]:before:mr-2',
      minimal: 'text-sm gap-1',
    },
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col gap-1',
    },
  },
  defaultVariants: {
    variant: 'compact',
    layout: 'horizontal',
  },
});

const avatarSizeVariants = cva('', {
  variants: {
    size: {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export interface PostMetaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof postMetaVariants> {
  showAuthor?: boolean;
  showAuthorAvatar?: boolean;
  showPublishDate?: boolean;
  showReadingTime?: boolean;
  dateLocale?: string;
  avatarSize?: NonNullable<VariantProps<typeof avatarSizeVariants>['size']>;
}

const PostMeta = React.forwardRef<HTMLDivElement, PostMetaProps>(
  (
    {
      className,
      variant,
      layout,
      showAuthor = true,
      showAuthorAvatar = true,
      showPublishDate = true,
      showReadingTime = false,
      dateLocale = 'en-US',
      avatarSize = 'sm',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(postMetaVariants({ variant, layout, className }))}
        ref={ref}
        {...props}
      >
        {showAuthor && showAuthorAvatar && (
          <div className="flex items-center gap-2">
            <Blog.Post.AuthorAvatar asChild>
              {({ authorAvatarUrl, authorNameInitials }) => {
                return (
                  <Avatar
                    className={cn(
                      'bg-foreground/10',
                      avatarSizeVariants({ size: avatarSize })
                    )}
                  >
                    <AvatarImage src={authorAvatarUrl} />
                    <AvatarFallback className="bg-inherit">
                      {authorNameInitials}
                    </AvatarFallback>
                  </Avatar>
                );
              }}
            </Blog.Post.AuthorAvatar>
            <Blog.Post.AuthorName />
          </div>
        )}

        {showAuthor && !showAuthorAvatar && <Blog.Post.AuthorName />}

        {showPublishDate && <Blog.Post.PublishDate locale={dateLocale} />}

        {showReadingTime && (
          <Blog.Post.ReadingTime asChild>
            {({ readingTime }) => <span>{readingTime} min read</span>}
          </Blog.Post.ReadingTime>
        )}
      </div>
    );
  }
);

PostMeta.displayName = 'PostMeta';

export { PostMeta, postMetaVariants };
