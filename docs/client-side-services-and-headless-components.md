# Client-Side Services and Headless Components Pattern

## Overview

This pattern separates client-side state management and business logic from UI presentation through a combination of **Client-Side Services** and **Headless Components**. This architecture enables better code reusability, testability, and maintainability by decoupling reactive state management from UI implementation.

## Architecture Principles

### 1. Separation of Concerns

- **Services**: Manage state, business logic, and API interactions
- **Headless Components**: Provide reactive data and actions through render props
- **UI Components**: Handle only presentation and user interaction

### 2. Reactive State Management

- Services use **Signals** for reactive state that automatically updates consuming components
- Headless components expose reactive data from services via render props
- UI components receive data and actions through render prop patterns

### 3. Composability

- Headless components can be composed together to build complex UIs
- Services can be combined and nested using `ServicesManagerProvider`
- Each service is isolated and can be reused across different contexts

## Client-Side Services

### What are Client-Side Services?

Client-side services are reactive state containers that:

- Encapsulate related state and business logic
- Use **Signals** for reactive state management
- Provide APIs for state mutations and computed values
- Handle side effects like API calls and data transformations
- Are isomorphic (can run on both server and client)

### Service Structure

```typescript
// Service Definition
export const MyServiceDefinition = defineService<MyServiceAPI>("myService");

// Service Implementation
export const MyService = implementService.withConfig<ConfigType>()(
  MyServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    // Reactive state using signals
    const state: Signal<StateType> = signalsService.signal(initialState as any);

    // Actions and computed values
    const updateState = (newData: StateType) => {
      state.set(newData);
    };

    return {
      state,
      updateState,
      // ... other API methods
    };
  }
);

// Configuration loader (runs on server)
export async function loadMyServiceConfig(): Promise<
  ServiceFactoryConfig<typeof MyService>
> {
  // Load initial data on server
  const data = await fetchInitialData();
  return { initialData: data };
}
```

### Key Patterns

1. **Signal Usage**: Use `signalsService.signal(value as any)` to bypass Jsonifiable constraints
2. **Configuration**: Services accept config objects with initial state and settings
3. **API Design**: Expose clear, functional APIs with actions and reactive getters
4. **Server Loading**: Provide async functions to load service configs on the server

## Headless Components

### What are Headless Components?

Headless components are React components that:

- Accept a `children` render prop function
- Use `useService()` to access service data and actions
- Expose reactive data and actions to their children
- Handle no UI rendering themselves

### Headless Component Structure

```typescript
export const MyHeadlessComponent = (props: {
  children: (props: {
    data: DataType;
    actions: ActionsType;
    computedValues: ComputedType;
  }) => React.ReactNode;
}) => {
  const service = useService(MyServiceDefinition) as ServiceAPI<
    typeof MyServiceDefinition
  >;

  // Get reactive data
  const data = service.state.get();

  // Compose data and actions for children
  return props.children({
    data,
    actions: {
      update: service.updateState,
      // ... other actions
    },
    computedValues: {
      isLoading: data.status === "loading",
      // ... other computed values
    },
  });
};
```

### Design Principles for Headless Components

1. **Single Responsibility**: Each component should handle one logical concern
2. **Atomic Design**: Break down complex UIs into smaller, composable pieces
3. **Reactive Data**: Always expose reactive values, not static snapshots
4. **Action Composition**: Group related actions together logically

## Usage Pattern

### 1. Setup Services Manager

```tsx
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";

<ServicesManagerProvider
  servicesManager={createServicesManager(
    createServicesMap()
      .addService(ServiceDefinition, Service, serviceConfig)
      .addService(AnotherServiceDefinition, AnotherService, anotherConfig)
  )}
>
  {/* Your UI components */}
</ServicesManagerProvider>;
```

### 2. Use Headless Components in UI

```tsx
<HeadlessComponent>
  {({ data, actions, computedValues }) => (
    <div>
      <h1>{data.title}</h1>
      <button
        onClick={() => actions.update(newData)}
        disabled={computedValues.isLoading}
      >
        {computedValues.isLoading ? "Loading..." : "Update"}
      </button>
    </div>
  )}
</HeadlessComponent>
```

### 3. Server-Side Integration

