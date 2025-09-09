import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Blog, createCustomCategory } from '@wix/headless-blog/react';
import { useNavigation } from '../NavigationContext';

interface BlogFeedCategoriesSectionProps {
  pathname: string;
  baseUrl: string;
  allPostsConfig?: {
    label: string;
    href: string;
    description?: string;
  };
}

export default function BlogFeedCategoriesSection({
  pathname,
  baseUrl,
  allPostsConfig,
}: BlogFeedCategoriesSectionProps) {
  const Navigation = useNavigation();

  return (
    <Blog.Categories.Root
      customCategories={
        allPostsConfig
          ? [
              createCustomCategory(allPostsConfig.label, allPostsConfig.href, {
                description: allPostsConfig.description,
              }),
            ]
          : []
      }
    >
      <Blog.Categories.CategoryItems>
        <Blog.Categories.ActiveCategory
          baseUrl={baseUrl}
          asChild
          currentPath={pathname}
        >
          {({ category }) => {
            const isWithImage = category.imageUrl;
            return (
              <>
                <section className=" relative overflow-hidden bg-surface-card border border-surface-primary place-items-center text-center rounded-xl p-9 grid gap-6 min-h-[182px]">
                  {isWithImage && (
                    <figure className="absolute inset-0 after:absolute after:inset-0 after:bg-background/70">
                      <Blog.Category.Image className="object-cover h-full w-full" />
                    </figure>
                  )}
                  <div className="isolate flex flex-col gap-3 justify-center max-w-4xl mx-auto">
                    <Blog.Category.Label
                      className={cn(`text-5xl tracking-tight`, {
                        'text-foreground': isWithImage,
                        'text-content-primary': !isWithImage,
                      })}
                    />
                    <Blog.Category.Description
                      className={cn('text-lg text-balance', {
                        'text-foreground': isWithImage,
                        'text-content-primary': !isWithImage,
                      })}
                    />
                  </div>
                  <div className="isolate">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Blog.Categories.CategoryItemRepeater>
                        <Blog.Category.Link baseUrl={baseUrl} asChild>
                          {({ href }) => {
                            const isActive = pathname === href;

                            const variantWithImage: ButtonProps['variant'] =
                              isActive ? 'default' : 'outline';
                            const variantWithoutImage: ButtonProps['variant'] =
                              isActive ? 'default' : 'outline';

                            return (
                              <Button
                                asChild
                                aria-current={isActive}
                                variant={
                                  isWithImage
                                    ? variantWithImage
                                    : variantWithoutImage
                                }
                              >
                                <Navigation route={href}>
                                  <Blog.Category.Label />
                                </Navigation>
                              </Button>
                            );
                          }}
                        </Blog.Category.Link>
                      </Blog.Categories.CategoryItemRepeater>
                    </div>
                  </div>
                </section>
              </>
            );
          }}
        </Blog.Categories.ActiveCategory>
      </Blog.Categories.CategoryItems>
    </Blog.Categories.Root>
  );
}
