import { Chip } from '@/components/ui/blog/Chip';
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
        <Chip variant="secondary" asChild>
          <CategoryLinkOrLabel baseUrl={baseUrl} />
        </Chip>
      </Blog.Categories.CategoryItemRepeater>
    </Blog.Post.CategoryItems>
  );
}

export default PostCategories;
