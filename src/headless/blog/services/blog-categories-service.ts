import { categories } from '@wix/blog';
import { media } from '@wix/sdk';
import {
  defineService,
  implementService,
  type ServiceAPI,
} from '@wix/services-definitions';
import type { ReadOnlySignal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

export interface EnhancedCategory
  extends Omit<categories.Category, 'coverImage' | 'slug'> {
  active: boolean;
  imageUrl: string | null;
  href: string | null;
}

export const BlogCategoriesServiceDefinition = defineService<{
  categories: ReadOnlySignal<EnhancedCategory[]>;
  activeCategory: ReadOnlySignal<EnhancedCategory | null>;
}>('blogCategoriesService');

export type BlogCategoriesServiceAPI = ServiceAPI<
  typeof BlogCategoriesServiceDefinition
>;

export type BlogCategoriesServiceConfig = {
  initialCategories?: categories.Category[];

  allPostsConfig?: {
    label: string;
    description: string;
    baseUrl: string;
  };

  pathname?: string;
};

export const BlogCategoriesService =
  implementService.withConfig<BlogCategoriesServiceConfig>()(
    BlogCategoriesServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const baseSlug = config.allPostsConfig?.baseUrl ?? '/blog';
      const categoriesSignal = signalsService.signal<categories.Category[]>([
        ...(config.allPostsConfig
          ? [
              {
                _id: 'all-posts',
                slug: '',
                label: config.allPostsConfig.label,
                description: config.allPostsConfig.description,
              },
            ]
          : []),
        ...(config.initialCategories || []),
      ]);
      const enhancedCategoriesSignal = signalsService.computed(() => {
        const pathname = config.pathname ?? '';
        const enhancedCategories = categoriesSignal
          .get()
          .map<EnhancedCategory>(category => {
            const active =
              (category.slug
                ? pathname?.endsWith(`/${category.slug}`)
                : pathname === baseSlug || pathname === `${baseSlug}/`) ||
              false;

            const href = category.slug
              ? `${baseSlug}/${category.slug}`
              : baseSlug;

            const imageUrl = category.coverImage
              ? media.getImageUrl(category.coverImage).url
              : null;

            return {
              ...category,
              imageUrl,
              href,
              active,
            };
          });
        return enhancedCategories;
      });
      const activeCategorySignal = signalsService.computed(
        () =>
          enhancedCategoriesSignal.get().find(category => category.active) ||
          null
      );

      return {
        categories: enhancedCategoriesSignal,
        activeCategory: activeCategorySignal,
      };
    }
  );

type LoadBlogCategoriesServiceConfigParams = {
  pathname: string;
  allPostsConfig?: BlogCategoriesServiceConfig['allPostsConfig'];
};

export async function loadBlogCategoriesServiceConfig({
  allPostsConfig,
  pathname,
}: LoadBlogCategoriesServiceConfigParams): Promise<BlogCategoriesServiceConfig> {
  try {
    const result = await categories
      .queryCategories()
      .gt('postCount', 0)
      .limit(100)
      .ascending('displayPosition', 'label')
      .find();

    return {
      initialCategories: result.items || [],
      allPostsConfig,
      pathname,
    };
  } catch (error) {
    return {
      initialCategories: [],
      allPostsConfig,
      pathname,
    };
  }
}
