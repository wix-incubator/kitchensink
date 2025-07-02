# DocsLayout Component

## Overview

The `DocsLayout` is an Astro layout component specifically designed for documentation pages. It extends the BaseLayout and provides specialized styling, typography, and components for displaying technical documentation. The layout includes a table of contents component, comprehensive CSS styling for documentation content, and responsive design optimized for reading technical content.

## Exports

### DocsLayout (Default Export)

```astro
---
import BaseLayout from "./BaseLayout.astro";
import { TableOfContents } from "../components/TableOfContents";
---

<BaseLayout>
  <title>Documentation</title>
  <meta name="description" content="Component documentation" />
  <link rel="stylesheet" href="/src/styles/docs.css" />
  
  <!-- Comprehensive documentation styling -->
  <style is:global>
    /* Documentation-specific styles */
  </style>
  
  <div slot="body">
    <div class="docs-content">
      <TableOfContents client:load />
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</BaseLayout>
```

An Astro layout component that provides a comprehensive documentation environment with table of contents, optimized typography, and styled content areas.

**Features:**
- Extends BaseLayout for core HTML structure
- Includes TableOfContents component for navigation
- Comprehensive CSS styling for documentation content
- Responsive design optimized for technical reading
- Typography optimized for code and prose

## Usage Examples

### Basic Documentation Page

```astro
---
// src/pages/docs/getting-started.astro
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Getting Started</h1>
  
  <p>Welcome to our documentation. This guide will help you get started with our components.</p>
  
  <h2>Installation</h2>
  <pre><code>npm install @our/components</code></pre>
  
  <h2>Basic Usage</h2>
  <p>Here's how to use our components:</p>
  
  <code>
    import { Button } from '@our/components';
    
    function App() {
      return <Button>Click me</Button>;
    }
  </code>
</DocsLayout>
```

### API Documentation Page

```astro
---
// src/pages/docs/api/button.astro
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Button Component</h1>
  
  <div class="api-section">
    <h2>Props</h2>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>variant</code></td>
          <td><code>string</code></td>
          <td><code>"primary"</code></td>
          <td>Button style variant</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="example-section">
    <h2>Examples</h2>
    <div class="example">
      <h3>Basic Button</h3>
      <pre><code>&lt;Button&gt;Click me&lt;/Button&gt;</code></pre>
    </div>
  </div>
</DocsLayout>
```

### Multi-Section Documentation

```astro
---
// src/pages/docs/components/overview.astro
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Component Overview</h1>
  
  <div class="overview-intro">
    <p>Our component library provides a comprehensive set of reusable UI components.</p>
  </div>
  
  <h2>Form Components</h2>
  <div class="component-grid">
    <div class="component-card">
      <h3><a href="/docs/components/button">Button</a></h3>
      <p>Interactive button component with multiple variants.</p>
    </div>
    <div class="component-card">
      <h3><a href="/docs/components/input">Input</a></h3>
      <p>Text input component with validation support.</p>
    </div>
  </div>
  
  <h2>Layout Components</h2>
  <div class="component-grid">
    <div class="component-card">
      <h3><a href="/docs/components/container">Container</a></h3>
      <p>Responsive container for content layout.</p>
    </div>
  </div>
  
  <h2>Navigation</h2>
  <ul>
    <li><a href="/docs/getting-started">Getting Started</a></li>
    <li><a href="/docs/theming">Theming</a></li>
    <li><a href="/docs/examples">Examples</a></li>
  </ul>
</DocsLayout>
```

### Code-Heavy Documentation

```astro
---
// src/pages/docs/examples/advanced.astro
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Advanced Examples</h1>
  
  <h2>Custom Hook Usage</h2>
  <p>Here's how to use our custom hooks in your components:</p>
  
  <pre><code class="language-tsx">
import { useLocalStorage, useDebounce } from '@our/hooks';

function SearchComponent() {
  const [query, setQuery] = useLocalStorage('searchQuery', '');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    &lt;input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    /&gt;
  );
}
  </code></pre>
  
  <h2>Integration Patterns</h2>
  <p>Common patterns for integrating with external libraries:</p>
  
  <div class="code-example">
    <pre><code class="language-jsx">
// Using with React Query
function DataComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });
  
  if (isLoading) return &lt;LoadingSpinner /&gt;;
  if (error) return &lt;ErrorMessage error={error} /&gt;;
  
  return (
    &lt;div&gt;
      {data.map(post => (
        &lt;PostCard key={post.id} post={post} /&gt;
      ))}
    &lt;/div&gt;
  );
}
    </code></pre>
  </div>
</DocsLayout>
```

### MDX Integration

```astro
---
// src/pages/docs/guides/[...slug].astro
import DocsLayout from '../../../layouts/DocsLayout.astro';

export async function getStaticPaths() {
  const posts = await Astro.glob('../../../content/docs/guides/*.mdx');
  return posts.map(post => ({
    params: { slug: post.file.split('/').pop().replace('.mdx', '') },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content, frontmatter } = post;
---

<DocsLayout>
  <article class="prose">
    <header class="doc-header">
      <h1>{frontmatter.title}</h1>
      {frontmatter.description && (
        <p class="lead">{frontmatter.description}</p>
      )}
      {frontmatter.lastUpdated && (
        <p class="last-updated">
          Last updated: {new Date(frontmatter.lastUpdated).toLocaleDateString()}
        </p>
      )}
    </header>
    
    <Content />
  </article>
</DocsLayout>
```

### Documentation with Search

```astro
---
// src/pages/docs/search.astro
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout>
  <h1>Documentation Search</h1>
  
  <div class="search-container">
    <input 
      type="search" 
      placeholder="Search documentation..." 
      class="search-input"
      id="doc-search"
    />
    <div id="search-results" class="search-results"></div>
  </div>
  
  <script>
    // Client-side search functionality
    const searchInput = document.getElementById('doc-search');
    const resultsContainer = document.getElementById('search-results');
    
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value;
      if (query.length > 2) {
        const results = await searchDocs(query);
        displayResults(results);
      } else {
        resultsContainer.innerHTML = '';
      }
    });
    
    function displayResults(results) {
      resultsContainer.innerHTML = results.map(result => `
        <div class="search-result">
          <h3><a href="${result.url}">${result.title}</a></h3>
          <p>${result.excerpt}</p>
        </div>
      `).join('');
    }
  </script>
</DocsLayout>
```

## Key Features

- **Table of Contents**: Automatic navigation generation with TableOfContents component
- **Typography Optimization**: Professional typography for technical content
- **Code Syntax Highlighting**: Styled code blocks and inline code
- **Responsive Design**: Optimized for both desktop and mobile reading
- **Documentation-Specific Styles**: Custom CSS for tables, code examples, and API documentation
- **Content Structure**: Organized layout with proper spacing and hierarchy
- **Professional Appearance**: Gradient background and modern design
- **Accessibility**: Proper contrast ratios and semantic HTML structure

## Styling Features

- **Inter Font Family**: Modern, readable font for technical content
- **Optimized Line Height**: 1.6 for comfortable reading
- **Color Scheme**: Professional gray color palette
- **Gradient Background**: Subtle gradient from light gray tones
- **Content Container**: Max-width container for optimal reading line length
- **Spacing System**: Consistent margins and padding throughout

## Dependencies

- **BaseLayout**: Extends the base HTML structure
- **TableOfContents**: Component for document navigation
- **docs.css**: Additional documentation-specific styles
- **Global Styles**: Comprehensive CSS reset and documentation styling

The DocsLayout provides a complete documentation environment optimized for technical content, code examples, and API documentation with professional styling and navigation.
