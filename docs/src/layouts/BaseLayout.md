# BaseLayout Component

## Overview

The `BaseLayout` is an Astro layout component that provides the fundamental HTML structure for the application. It sets up the basic HTML document structure with meta tags, viewport configuration, client-side routing capabilities, and slot-based content injection. This layout serves as the foundation for all other layouts and pages in the application.

## Exports

### BaseLayout (Default Export)

```astro
---
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <ClientRouter />
    <slot />
  </head>
  <body>
    <slot name="body" />
  </body>
</html>
```

An Astro layout component that provides the basic HTML document structure with responsive viewport settings and client-side routing support.

**Slots:**
- Default slot: Content injected into the `<head>` section
- `body` slot: Content injected into the `<body>` section

## Usage Examples

### Basic Page Layout

```astro
---
// src/pages/example.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Example Page</title>
  <meta name="description" content="An example page" />
  
  <div slot="body">
    <h1>Welcome to Example Page</h1>
    <p>This content goes in the body.</p>
  </div>
</BaseLayout>
```

### Page with Custom Head Content

```astro
---
// src/pages/product.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Product Details | My Store</title>
  <meta name="description" content="Product description for SEO" />
  <meta property="og:title" content="Product Details" />
  <meta property="og:description" content="Product description" />
  <link rel="canonical" href="https://mystore.com/product" />
  
  <main slot="body">
    <div class="container">
      <h1>Product Name</h1>
      <div class="product-details">
        <!-- Product content -->
      </div>
    </div>
  </main>
</BaseLayout>
```

### Layout with Custom Scripts

```astro
---
// src/pages/interactive.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Interactive Page</title>
  <script>
    // Custom JavaScript for this page
    console.log('Page loaded');
  </script>
  <style>
    /* Page-specific styles */
    .interactive-content {
      background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
    }
  </style>
  
  <div slot="body" class="interactive-content">
    <h1>Interactive Content</h1>
    <button id="interactive-btn">Click Me</button>
  </div>
</BaseLayout>
```

### Multi-Language Support

```astro
---
// src/pages/es/inicio.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout>
  <title>Página de Inicio</title>
  <meta name="description" content="Página de inicio en español" />
  <html lang="es">
  
  <div slot="body">
    <header>
      <h1>Bienvenido</h1>
    </header>
    <main>
      <p>Contenido en español.</p>
    </main>
  </div>
</BaseLayout>
```

### Extended Layout Pattern

```astro
---
// src/layouts/StorePageLayout.astro
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<BaseLayout>
  <title>{title} | My Store</title>
  {description && <meta name="description" content={description} />}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <div slot="body">
    <header class="store-header">
      <nav>
        <a href="/store">Store</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
    
    <main class="store-main">
      <slot />
    </main>
    
    <footer class="store-footer">
      <p>&copy; 2023 My Store</p>
    </footer>
  </div>
</BaseLayout>
```

### SEO-Optimized Usage

```astro
---
// src/pages/blog/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  // Generate paths for blog posts
}

const { slug } = Astro.params;
const post = await getPost(slug);
---

<BaseLayout>
  <title>{post.title} | My Blog</title>
  <meta name="description" content={post.excerpt} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:image" content={post.featuredImage} />
  <meta property="og:url" content={`https://myblog.com/blog/${slug}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href={`https://myblog.com/blog/${slug}`} />
  
  <article slot="body">
    <header>
      <h1>{post.title}</h1>
      <time>{post.publishedAt}</time>
    </header>
    <div set:html={post.content} />
  </article>
</BaseLayout>
```

### Development vs Production

```astro
---
// src/pages/development-example.astro
import BaseLayout from '../layouts/BaseLayout.astro';

const isDev = import.meta.env.DEV;
---

<BaseLayout>
  <title>Development Example</title>
  
  {isDev && (
    <script>
      // Development-only scripts
      console.log('Development mode active');
    </script>
  )}
  
  <div slot="body">
    <h1>Content</h1>
    {isDev && <div class="dev-tools">Development Tools</div>}
  </div>
</BaseLayout>
```

## Key Features

- **Responsive Viewport**: Properly configured viewport meta tag for mobile responsiveness
- **Client-Side Routing**: Integrated Astro ClientRouter for smooth page transitions
- **Global Styles**: Automatic inclusion of global CSS styles
- **Flexible Slots**: Separate slots for head and body content injection
- **HTML5 Structure**: Semantic HTML5 document structure
- **UTF-8 Encoding**: Proper character encoding setup
- **Language Support**: Lang attribute set to English by default
- **SEO Ready**: Basic meta tags structure for search engine optimization

## Dependencies

- **astro:transitions**: Astro's client-side routing capabilities
- **global.css**: Application-wide CSS styles

The BaseLayout provides a solid foundation for building consistent, accessible, and SEO-friendly web pages with Astro's component architecture.
