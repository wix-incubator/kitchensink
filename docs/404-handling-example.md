# 404 Handling Pattern - Implementation Example

This document provides a complete example of implementing the 404 handling pattern for client-side services.

## Example: Blog Post Service

Here's how to implement the 404 handling pattern for a blog post service that loads posts by slug:

### 1. Service Implementation

```typescript
// src/headless/blog/blog-post-service.ts
import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  publishedDate: Date;
}

export interface BlogPostServiceAPI {
  post: Signal<BlogPost | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasPost: () => boolean;
}

export const BlogPostServiceDefinition =
  defineService<BlogPostServiceAPI>("blogPost");

export const BlogPostService = implementService.withConfig<{
  post: BlogPost;
}>()(BlogPostServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const post: Signal<BlogPost | null> = signalsService.signal(
    config.post as any
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  const hasPost = (): boolean => {
    return post.get() !== null;
  };

  return {
    post,
    isLoading,
    error,
    hasPost,
  };
});

// Define the discriminated union result type
export type BlogPostServiceConfigResult =
  | { type: "success"; config: ServiceFactoryConfig<typeof BlogPostService> }
  | { type: "notFound" };

// Load function that returns discriminated union
export async function loadBlogPostServiceConfig(
  slug: string
): Promise<BlogPostServiceConfigResult> {
  try {
    // Simulate API call to fetch blog post
    const response = await fetch(`/api/blog-posts/${slug}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { type: "notFound" };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const post = await response.json();

    if (!post) {
      return { type: "notFound" };
    }

    return {
      type: "success",
      config: {
        post,
      },
    };
  } catch (error) {
    console.error("Failed to load blog post:", error);
    return { type: "notFound" };
  }
}
```

### 2. Astro Page Implementation

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import BlogPostPage from "../../react-pages/blog/[slug]";
import { loadBlogPostServiceConfig } from "../../headless/blog/blog-post-service";

const { slug } = Astro.params;

if (!slug) {
  return Astro.redirect("/blog");
}

// Load the blog post using the discriminated union pattern
const blogPostConfigResult = await loadBlogPostServiceConfig(slug);

// Handle 404 case
if (blogPostConfigResult.type === "notFound") {
  return Astro.rewrite("/404");
}

// Extract the config from the success result
const blogPostConfig = blogPostConfigResult.config;
const postTitle = blogPostConfig.post.title;
---

<BaseLayout>
  <title>{postTitle} - Blog</title>
  <meta name="description" content={`Read ${postTitle} on our blog`} />

  <BlogPostPage
    client:load
    blogPostConfig={blogPostConfig}
    slot="body"
  />
</BaseLayout>
```

### 3. React Page Component

```tsx
// src/react-pages/blog/[slug].tsx
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  BlogPostService,
  BlogPostServiceDefinition,
} from "../../headless/blog/blog-post-service";
import { BlogPost } from "../../headless/blog/BlogPost";

interface BlogPostPageProps {
  blogPostConfig: any;
}

export default function BlogPostPage({ blogPostConfig }: BlogPostPageProps) {
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      BlogPostServiceDefinition,
      BlogPostService,
      blogPostConfig
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BlogPost.Title>
          {({ title }) => (
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          )}
        </BlogPost.Title>

        <BlogPost.Content>
          {({ content, publishedDate }) => (
            <article className="prose prose-invert max-w-none">
              <time className="text-white/60 text-sm">
                {publishedDate.toLocaleDateString()}
              </time>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>
          )}
        </BlogPost.Content>
      </div>
    </ServicesManagerProvider>
  );
}
```

## Key Benefits

1. **Type Safety**: TypeScript ensures you handle both success and not-found cases
2. **User Experience**: Users see a proper 404 page while keeping the original URL
3. **SEO**: Search engines receive proper 404 HTTP status codes for the original URL
4. **Error Separation**: Distinguishes between "not found" and actual system errors
5. **Maintainability**: Clear pattern that's easy to understand and implement
6. **Analytics**: Preserves accurate data about which URLs are being requested

## Why Rewrite Instead of Redirect?

Using `Astro.rewrite("/404")` instead of `Astro.redirect("/404")` provides several advantages:

- **Preserves Original URL**: The failing URL stays in the address bar
- **Proper HTTP Status**: Returns actual 404 HTTP status code
- **Better SEO**: Search engines don't index the 404 page as a valid page
- **Debugging**: Shows which actual path caused the error

## Pattern Checklist

- [ ] Define discriminated union type with `"success"` and `"notFound"` variants
- [ ] Return `{ type: "notFound" }` when entity doesn't exist
- [ ] Return `{ type: "success", config: ... }` when entity is found
- [ ] Handle exceptions by returning `"notFound"` (or re-throw for system errors)
- [ ] Check result type in Astro page frontmatter
- [ ] **Rewrite** to `/404` when type is `"notFound"` (not redirect)
- [ ] Ensure 404 page sets `Astro.response.status = 404`
- [ ] Extract config from success result before using

This pattern provides a robust foundation for handling missing entities across your application while maintaining excellent user experience and SEO performance.
