# Generic File Upload Service and Components

## Overview

We have successfully extracted a generic file upload service and headless components from the photo upload implementation. This provides a reusable foundation for any type of file upload functionality.

## Files Created

### Core Generic Components

1. **`src/headless/media/file-upload-service.ts`** - Generic file upload service
2. **`src/headless/media/FileUpload.tsx`** - Generic headless components
3. **`src/headless/media/file-upload-actions.ts`** - Generic server-side file upload actions
4. **`src/headless/media/photo-upload-actions.ts`** - Photo-specific actions using the generic service

### Updated Files

1. **Photo Upload Components** - Use generic headless components directly
2. **`src/react-pages/members/index.tsx`** - Updated to use generic service

## Architecture Benefits

### 1. **Separation of Concerns**

- **Generic Service**: Handles file selection, validation, progress, and drag & drop
- **Specific Actions**: Handle upload logic specific to use case (photos, documents, etc.)
- **UI Components**: Present the functionality using the generic headless components

### 2. **Reusability**

- The file upload service can be used for any file type
- Configurable validation rules (file size, types, extensions)
- Pluggable upload actions for different destinations

### 3. **Type Safety**

- Full TypeScript support
- Well-defined interfaces for all render props
- Clear separation between generic and specific functionality

## Usage Example

### Setting Up a File Upload Service

```tsx
import { useState } from "react";
import {
  FileUploadServiceDefinition,
  FileUploadService,
} from "../headless/media/file-upload-service";
import {
  createPhotoUploadAction,
  getPhotoUploadConfig,
} from "../headless/media/photo-upload-actions";

// Create services manager
const [servicesManager] = useState(() => createServicesManager(
  createServicesMap().addService(
    FileUploadServiceDefinition,
    FileUploadService,
    {
      ...getPhotoUploadConfig(), // File validation rules
      uploadAction: createPhotoUploadAction(async () => {
        // Custom success callback
        console.log("Upload successful!");
      }),
    }
  )
));
```

### Using Headless Components

```tsx
import { FileUpload } from "../headless/media/FileUpload";

function MyUploadUI() {
  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <FileUpload.FileSelector>
        {({ dragOver, handleDragOver, handleDrop, handleFileSelect }) => (
          <div
            className={dragOver ? "drag-active" : ""}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Your drag & drop UI */}
          </div>
        )}
      </FileUpload.FileSelector>

      <FileUpload.FilePreview>
        {({ hasPreview, previewUrl, fileName, formattedFileSize }) => (
          <div>
            {hasPreview && <img src={previewUrl} alt="Preview" />}
            <p>
              {fileName} ({formattedFileSize})
            </p>
          </div>
        )}
      </FileUpload.FilePreview>

      <FileUpload.UploadProgress>
        {({ isLoading, uploadState }) => (
          <div>
            {isLoading && <div>Uploading...</div>}
            {uploadState.message && <p>{uploadState.message}</p>}
          </div>
        )}
      </FileUpload.UploadProgress>

      <FileUpload.UploadTrigger>
        {({ uploadFile, canUpload }) => (
          <button onClick={uploadFile} disabled={!canUpload}>
            Upload File
          </button>
        )}
      </FileUpload.UploadTrigger>
    </ServicesManagerProvider>
  );
}
```

## Available Headless Components

### FileUpload.FileSelector

Handles file selection via drag & drop or file input.

**Render Props:**

- `selectedFile: File | null` - Currently selected file
- `previewUrl: string | null` - Preview URL if supported
- `dragOver: boolean` - Whether drag is active
- `selectFile: (file: File) => void` - Programmatic file selection
- `clearFile: () => void` - Clear selected file
- `handleDragOver/Leave/Drop` - Drag & drop event handlers
- `handleFileSelect` - File input change handler
- `canPreview: boolean` - Whether file can be previewed

### FileUpload.FilePreview

Displays preview and information about the selected file.

**Render Props:**

- `selectedFile: File | null` - Currently selected file
- `previewUrl: string | null` - Preview URL
- `hasPreview: boolean` - Whether preview is available
- `canPreview: boolean` - Whether file type supports preview
- `fileName: string` - File name
- `fileSize: number` - File size in bytes
- `formattedFileSize: string` - Human-readable file size
- `fileType: string` - MIME type