```astro
---
import { loadMyServiceConfig } from '../headless/services/my-service';

const serviceConfig = await loadMyServiceConfig();
---

<MyPage client:load serviceConfig={serviceConfig} />
```

## Example: Photo Upload Feature

### Service Implementation

```typescript
// photo-upload-service.ts
export interface PhotoUploadServiceAPI {
  selectedFile: Signal<File | null>;
  uploadState: Signal<UploadState>;
  dragOver: Signal<boolean>;
  previewUrl: Signal<string | null>;
  selectFile: (file: File) => void;
  clearFile: () => void;
  uploadPhoto: () => Promise<void>;
  setDragOver: (isDragOver: boolean) => void;
}

export const PhotoUploadService = implementService.withConfig<{
  maxFileSize?: number;
  allowedTypes?: string[];
}>()(PhotoUploadServiceDefinition, ({ getService, config }) => {
  // Implementation with reactive state and actions
});
```

### Headless Components

```typescript
// FileSelector - Handles file selection and drag & drop
export const FileSelector = (props: {
  children: (props: {
    selectedFile: File | null;
    dragOver: boolean;
    selectFile: (file: File) => void;
    handleDragOver: (event: React.DragEvent) => void;
    // ... other props
  }) => React.ReactNode;
}) => {
  // Implementation
};

// UploadProgress - Shows upload status
export const UploadProgress = (props: {
  children: (props: {
    uploadState: UploadState;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  }) => React.ReactNode;
}) => {
  // Implementation
};

// UploadTrigger - Handles upload action
export const UploadTrigger = (props: {
  children: (props: {
    uploadPhoto: () => Promise<void>;
    canUpload: boolean;
    isUploading: boolean;
  }) => React.ReactNode;
}) => {
  // Implementation
};
```

### UI Composition

```tsx
<ServicesManagerProvider servicesManager={servicesManager}>
  <FileSelector>
    {({ dragOver, handleDragOver, handleDrop, selectFile }) => (
      <div
        className={dragOver ? "drag-active" : ""}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadProgress>
          {({ isLoading, uploadState }) => (
            <>
              {uploadState.message && <div>{uploadState.message}</div>}
              <UploadTrigger>
                {({ uploadPhoto, canUpload }) => (
                  <button onClick={uploadPhoto} disabled={!canUpload}>
                    {isLoading ? "Uploading..." : "Upload"}
                  </button>
                )}
              </UploadTrigger>
            </>
          )}
        </UploadProgress>
      </div>
    )}
  </FileSelector>
</ServicesManagerProvider>
```

## Benefits

### 1. **Reusability**

- Services can be used across different UI implementations
- Headless components provide flexible building blocks
- Business logic is decoupled from presentation

### 2. **Testability**

- Services can be tested independently of UI
- Headless components can be tested with mock render functions
- Clear separation of concerns makes testing easier

### 3. **Maintainability**

- Changes to business logic only affect services
- UI changes don't impact business logic
- Clear interfaces between layers

### 4. **Composability**

- Mix and match headless components for different UIs
- Combine multiple services for complex features
- Build atomic UI components that can be composed

### 5. **Performance**

- Reactive updates only re-render affected components
- Services can optimize state updates and API calls
- Lazy loading and code splitting at service boundaries

## Server-Side Integration with Astro Actions

### Astro Actions for Client-Side Services

When client-side services need to perform server-only operations (like using `auth.elevate` from `@wix/essentials`), they should use Astro Actions injected through their configuration instead of making direct API calls.

#### Pattern Overview

1. **Actions File**: Create actions in the headless domain folder alongside the service
2. **Actions Registration**: Export actions from `src/actions/index.ts`
3. **Service Configuration**: Inject actions into service config
4. **Service Usage**: Services call injected actions instead of direct API calls

#### Example: Photo Upload Actions

```typescript
// src/headless/members/photo-upload-service-actions.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { auth } from "@wix/essentials";

export const photoUploadAstroActions = {
  uploadPhoto: defineAction({
    accept: "form",
    input: z.object({
      photo: z.instanceof(File),
    }),
    handler: async ({ photo }) => {
      // Server-only logic using auth.elevate
      const { uploadUrl } = await auth.elevate(files.generateFileUploadUrl)(
        photo.type,
        { fileName: photo.name, parentFolderId: "visitor-uploads" }
      );

      // Additional server-side processing...
      return { success: true, fileId, message: "Photo updated successfully" };
    },
  }),
};
```

