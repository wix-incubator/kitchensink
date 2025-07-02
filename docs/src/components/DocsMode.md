# DocsMode Component System

## Overview

The DocsMode component system provides a comprehensive documentation overlay and interaction system for React applications. It enables developers to create interactive documentation experiences where users can click on components to view their documentation in a side drawer. The system includes context management, component discovery, highlighting, and a floating menu interface.

This system is particularly useful for design systems, component libraries, and educational applications where users need to understand how components work. It provides a seamless way to transition between regular application usage and documentation exploration without leaving the current page context.

## Exports

### `DocsContextType`
**Type**: `interface`

TypeScript interface defining the shape of the docs context, including state management for docs mode, component discovery, page registration, and drawer configuration.

### `useDocsMode`
**Type**: `() => DocsContextType`

Custom React hook that provides access to the docs context. Must be used within a DocsProvider and throws an error if used outside the provider context.

### `DocsProvider`
**Type**: `React.FC<{ children: React.ReactNode }>`

Provider component that manages the global state for docs mode functionality including mode toggling, component selection, discovery tracking, and page documentation registration.

### `withDocsWrapper`
**Type**: `<T extends Record<string, any>>(renderPropFn: (props: T) => React.ReactNode, componentName: string, componentPath: string) => (props: T) => React.ReactNode`

Higher-order function that wraps render prop children with docs highlighting and click handling. Automatically registers components for discovery and provides interactive overlays in docs mode.

### `DocsDrawer`
**Type**: `React.FC`

Side drawer component that displays documentation content in an iframe with loading states, close functionality, and responsive design. Supports both normal and wide drawer modes.

### `DocsToggleButton`
**Type**: `React.FC`

Floating action button that toggles docs mode on/off and displays the count of discovered components. Positioned as a fixed overlay with visual state indicators.

### `DocsFloatingMenu`
**Type**: `React.FC`

Floating menu component that provides access to page docs, general docs, and discovered components. Features expandable sections with smooth animations and categorized documentation access.

### `PageDocsRegistration`
**Type**: `React.FC<PageDocsRegistrationProps>`

Utility component for pages to register their documentation metadata. Automatically registers and cleans up page documentation when the component mounts/unmounts.

## Usage Examples

### Basic Setup with DocsProvider
```tsx
import { DocsProvider, DocsToggleButton, DocsDrawer, DocsFloatingMenu } from './components/DocsMode';

function App() {
  return (
    <DocsProvider>
      <YourAppContent />
      <DocsToggleButton />
      <DocsDrawer />
      <DocsFloatingMenu />
    </DocsProvider>
  );
}
```

### Using the DocsMode Hook
```tsx
import { useDocsMode } from './components/DocsMode';

function MyComponent() {
  const { isDocsMode, openDocs, registerComponent } = useDocsMode();
  
  useEffect(() => {
    return registerComponent('MyComponent', '/docs/components/my-component');
  }, []);
  
  return (
    <div onClick={() => isDocsMode && openDocs('/docs/components/my-component')}>
      My Component Content
    </div>
  );
}
```

### Wrapping Components with Documentation
```tsx
import { withDocsWrapper } from './components/DocsMode';

const DocumentedButton = withDocsWrapper(
  ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  'Button Component',
  '/docs/components/button'
);

function Usage() {
  return (
    <DocumentedButton onClick={() => console.log('clicked')}>
      Click me
    </DocumentedButton>
  );
}
```

### Registering Page Documentation
```tsx
import { PageDocsRegistration } from './components/DocsMode';

function ProductPage() {
  return (
    <>
      <PageDocsRegistration
        title="Product Catalog"
        description="Browse and filter products with advanced search capabilities"
        docsUrl="/docs/pages/product-catalog"
      />
      <div>
        Product page content here...
      </div>
    </>
  );
}
```

### Complete Documentation-Enabled Application
```tsx
import { 
  DocsProvider, 
  DocsToggleButton, 
  DocsDrawer, 
  DocsFloatingMenu,
  withDocsWrapper,
  PageDocsRegistration 
} from './components/DocsMode';

// Wrap your components with documentation
const DocumentedHeader = withDocsWrapper(
  ({ title }) => <header><h1>{title}</h1></header>,
  'Header Component',
  '/docs/components/header'
);

const DocumentedButton = withDocsWrapper(
  ({ children, ...props }) => <button {...props}>{children}</button>,
  'Button Component', 
  '/docs/components/button'
);

function App() {
  return (
    <DocsProvider>
      <PageDocsRegistration
        title="Home Page"
        description="Main application landing page with overview and navigation"
        docsUrl="/docs/pages/home"
      />
      
      <DocumentedHeader title="My App" />
      
      <main>
        <DocumentedButton onClick={() => alert('Hello!')}>
          Get Started
        </DocumentedButton>
      </main>
      
      {/* Docs UI */}
      <DocsToggleButton />
      <DocsDrawer />
      <DocsFloatingMenu />
    </DocsProvider>
  );
}
```