### FileUpload.UploadProgress

Shows upload status and progress.

**Render Props:**

- `uploadState: UploadState` - Current upload state
- `isLoading: boolean` - Whether upload is in progress
- `isSuccess: boolean` - Whether upload succeeded
- `isError: boolean` - Whether upload failed
- `hasError: boolean` - Whether there's an error
- `hasMessage: boolean` - Whether there's a status message

### FileUpload.UploadTrigger

Handles the upload action.

**Render Props:**

- `uploadFile: () => Promise<void>` - Function to trigger upload
- `canUpload: boolean` - Whether upload is possible
- `isUploading: boolean` - Whether upload is in progress

### FileUpload.ValidationStatus

Shows file validation status and rules.

**Render Props:**

- `isValid: boolean` - Whether file passes validation
- `error: string | undefined` - Validation error message
- `validationRules` - Current validation rules

## Creating Custom Upload Actions

### Using Generic File Upload Actions

The generic file upload actions handle uploading to Wix Media automatically:

```tsx
import { createGenericFileUploadAction } from "../headless/media/file-upload-actions";

// Example: Document upload action
export const createDocumentUploadAction = () => {
  return createGenericFileUploadAction({
    parentFolderId: "documents",
    requireAuth: true,
    allowedTypes: ["application/pdf", "text/plain"],
    maxFileSize: 25 * 1024 * 1024, // 25MB
  });
};

// Example: Avatar upload action
export const createAvatarUploadAction = () => {
  return createGenericFileUploadAction({
    parentFolderId: "avatars",
    requireAuth: true,
    allowedTypes: ["image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });
};
```

### Creating Custom Actions with Additional Logic

For actions that need custom post-processing:

```tsx
import { createGenericFileUploadAction } from "../headless/media/file-upload-actions";

export const createMemberAvatarUploadAction = () => {
  const genericUpload = createGenericFileUploadAction({
    parentFolderId: "avatars",
    allowedTypes: ["image/jpeg", "image/png"],
  });

  return async (file: File) => {
    // Use generic upload
    const uploadResult = await genericUpload(file);

    // Add custom logic (e.g., update user profile)
    await updateUserAvatar(uploadResult.fileId);

    return {
      ...uploadResult,
      message: "Avatar updated successfully!",
    };
  };
};
```

## Configuration Options

```tsx
const config = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png"], // MIME types
  allowedExtensions: ["jpg", "png"], // File extensions
  uploadAction: myUploadFunction, // Required
  onUploadSuccess: async (result) => {
    // Optional success callback
  },
  onUploadError: async (error) => {
    // Optional error callback
  },
};
```

## Migration Notes

- **Old**: Photo-specific `PhotoUploadService` and `PhotoUpload` components
- **New**: Generic `FileUploadService` and `FileUpload` components
- **Breaking Changes**: Component names and some prop names have changed
- **Benefits**: More flexible, reusable, and maintainable code

The photo upload functionality in the members page now uses these generic components while maintaining the same user experience.

# Action Factory Pattern for Service Actions

This document explains the recommended pattern for creating Astro server actions in services, particularly how to establish dependencies between services using action factories.

## Core Pattern

### 1. Generic Service Actions

Create reusable action factories that can be configured and composed:

```typescript
// src/headless/media/file-upload-actions.ts
export function createFileUploadAction(config: FileUploadActionConfig = {}) {
  return defineAction({
    // ... action definition
  });
}

// Export the type for the constructed action
export type FileUploadAction = ReturnType<typeof createFileUploadAction>;
```

### 2. Service-Specific Action Factories

Create factories that receive other actions as dependencies:

```typescript
// src/headless/media/photo-upload-actions.ts
export function createMemberProfilePhotoUploadAction(
  fileUploadAction: FileUploadAction
) {
  const astroActions = {
    uploadPhoto: defineAction({
      handler: async ({ photo }) => {
        // Use the injected file upload action
        const uploadResult = await fileUploadAction(formData);

        // Add service-specific logic
        await members.updateMember(member._id, {
          profile: { photo: { _id: uploadResult.data.fileId } },
        });
      },
    }),
  };

  return { astroActions /* other service functions */ };
}
```

