# Navigation Context

## Overview

The NavigationContext provides a flexible navigation system that allows applications to use different navigation implementations (like React Router, Next.js Router, or simple anchor tags) throughout the application. It uses React Context to provide a consistent navigation interface while allowing the underlying navigation mechanism to be swapped out easily.

This system is particularly useful for component libraries or applications that need to support multiple routing systems, or when building components that should work in different navigation environments without tight coupling to specific router implementations.

## Exports

### `NavigationProps`
**Type**: `interface`

Props interface for navigation components including route destination, children content, and additional props that will be passed through to the underlying navigation implementation.

### `NavigationComponent`
**Type**: `React.ComponentType<NavigationProps>`

Type definition for navigation components that can be used with the navigation context. Must accept NavigationProps and render appropriate navigation elements.

### `NavigationProvider`
**Type**: `React.FC<NavigationProviderProps>`

Provider component that sets up the navigation context with a specific navigation implementation. Defaults to anchor tag navigation if no custom component is provided.

### `useNavigation`
**Type**: `() => NavigationComponent`

Hook that returns the current navigation component from context. Returns default anchor tag navigation if used outside of provider context.

### `DefaultNavigationComponent`
**Type**: `NavigationComponent`

Default navigation implementation that renders standard anchor tags. Used as fallback when no custom navigation component is provided.

## Usage Examples

### Basic Setup with Default Navigation
```tsx
import { NavigationProvider, useNavigation } from './components/NavigationContext';

function App() {
  return (
    <NavigationProvider>
      <Header />
      <MainContent />
    </NavigationProvider>
  );
}

function Header() {
  const Navigation = useNavigation();
  
  return (
    <nav>
      <Navigation route="/">Home</Navigation>
      <Navigation route="/about">About</Navigation>
      <Navigation route="/contact">Contact</Navigation>
    </nav>
  );
}
```

### With React Router Integration
```tsx
import { NavigationProvider } from './components/NavigationContext';
import { Link } from 'react-router-dom';

const ReactRouterNavigation = ({ route, children, ...props }) => (
  <Link to={route} {...props}>
    {children}
  </Link>
);

function App() {
  return (
    <NavigationProvider navigationComponent={ReactRouterNavigation}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
    </NavigationProvider>
  );
}
```

### With Next.js Integration
```tsx
import { NavigationProvider } from './components/NavigationContext';
import Link from 'next/link';

const NextJsNavigation = ({ route, children, ...props }) => (
  <Link href={route}>
    <a {...props}>{children}</a>
  </Link>
);

function MyApp({ Component, pageProps }) {
  return (
    <NavigationProvider navigationComponent={NextJsNavigation}>
      <Component {...pageProps} />
    </NavigationProvider>
  );
}
```
