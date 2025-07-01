# Wix Kitchensink

A comprehensive showcase of Wix platform features with working implementations, interactive examples, and comprehensive documentation. Built with Astro, React, and TypeScript.

## Features

- **Members Management** - Complete authentication, profile management, and member data handling
- **File Uploads** - Profile photo upload with drag & drop support
- **Reactive Architecture** - Client-side services with headless components pattern
- **Server Integration** - Astro Actions for secure server-side operations
- **📚 Interactive Documentation** - Inline docs mode with component discovery
- **Wix Stores**: E-commerce functionality with product catalogs, shopping cart, and checkout
- **Wix Bookings**: Appointment scheduling and service management
- **React Router Store**: Single-page application demo with client-side routing

## 📚 Interactive Documentation System

This project features a unique **docs mode** that lets you explore headless components directly within the application:

### How it Works

1. **Click the docs button** (📄 icon) next to the navigation menu
2. **Enter docs mode** - headless components are highlighted with blue borders
3. **Click any highlighted component** to open its documentation in a drawer
4. **Browse discovered components** in the floating components list

### Features

- **Component Discovery** - Automatically finds and highlights headless components on each page
- **Real-time Documentation** - Click components to see their docs, props, and usage examples
- **Framework Documentation** - Comprehensive guides on the architecture and patterns
- **Implementation Examples** - See how components are used in real applications

### Documentation Sections

- **Architecture & Patterns** - Core concepts and design principles
- **Headless Components** - Individual component documentation with examples
- **Client-Side Services** - State management and business logic services
- **Examples & Use Cases** - Complete implementations and patterns

## Architecture

This project uses a unique **Client-Side Services & Headless Components** architecture:

### Client-Side Services

- Reactive state management using Signals
- Business logic encapsulation
- Server-side integration through Astro Actions
- Service dependencies and composition

### Headless Components

- Render prop pattern for maximum flexibility
- Complete separation of logic and presentation
- Composable and reusable across different UIs
- Type-safe interfaces throughout

### Benefits

- **Reusability** - Services work across different UI implementations
- **Testability** - Clear boundaries between logic and presentation
- **Maintainability** - Changes to business logic don't affect UI
- **Performance** - Reactive updates only re-render affected components

## React Router Implementation

The `/react-router` page demonstrates how to implement a single-page application using React Router for client-side navigation. This implementation includes:

### Features
- **Client-side routing** using React Router DOM
- **Nested routes** under `/react-router` base path:
  - `/react-router/store` - Product list with filters and search
  - `/react-router/products/:slug` - Product details page
  - `/react-router/cart` - Shopping cart with full functionality
- **Shared navigation** with active state indicators
- **Wix Services integration** with proper context management
- **Theme consistency** using Wix Vibe theme
- **Error boundaries** and loading states

### Route Structure
```
/react-router/
├── store/          # Product catalog and filtering
├── products/:slug  # Individual product details  
└── cart/           # Shopping cart and checkout
```

### Key Implementation Details

#### **Architecture**
- **Single Astro page** (`/react-router`) with `client:only="react"` directive
- **React Router's BrowserRouter** with `basename="/react-router"`
- **WixServicesProvider** wrapping all routes for headless component functionality
- **StoreLayout** providing consistent navigation and styling
- **Conditional navigation** with React Router Link components for internal routing

#### **Component Adaptations**
- **CartRouter component**: React Router-compatible version of Cart with Link navigation
- **ProductDetails enhancement**: Accepts `cartUrl` prop for flexible cart navigation
- **ProductList integration**: Uses `productPageRoute` prop for correct product links

#### **Error Handling**
- **Loading fallback** while React Router initializes
- **404 handling** with automatic redirects to store
- **Product not found** with user-friendly error messages
- **Navigation breadcrumbs** showing current section

### Usage

Visit `/react-router` to experience the full single-page application with:
1. **Browse products** in the store section
2. **View product details** with full variant selection
3. **Add items to cart** and manage quantities
4. **Navigate seamlessly** without page reloads

This demonstrates how to integrate Wix headless components with modern React Router for building fast, interactive e-commerce experiences.

## Project Structure

```
src/
├── pages/                    # Astro pages
│   ├── docs/                # Documentation (MDX files)
│   └── members/             # Example member pages
├── react-pages/             # React page components
├── headless/                # Headless components & services
│   └── members/             # Member-related headless components
├── components/              # UI components
│   └── DocsMode.tsx         # Documentation system
├── layouts/                 # Layout components
└── styles/                  # Global styles
```

## Contributing

This project serves as both a learning resource and a reference implementation. Contributions are welcome!

### Adding New Features

1. **Create the service** in `src/headless/[domain]/`
2. **Add headless components** using the render prop pattern
3. **Create documentation** in `src/pages/docs/`
4. **Add docs wrappers** for component discovery
5. **Update examples** and implementation guides

### Documentation

All headless components should include:

- Comprehensive TypeScript interfaces
- Usage examples with multiple scenarios
- Integration patterns and best practices
- Testing strategies and examples

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with 💜 by the Wix Developer Experience Team**

_This project showcases the power of Wix's platform combined with modern web development practices. It's designed to be both educational and practical, providing real implementations you can learn from and build upon._
