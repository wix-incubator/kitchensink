import { posts } from '@wix/blog';
import {
  defineService,
  implementService,
  type ServiceAPI,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import { enhancePosts, type PostWithResolvedFields } from './blog-feed-service';

export const BlogPostServiceDefinition = defineService<{
  post: Signal<PostWithResolvedFields>;
  recentPosts: Signal<PostWithResolvedFields[]>;
}>('blogPostService');

export type BlogPostServiceAPI = ServiceAPI<typeof BlogPostServiceDefinition>;

export const BlogPostService = implementService.withConfig<{
  post: PostWithResolvedFields;
  recentPosts: PostWithResolvedFields[];
}>()(BlogPostServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const postSignal = signalsService.signal<PostWithResolvedFields>(config.post);
  const recentPostsSignal = signalsService.signal<PostWithResolvedFields[]>(
    config.recentPosts
  );

  return {
    post: postSignal,
    recentPosts: recentPostsSignal,
  };
});

export type BlogPostServiceConfig = ServiceFactoryConfig<
  typeof BlogPostService
>;

export type BlogPostServiceConfigResult =
  | {
      type: 'success';
      config: BlogPostServiceConfig;
    }
  | { type: 'notFound' };

export async function loadBlogPostServiceConfig(
  postSlug?: string,
  recentPostCount: number = 3
): Promise<BlogPostServiceConfigResult> {
  try {
    if (postSlug) {
      const [getPostBySlugResult, recentPostsResult] = await Promise.all([
        posts.getPostBySlug(postSlug, {
          fieldsets: ['RICH_CONTENT'],
        }),
        posts
          .queryPosts()
          .descending('firstPublishedDate')
          .ne('slug', postSlug)
          .limit(recentPostCount)
          .find(),
      ]);

      if (!getPostBySlugResult || !getPostBySlugResult.post) {
        return { type: 'notFound' };
      }

      const [enhancedPost, ...enhancedRecentPosts] = await enhancePosts([
        getPostBySlugResult.post,
        ...recentPostsResult.items,
      ]);

      return {
        type: 'success',
        config: {
          post: enhancedPost,
          recentPosts: enhancedRecentPosts,
        },
      };
    }

    return { type: 'notFound' };
  } catch (error) {
    console.error('Failed to load initial post for slug', postSlug, error);
    return { type: 'notFound' };
  }
}
