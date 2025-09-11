import * as React from 'react';
import { cn } from '@/lib/utils';
import { Blog } from '@wix/headless-blog/react';

type CustomStyles = React.ComponentProps<
  typeof Blog.Post.Content
>['customStyles'];

export interface PostContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const defaultCustomStyles: CustomStyles = {
  h1: {
    color: 'var(--color-foreground)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--text-5xl)',
  },
  h2: {
    color: 'var(--color-foreground)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--text-4xl)',
  },
  h3: {
    color: 'var(--color-foreground)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--text-3xl)',
  },
  h4: {
    color: 'var(--color-foreground)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--text-2xl)',
  },
  h5: {
    color: 'var(--color-foreground)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--text-xl)',
  },
  h6: {
    color: 'var(--color-foreground)',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--text-lg)',
  },
  p: {
    color: 'var(--color-foreground)',
    fontSize: 'var(--text-lg)',
  },
  quote: {
    color: 'var(--color-foreground)',
  },
  codeBlock: {
    color: 'var(--color-foreground)',
  },
  audio: {
    titleColor: 'var(--color-foreground)',
    subtitleColor: 'var(--color-foreground)',
    backgroundColor: 'var(--color-background)',
    borderColor: 'var(--color-border)',
    actionColor: 'var(--color-foreground)',
    actionTextColor: 'var(--color-background)',
  },
  table: {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-background)',
  },
};

const PostContent = React.forwardRef<HTMLDivElement, PostContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <Blog.Post.Content
        className={cn(className)}
        customStyles={defaultCustomStyles}
        ref={ref}
        {...props}
      />
    );
  }
);

PostContent.displayName = 'PostContent';

export { PostContent };
