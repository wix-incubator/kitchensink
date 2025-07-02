# Kitchensink Layout

## Overview

The KitchensinkLayout is a comprehensive layout component designed for demo and showcase applications. It provides a visually striking gradient background, floating navigation menu, and complete integration with the documentation system. The layout includes an animated hamburger menu with navigation links to different sections, docs mode integration, and decorative visual elements.

This layout is specifically designed for "kitchen sink" style applications that showcase multiple features and components. It combines beautiful visual design with functional navigation and documentation capabilities, making it ideal for demos, portfolios, or multi-feature applications.

## Exports

### `KitchensinkLayoutProps`
**Type**: `interface`

Props interface for the KitchensinkLayout component.
- `children`: React.ReactNode - Child components to be rendered within the layout

### `KitchensinkLayout`
**Type**: `React.FC<KitchensinkLayoutProps>`

Main layout component that provides gradient background, floating navigation menu, docs mode integration, and decorative visual elements. Includes responsive design and smooth animations.

## Usage Examples

### Basic Layout Usage
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function App() {
  return (
    <KitchensinkLayout>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome to Our App
        </h1>
        <p className="text-white/80 text-center mt-4">
          Explore our features and components
        </p>
      </main>
    </KitchensinkLayout>
  );
}
```

### Home Page Implementation
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function HomePage() {
  return (
    <KitchensinkLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">
            Demo Application
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Discover our comprehensive suite of components and features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              title="E-commerce"
              description="Complete shopping experience"
              link="/store"
            />
            <FeatureCard
              title="Members"
              description="User management system"
              link="/members"
            />
            <FeatureCard
              title="Bookings"
              description="Appointment scheduling"
              link="/bookings"
            />
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}

function FeatureCard({ title, description, link }) {
  return (
    <a
      href={link}
      className="block p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </a>
  );
}
```

### Feature Showcase Page
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';
import { PageDocsRegistration } from '../components/DocsMode';

function ComponentShowcase() {
  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Component Showcase"
        description="Interactive demonstration of all available components"
        docsUrl="/docs/components/showcase"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Component Library
          </h1>
          <p className="text-white/80 text-xl">
            Click the docs button to explore components interactively
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ComponentSection title="Forms">
            <FormComponents />
          </ComponentSection>
          
          <ComponentSection title="Navigation">
            <NavigationComponents />
          </ComponentSection>
          
          <ComponentSection title="E-commerce">
            <EcommerceComponents />
          </ComponentSection>
          
          <ComponentSection title="Media">
            <MediaComponents />
          </ComponentSection>
        </div>
      </div>
    </KitchensinkLayout>
  );
}

function ComponentSection({ title, children }) {
  return (
    <section className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
```

### Multi-Section Landing Page
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function LandingPage() {
  return (
    <KitchensinkLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Beautiful Applications
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Built with modern tools and best practices
          </p>
          <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-xl backdrop-blur-lg border border-white/30 transition-all duration-300">
            Get Started
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🛍️"
              title="E-commerce Ready"
              description="Complete shopping cart and checkout system"
            />
            <FeatureCard
              icon="👥"
              title="Member Management"
              description="User profiles and authentication"
            />
            <FeatureCard
              icon="📅"
              title="Booking System"
              description="Appointment and reservation management"
            />
          </div>
        </div>
      </section>
      
      {/* Documentation Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Interactive Documentation
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Use the docs toggle to explore components in real-time
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 max-w-2xl mx-auto">
            <p className="text-white/90">
              Click the documentation button in the top-left corner to enter docs mode 
              and interact with any component on the page.
            </p>
          </div>
        </div>
      </section>
    </KitchensinkLayout>
  );
}
```

### Portfolio Style Layout
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function Portfolio() {
  return (
    <KitchensinkLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            My Portfolio
          </h1>
          <p className="text-white/80 text-xl">
            Showcase of projects and capabilities
          </p>
        </header>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        
        {/* Skills Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-lg border border-white/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </KitchensinkLayout>
  );
}
```

### Dashboard Style Implementation
```tsx
import { KitchensinkLayout } from './layouts/KitchensinkLayout';

function Dashboard() {
  return (
    <KitchensinkLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <StatCard label="Total Users" value="1,234" />
                <StatCard label="Revenue" value="$12,345" />
                <StatCard label="Orders" value="567" />
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Analytics Dashboard
              </h2>
              <DashboardCharts />
            </div>
          </main>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
```
