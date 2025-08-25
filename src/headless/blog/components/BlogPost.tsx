import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import {
  BlogPostServiceDefinition,
  type BlogPostServiceAPI,
} from '../services/blog-post-service';
import type { PostWithResolvedFields } from '../services';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
}

export interface RootRenderProps {
  post: ReturnType<BlogPostServiceAPI['post']['get']>;
}

export const Root = (props: RootProps) => {
  const service = useService(BlogPostServiceDefinition);

  return props.children({
    post: service.post.get(),
  });
};

export interface ContentProps {
  children: (props: ContentRenderProps) => React.ReactNode;
}

export interface ContentRenderProps {
  ricosViewerContent: any;
}

export const Content = (props: ContentProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  if (!post || !post.richContent) {
    return null;
  }

  const richContent = post.richContent;

  return props.children({
    ricosViewerContent: richContent,
  });
};

export interface CoverImageProps {
  children: (props: CoverImageRenderProps) => React.ReactNode;
}

export interface CoverImageRenderProps {
  coverImageUrl: string | null;
  coverImageAlt: string | null;
}

export const CoverImage = (props: CoverImageProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  return props.children({
    coverImageUrl: post.resolvedFields.coverImageUrl,
    coverImageAlt: post.resolvedFields.coverImageAlt,
  });
};

export interface AuthorProps {
  children: (props: AuthorRenderProps) => React.ReactNode;
}

export interface AuthorRenderProps {
  authorName: string;
  authorNickname: string;
  hasAuthor: boolean;
  authorImageUrl: string | null;
  hasAuthorImage: boolean;
}

export const Author = (props: AuthorProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  if (!post) {
    return null;
  }

  const authorName = post.resolvedFields.owner?.contact?.firstName
    ? `${post.resolvedFields.owner.contact.firstName} ${post.resolvedFields.owner.contact.lastName || ''}`.trim()
    : '';
  const authorNickname = post.resolvedFields.owner?.profile?.nickname || '';
  const hasAuthor = Boolean(authorName || authorNickname);

  const authorImageUrl = post.resolvedFields.owner?.profile?.photo?.url || null;
  const hasAuthorImage = Boolean(authorImageUrl);

  return props.children({
    authorName,
    authorNickname,
    hasAuthor,
    authorImageUrl,
    hasAuthorImage,
  });
};

export interface PublishDateProps {
  children: (props: PublishDateRenderProps) => React.ReactNode;
}

export interface PublishDateRenderProps {
  publishDate: Date;
  formattedDate: string;
  hasPublishDate: boolean;
}

export const PublishDate = (props: PublishDateProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  if (!post) {
    return null;
  }

  const publishDate = post.firstPublishedDate
    ? new Date(post.firstPublishedDate)
    : new Date();
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const hasPublishDate = Boolean(post.firstPublishedDate);

  return props.children({
    publishDate,
    formattedDate,
    hasPublishDate,
  });
};

export interface ReadingTimeProps {
  children: (props: ReadingTimeRenderProps) => React.ReactNode;
}

export interface ReadingTimeRenderProps {
  readingTime: number;
  formattedReadingTime: string;
  hasReadingTime: boolean;
}

export const ReadingTime = (props: ReadingTimeProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  if (!post) {
    return null;
  }

  const readingTime = post.minutesToRead ?? 0;
  const formattedReadingTime = `${readingTime} min read`;
  const hasReadingTime = readingTime > 0;

  return props.children({
    readingTime,
    formattedReadingTime,
    hasReadingTime,
  });
};

export interface TagsProps {
  children: (props: TagsRenderProps) => React.ReactNode;
}

export interface TagsRenderProps {
  tags: string[];
}

export const Tags = (props: TagsProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();
  const tags = post.resolvedFields.tags
    .map(tag => tag.label || '')
    .filter(Boolean);

  if (tags.length === 0) {
    return null;
  }

  return props.children({
    tags,
  });
};

export interface CategoriesProps {
  children: (props: CategoriesRenderProps) => React.ReactNode;
}

export interface CategoriesRenderProps {
  categories: string[];
}

export const Categories = (props: CategoriesProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  if (!post) {
    return null;
  }

  const categories = post.resolvedFields.categories
    .map(cat => cat.label || '')
    .filter(Boolean);

  return props.children({
    categories,
  });
};

export interface ShareUrlToFacebookProps {
  href: string;
  children: (props: ShareUrlToFacebookRenderProps) => React.ReactNode;
}

export interface ShareUrlToFacebookRenderProps {
  url: string;
}

export const ShareUrlToFacebook = (props: ShareUrlToFacebookProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      href
    )}`,
  });
};

export interface ShareUrlToXProps {
  href: string;
  children: (props: ShareUrlToXRenderProps) => React.ReactNode;
}

export interface ShareUrlToXRenderProps {
  url: string;
}

export const ShareUrlToX = (props: ShareUrlToXProps) => {
  const { href } = props;

  return props.children({
    url: `https://x.com/share?url=${encodeURIComponent(href)}`,
  });
};

export interface ShareUrlToLinkedInProps {
  href: string;
  children: (props: ShareUrlToLinkedInRenderProps) => React.ReactNode;
}

export interface ShareUrlToLinkedInRenderProps {
  url: string;
}

export const ShareUrlToLinkedIn = (props: ShareUrlToLinkedInProps) => {
  const { href } = props;

  return props.children({
    url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(href)}`,
  });
};

interface RecentPostsProps {
  children: (props: RecentPostsRenderProps) => React.ReactNode;
}

export interface RecentPostsRenderProps {
  recentPosts: PostWithResolvedFields[];
}

export const RecentPosts = (props: RecentPostsProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const recentPosts = service.recentPosts.get();

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  return props.children({
    recentPosts,
  });
};
