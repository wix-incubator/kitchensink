import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { BlogFeedServiceDefinition } from '../services/blog-feed-service';
import type {
  BlogFeedServiceAPI,
  PostWithResolvedFields,
} from '../services/blog-feed-service';
import type { categories, tags } from '@wix/blog';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
}

export interface RootRenderProps {}

export const Root = (props: RootProps) => {
  const service = useService(BlogFeedServiceDefinition);

  return props.children({});
};

export interface PostsProps {
  children: (props: PostsRenderProps) => React.ReactNode;
}

export interface PostsRenderProps {
  posts: ReturnType<BlogFeedServiceAPI['posts']['get']>;
  isLoading: ReturnType<BlogFeedServiceAPI['isLoading']['get']>;
  isEmpty: ReturnType<BlogFeedServiceAPI['isEmpty']>;
  hasNextPage: ReturnType<BlogFeedServiceAPI['hasNextPage']>;
  loadNextPage: BlogFeedServiceAPI['loadNextPage'];
}

export const Posts = (props: PostsProps) => {
  const service = useService(BlogFeedServiceDefinition);

  return props.children({
    posts: service.posts.get(),
    isLoading: service.isLoading.get(),
    isEmpty: service.isEmpty(),
    hasNextPage: service.hasNextPage(),
    loadNextPage: service.loadNextPage,
  });
};

export interface ItemProps {
  post: PostWithResolvedFields;
  children: (props: ItemRenderProps) => React.ReactNode;
}

export interface ItemRenderProps {
  postId: string;
  slug: string;
  title: string;
  excerpt: string;
  publishDate: Date;
  publishDateFormatted: string;
  authorName: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  categories: categories.Category[];
  tags: tags.BlogTag[];
  minutesToRead: number | undefined;
}

export const Item = (props: ItemProps) => {
  const { post } = props;

  const publishDate = post.firstPublishedDate
    ? new Date(post.firstPublishedDate)
    : new Date();

  return props.children({
    postId: post._id || '',
    slug: post.slug || '',
    title: post.title || '',
    excerpt: post.excerpt || '',
    publishDate,
    publishDateFormatted: publishDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    authorName:
      post.resolvedFields.owner?.profile?.nickname ||
      `${post.resolvedFields.owner?.contact?.firstName} ${post.resolvedFields.owner?.contact?.lastName}`.trim() ||
      null,
    minutesToRead: post.minutesToRead,
    coverImageUrl: post.resolvedFields.coverImageUrl,
    coverImageAlt: post.resolvedFields.coverImageAlt,
    categories: post.resolvedFields.categories,
    tags: post.resolvedFields.tags,
  });
};
