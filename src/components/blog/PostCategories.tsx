import { cn } from '@/lib/utils';
import { Blog } from '@wix/headless-blog/react';

interface PostCategoriesProps {
  className?: string;
  baseUrl?: string;
}

function PostCategories({ baseUrl, className }: PostCategoriesProps) {
  const CategoryLinkOrLabel = baseUrl
    ? Blog.Category.Link
    : Blog.Category.Label;

  return (
    <Blog.Post.CategoryItems className={cn('flex flex-wrap gap-2', className)}>
      <Blog.Categories.CategoryItemRepeater>
        <CategoryLinkOrLabel
          baseUrl={baseUrl}
          className={cn(
            'border border-surface-strong text-foreground leading-tight px-3 py-1 rounded-full text-sm font-medium',
          )}
        />
      </Blog.Categories.CategoryItemRepeater>
    </Blog.Post.CategoryItems>
  );
}

export default PostCategories;