#### Actions Registration

```typescript
// src/actions/index.ts
import { photoUploadAstroActions } from "../headless/members/photo-upload-service-actions";

export const server = {
  photoUploadAstroActions,
};
```

#### Service Integration

```typescript
// Service accepts actions directly in config
export const PhotoUploadService = implementService.withConfig<{
  maxFileSize?: number;
  allowedTypes?: string[];
  photoUploadAstroActions: {
    uploadPhoto: (formData: FormData) => Promise<any>;
  };
}>()(PhotoUploadServiceDefinition, ({ getService, config }) => {
  // Service uses the action from config
  const uploadPhoto = async (): Promise<void> => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const result = await config.photoUploadAstroActions.uploadPhoto(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return { uploadPhoto /* ... other API methods */ };
});

// Config loader returns only serializable data
export async function loadPhotoUploadServiceConfig(): Promise<
  Omit<
    ServiceFactoryConfig<typeof PhotoUploadService>,
    "photoUploadAstroActions"
  >
> {
  return {
    maxFileSize: 10 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
  };
}
```

#### Usage in React Components

Since actions are non-serializable, they must be imported and added to the config in the React component that renders the `ServicesManagerProvider`:

```typescript
// In your React component (e.g., PhotoUploadDialog.tsx)
import { photoUploadAstroActions } from "../headless/members/photo-upload-service-actions";
import { loadPhotoUploadServiceConfig } from "../headless/members/photo-upload-service";

export default function PhotoUploadDialog({ photoUploadConfig }) {
  // Combine serializable config from server with non-serializable actions
  const fullConfig = {
    ...photoUploadConfig,
    photoUploadAstroActions,
  };

  return (
    <ServicesManagerProvider
      servicesManager={createServicesManager(
        createServicesMap().addService(
          PhotoUploadServiceDefinition,
          PhotoUploadService,
          fullConfig
        )
      )}
    >
      {/* Your UI components */}
    </ServicesManagerProvider>
  );
}
```

#### Usage in Astro Pages

```astro
---
import { loadPhotoUploadServiceConfig } from '../headless/members/photo-upload-service';

// Load only the serializable config on the server
const photoUploadConfig = await loadPhotoUploadServiceConfig();
---

<PhotoUploadDialog client:load photoUploadConfig={photoUploadConfig} />
```

### Benefits of This Pattern

1. **Server-Only Logic**: Enables use of server-only APIs like `auth.elevate`
2. **Service Portability**: Services remain framework-agnostic and testable
3. **Type Safety**: Full TypeScript support through Astro Actions
4. **Performance**: Server-side processing reduces client-side workload
5. **Security**: Sensitive operations stay on the server

## 404 Handling Pattern

### Discriminated Union Results

For services that load entities that may not exist (e.g., products by slug, services by ID), the load configuration functions should return a discriminated union instead of throwing errors. This allows proper 404 handling at the page level.

#### Pattern Implementation

```typescript
// Define the result type as a discriminated union
export type ProductServiceConfigResult =
  | { type: "success"; config: ServiceFactoryConfig<typeof ProductService> }
  | { type: "notFound" };

export async function loadProductServiceConfig(
  productSlug: string
): Promise<ProductServiceConfigResult> {
  try {
    const storeProducts = await products
      .queryProducts()
      .eq("slug", productSlug)
      .find();

    if (!storeProducts.items?.[0]) {
      return { type: "notFound" };
    }

    return {
      type: "success",
      config: {
        product: storeProducts.items[0],
      },
    };
  } catch (error) {
    console.error("Failed to load product:", error);
    return { type: "notFound" };
  }
}
```

#### Usage in Astro Pages

```astro
---
import { loadProductServiceConfig } from "../../../headless/store/product-service";

const { slug } = Astro.params;

if (!slug) {
  return Astro.redirect("/store");
}

// Load initial data for services
const productServiceConfigResult = await loadProductServiceConfig(slug);

// Handle 404 case
if (productServiceConfigResult.type === "notFound") {
  return Astro.rewrite("/404");
}

const productServiceConfig = productServiceConfigResult.config;
---
```

