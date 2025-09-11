import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Blog } from '@wix/headless-blog/react';

const postTitleVariants = cva('text-foreground', {
  variants: {
    variant: {
      base: 'text-xl font-medium leading-tight',
      lg: 'text-3xl font-semibold leading-tight',
      xl: 'text-3xl tracking-tight md:text-5xl font-bold leading-tight -mt-1',
    },
  },
  defaultVariants: {
    variant: 'base',
  },
});

export interface PostTitleProps
  extends React.ComponentProps<typeof Blog.Post.Title>,
    VariantProps<typeof postTitleVariants> {}

const PostTitle = React.forwardRef<HTMLElement, PostTitleProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Blog.Post.Title
        className={cn(postTitleVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

PostTitle.displayName = 'PostTitle';

export { PostTitle, postTitleVariants };