### 3. Composition in Actions Index

Wire up the dependencies in your main actions file:

```typescript
// src/actions/index.ts
import { createFileUploadAction } from "../headless/media/file-upload-actions";
import {
  createMemberProfilePhotoUploadAction,
  getPhotoUploadConfig,
} from "../headless/media/photo-upload-actions";

// Create the base file upload action
const imageUploadAction = createFileUploadAction(getPhotoUploadConfig());

// Create the member photo actions using the file upload action as dependency
const memberPhotoActions =
  createMemberProfilePhotoUploadAction(imageUploadAction);

export const server = {
  fileUpload: {
    createAction: createFileUploadAction,
  },
  member: {
    photoUpload: memberPhotoActions.astroActions,
  },
};
```

## Benefits of This Pattern

### 1. Dependency Injection

Services can receive their dependencies explicitly, making the architecture clear and testable.

### 2. Reusability

Generic actions can be reused across different services with different configurations.

### 3. Composition

Complex functionality is built by composing simpler, focused actions.

### 4. Type Safety

TypeScript ensures that actions receive the correct dependencies with proper typing.

## Example: File Upload Service

### Generic File Upload Action

```typescript
export function createFileUploadAction(config: FileUploadActionConfig = {}) {
  const { maxFileSize = 10 * 1024 * 1024, allowedMimeTypes = [] } = config;

  return defineAction({
    accept: "form",
    input: z.object({ file: z.instanceof(File) }),
    handler: async ({ file }) => {
      // Validation
      if (file.size > maxFileSize) {
        throw new Error(`File too large`);
      }

      // Upload to Wix Media
      const { uploadUrl } = await auth.elevate(files.generateFileUploadUrl)(
        file.type,
        {
          fileName: file.name,
          parentFolderId: config.parentFolderId,
        }
      );

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      const result = await uploadResponse.json();
      return {
        success: true,
        fileId: result.file?.id,
        fileUrl: result.file?.url,
      };
    },
  });
}
```

### Member Photo Upload Factory

```typescript
export function createMemberProfilePhotoUploadAction(
  fileUploadAction: FileUploadAction
) {
  return {
    astroActions: {
      uploadPhoto: defineAction({
        handler: async ({ photo }) => {
          // Use the injected file upload action
          const uploadResult = await fileUploadAction(formData);

          // Member-specific logic
          const { member } = await members.getCurrentMember();
          await members.updateMember(member._id, {
            profile: { photo: { _id: uploadResult.data.fileId } },
          });

          return { success: true, message: "Photo updated" };
        },
      }),
    },

    // Service function for use with headless components
    createPhotoUploadAction: (onSuccess?: () => Promise<void>) => {
      return async (file: File) => {
        const formData = new FormData();
        formData.append("photo", file);
        return await astroActions.uploadPhoto(formData);
      };
    },
  };
}
```

## Key Guidelines

### 1. Action Factory Functions

- Use factory functions to create configurable actions
- Export types for constructed actions (`ReturnType<typeof factory>`)
- Accept configuration objects for customization

### 2. Dependency Injection

- Service action factories should receive their dependencies as parameters
- Dependencies should be constructed actions, not factories
- Use TypeScript types to ensure correct dependencies

### 3. Return Structure

- Return both `astroActions` (for Astro server actions) and service functions
- Service functions wrap Astro actions for use with headless components
- Keep the interface consistent across different services

### 4. Configuration

- Create configuration functions that return appropriate settings
- Use descriptive configuration objects rather than many parameters
- Allow for both defaults and customization

## Usage in Components

### With File Upload Service

```typescript
const fileUploadService = new FileUploadService({
  uploadAction: memberPhotoActions.createPhotoUploadAction(),
  maxFileSize: 10 * 1024 * 1024,
  allowedExtensions: ["jpg", "jpeg", "png"],
});
```

### Direct Action Usage

```typescript
import { actions } from "astro:actions";

// In a React component
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);

  const result = await actions.member.photoUpload.uploadPhoto(formData);
  if (result.data?.success) {
    console.log("Upload successful");
  }
};
```

This pattern ensures clean separation of concerns, makes testing easier, and provides a consistent way to build complex functionality from simpler, reusable pieces.