#### 404 Page Setup

Ensure your `404.astro` page returns the proper HTTP status code:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import NotFoundPage from "../react-pages/404";

// Ensure proper 404 HTTP status code
Astro.response.status = 404;
---

<BaseLayout>
  <title>Page Not Found - 404</title>
  <meta name="description" content="The page you're looking for could not be found." />

  <NotFoundPage client:load slot="body" />
</BaseLayout>
```

#### When to Use This Pattern

Use the discriminated union pattern for load functions when:

1. **Entity-based routes**: Pages that load a specific entity by ID/slug (e.g., `[slug].astro`, `[serviceId].astro`)
2. **User-facing content**: When the entity not existing should result in a user-friendly 404 page
3. **SEO considerations**: When you want proper 404 HTTP status codes for missing content

#### Why Use Rewrite Instead of Redirect?

- **Preserves Original URL**: The failing URL stays in the address bar, helping users understand what went wrong
- **Proper HTTP Status**: Returns actual 404 HTTP status code for search engines and analytics
- **Better SEO**: Search engines don't index the 404 page as a valid page
- **Debugging**: Shows which actual path caused the error for easier troubleshooting

#### Benefits

1. **Type Safety**: The discriminated union ensures you handle both success and not-found cases
2. **User Experience**: Users get a proper 404 page while keeping the original URL
3. **SEO**: Search engines receive proper 404 HTTP status codes for the original URL
4. **Error Boundaries**: Separates "not found" from actual system errors
5. **Analytics**: Preserves accurate data about which URLs are being requested

## Best Practices

### Service Design

1. **Single Responsibility**: Each service should handle one domain area
2. **Immutable Updates**: Always create new state objects rather than mutating
3. **Error Handling**: Include error states in your service APIs
4. **Configuration**: Make services configurable through their config objects
5. **Action Injection**: Use dependency injection for server-side operations
6. **404 Handling**: Use discriminated unions for entity-loading functions that may return "not found"

### Headless Component Design

1. **Atomic Components**: Keep components small and focused
2. **Consistent APIs**: Use consistent naming patterns across components
3. **Reactive Data**: Always expose reactive values from signals
4. **Action Grouping**: Group related actions logically

### UI Integration

1. **Service Boundaries**: Use `ServicesManagerProvider` to define service scopes
2. **Lazy Loading**: Load service configs only when needed
3. **Error Boundaries**: Wrap service providers with error boundaries
4. **Performance**: Use React.memo and useMemo for expensive computations

## CurrentMemberProfile Pattern

For display-only headless components, use namespace exports for clean APIs:

```tsx
// CurrentMemberProfile.tsx - Display headless components
export const CurrentMemberProfile = {
  FullName,
  Nickname,
  Email,
  LastLoginDate,
  ActivityStatus,
  DaysMember,
  ProfilePhoto,
} as const;

// Usage
<CurrentMemberProfile.FullName>
  {({ fullName, hasFullName, firstName, lastName }) => (
    <h1>{hasFullName ? fullName : `Welcome ${firstName}!`}</h1>
  )}
</CurrentMemberProfile.FullName>

<CurrentMemberProfile.ActivityStatus>
  {({ displayStatus, isActive, statusColor }) => (
    <span className={`text-${statusColor}-400`}>
      {displayStatus} {isActive && '🟢'}
    </span>
  )}
</CurrentMemberProfile.ActivityStatus>
```

### TypeScript Patterns

Each headless component should export both Props and RenderProps interfaces:

```tsx
/**
 * Props for FullName headless component
 */
export interface FullNameProps {
  /** Render prop function that receives full name data */
  children: (props: FullNameRenderProps) => React.ReactNode;
}

/**
 * Render props for FullName component
 */
export interface FullNameRenderProps {
  /** Full name combining first and last name */
  fullName: string;
  /** First name only */
  firstName: string;
  /** Last name only */
  lastName: string;
  /** Whether both first and last names are available */
  hasFullName: boolean;
}
```

This pattern provides a robust foundation for building complex, interactive UIs while maintaining clean separation of concerns and excellent developer experience.
