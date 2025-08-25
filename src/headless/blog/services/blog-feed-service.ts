import { categories, posts, tags } from '@wix/blog';
import { members } from '@wix/members';
import { media } from '@wix/sdk';
import {
  defineService,
  implementService,
  type ServiceAPI,
} from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

export interface PostResolvedFields {
  owner: members.Member | null | undefined;
  categories: posts.Category[];
  tags: tags.BlogTag[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
}

export interface PostWithResolvedFields extends posts.Post {
  resolvedFields: PostResolvedFields;
}

export const BlogFeedServiceDefinition = defineService<{
  posts: Signal<PostWithResolvedFields[]>;
  category: Signal<categories.Category | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  totalPosts: number;
  isEmpty: () => boolean;
  hasNextPage: () => boolean;
  loadNextPage: () => Promise<void>;
}>('blogService');

export type BlogFeedServiceAPI = ServiceAPI<typeof BlogFeedServiceDefinition>;

export type BlogFeedServiceConfig = {
  initialPosts?: PostWithResolvedFields[];
  initialCategory?: categories.Category;
  totalPostCount?: number;
  pageSize?: number;
  nextPageCursor?: string;
};

export const BlogFeedService =
  implementService.withConfig<BlogFeedServiceConfig>()(
    BlogFeedServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const postsSignal = signalsService.signal<PostWithResolvedFields[]>(
        config.initialPosts || []
      );
      const categorySignal = signalsService.signal<categories.Category | null>(
        config.initialCategory || null
      );
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      let nextPageCursor: string | undefined = config.nextPageCursor;

      const totalPosts = config.totalPostCount || 0;

      const isEmpty = (): boolean => {
        return !isLoadingSignal.get() && totalPosts === 0;
      };

      const hasNextPage = (): boolean => {
        return !!nextPageCursor;
      };

      // Actions
      const loadNextPage = async (): Promise<void> => {
        try {
          if (!nextPageCursor) {
            return;
          }

          isLoadingSignal.set(true);
          errorSignal.set(null);

          let query = posts
            .queryPosts()
            .limit(config.pageSize || 10)
            .skipTo(nextPageCursor)
            .descending('firstPublishedDate');

          if (config.initialCategory?._id) {
            query = query.hasSome('categoryIds', [config.initialCategory._id]);
          }

          const result = await query.find();
          const rawPosts = result.items || [];
          const enhancedPosts = await enhancePosts(rawPosts);

          postsSignal.set([...postsSignal.get(), ...enhancedPosts]);
          nextPageCursor = result.cursors.next || undefined;
        } catch (err) {
          console.error('Failed to load posts:', err);
          errorSignal.set('Failed to load posts');
        } finally {
          isLoadingSignal.set(false);
        }
      };

      return {
        posts: postsSignal,
        category: categorySignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
        totalPosts,
        isEmpty,
        hasNextPage,
        loadNextPage: loadNextPage,
      };
    }
  );

export async function loadBlogFeedServiceConfig(
  categorySlug?: string,
  pageSize: number = 10
): Promise<BlogFeedServiceConfig> {
  try {
    let postsQuery = posts
      .queryPosts()
      .descending('firstPublishedDate')
      .limit(pageSize);

    let initialCategory: categories.Category | undefined;
    if (categorySlug) {
      const category = await categories.getCategoryBySlug(categorySlug);
      if (category.category) {
        initialCategory = category.category;
      } else {
        throw new Error(`Category for slug "${categorySlug}" not found`);
      }
    }

    if (initialCategory?._id) {
      postsQuery = postsQuery.hasSome('categoryIds', [initialCategory._id]);
    }

    const result = await postsQuery.find();
    const rawPosts = result.items || [];
    const enhancedPosts = await enhancePosts(rawPosts);

    return {
      initialPosts: enhancedPosts,
      initialCategory,
      totalPostCount: result.length,
      pageSize,
      nextPageCursor: result.cursors.next || undefined,
    };
  } catch (error) {
    return {
      initialPosts: [],
      initialCategory: undefined,
      totalPostCount: 0,
      pageSize,
      nextPageCursor: undefined,
    };
  }
}

export async function enhancePosts(
  rawPosts: posts.Post[]
): Promise<PostWithResolvedFields[]> {
  const { members, categories, tags } = await fetchPostEntities(rawPosts);

  return rawPosts.map<PostWithResolvedFields>(post => {
    const coverImage = getCoverImage(post);
    return {
      ...post,
      resolvedFields: {
        owner: post.memberId ? members[post.memberId] : undefined,
        categories:
          post.categoryIds
            ?.map(categoryId => categories[categoryId])
            .filter(nonNullable) ?? [],
        tags: post.tagIds?.map(tagId => tags[tagId]).filter(nonNullable) ?? [],
        coverImageUrl: coverImage.url,
        coverImageAlt: coverImage.alt,
      },
    };
  });
}

async function fetchPostEntities(posts: posts.Post[]): Promise<{
  members: Record<string, members.Member | null | undefined>;
  categories: Record<string, categories.Category | null | undefined>;
  tags: Record<string, tags.BlogTag | null | undefined>;
}> {
  const memberIdsToResolve = flatMapByKey(posts, 'memberId');
  const categoryIdsToResolve = flatMapByKey(posts, 'categoryIds');
  const tagIdsToResolve = flatMapByKey(posts, 'tagIds');

  const memberPromises = memberIdsToResolve.map(memberId => {
    return members
      .getMember(memberId)
      .then(response => [memberId, response] as const)
      .catch(err => {
        console.error(`Failed to resolve member ${memberId}`, err?.message);
        return [memberId, null] as const;
      });
  });

  const categoryPromises = categoryIdsToResolve.map(categoryId =>
    categories
      .getCategory(categoryId)
      .then(response => [categoryId, response.category] as const)
      .catch(err => {
        console.error(`Failed to resolve category ${categoryId}`, err?.details);
        return [categoryId, null] as const;
      })
  );

  const tagPromises = tagIdsToResolve.map(tagId =>
    tags
      .getTag(tagId)
      .then(response => [tagId, response] as const)
      .catch(err => {
        console.error(`Failed to resolve tag ${tagId}`, err?.message);
        return [tagId, null] as const;
      })
  );

  const [resolvedMembers, resolvedCategories, resolvedTags] = await Promise.all(
    [
      Promise.all(memberPromises),
      Promise.all(categoryPromises),
      Promise.all(tagPromises),
    ]
  );

  return {
    members: Object.fromEntries(resolvedMembers),
    categories: Object.fromEntries(resolvedCategories),
    tags: Object.fromEntries(resolvedTags),
  };
}

function getCoverImage(post: posts.Post): {
  url: string | null;
  alt: string | null;
} {
  let coverImageUrl: string | null = null;
  if (post.media?.wixMedia?.image) {
    coverImageUrl = media.getImageUrl(post.media.wixMedia.image).url;
  } else if (post.media?.embedMedia?.thumbnail?.url) {
    coverImageUrl = post.media.embedMedia.thumbnail.url;
  }

  return {
    url: coverImageUrl,
    alt: post.media?.altText || post.title || null,
  };
}

function nonNullable<T>(value: T): value is NonNullable<T> {
  return !!value;
}

function flatMapByKey<T extends Record<string, any>, K extends keyof T>(
  collection: T[],
  key: K
): Array<NonNullable<T[K]> extends Array<infer U> ? U : NonNullable<T[K]>> {
  const values = collection.flatMap(item => {
    return item[key] || [];
  });

  const uniqueValues = [...new Set(values)];

  return uniqueValues;
}
