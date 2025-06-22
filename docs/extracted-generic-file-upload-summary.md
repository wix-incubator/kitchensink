# Generic File Upload Extraction - Summary

## What Was Accomplished

We successfully extracted a complete generic file upload system from the photo-specific implementation, creating a reusable foundation for any file upload needs.

## Architecture Overview

### Before: Photo-Specific Implementation

```
PhotoUploadService (photo-specific)
├── Photo validation logic
├── Wix Media upload logic
├── Member profile update logic
└── UI components (photo-specific)
```

### After: Layered Generic Architecture

```
Generic File Upload Layer
├── FileUploadService (generic)
│   ├── File selection & validation
│   ├── Progress tracking
│   └── Configurable rules
├── FileUpload Components (generic)
│   ├── FileSelector
│   ├── FilePreview
│   ├── UploadProgress
│   └── UploadTrigger
└── Generic Server Actions
    ├── createFileUploadAction()
    ├── genericFileUploadAstroActions
    └── createGenericFileUploadAction()

Specific Implementation Layer
├── Photo Upload Actions
│   ├── Uses generic upload
│   └── Adds member profile update
└── Photo Upload Configuration
    ├── Image-specific validation
    └── Member-specific logic
```

## Key Files Created

### 1. Generic Core (`src/headless/media/`)

**`file-upload-service.ts`** - Generic file upload service

- Configurable validation rules
- File selection and preview
- Upload progress tracking
- Drag & drop support

**`FileUpload.tsx`** - Generic headless components

- `FileUpload.FileSelector` - Drag & drop + file selection
- `FileUpload.FilePreview` - File preview and info
- `FileUpload.UploadProgress` - Upload status/progress
- `FileUpload.UploadTrigger` - Upload action trigger
- `FileUpload.ValidationStatus` - Validation feedback

**`file-upload-actions.ts`** - Generic server-side actions

- `createFileUploadAction()` - Configurable Astro action factory
- Pre-built actions for common use cases
- Direct Wix Media integration
- Authentication and validation

### 2. Photo-Specific Implementation (`src/headless/media/`)

**`photo-upload-actions.ts`** - Photo-specific logic

- Uses generic file upload for Wix Media
- Adds member profile photo update
- Handles member-specific errors

## Usage Examples

### 1. Basic File Upload (Any File Type)

```tsx
import { createGenericFileUploadAction } from "../headless/media/file-upload-actions";

const documentUpload = createGenericFileUploadAction({
  parentFolderId: "documents",
  allowedTypes: ["application/pdf", "text/plain"],
  maxFileSize: 25 * 1024 * 1024, // 25MB
});

// Use with generic file upload service
const config = {
  uploadAction: documentUpload,
  maxFileSize: 25 * 1024 * 1024,
  allowedTypes: ["application/pdf", "text/plain"],
};
```

### 2. Photo Upload (Current Implementation)

```tsx
import {
  createPhotoUploadAction,
  getPhotoUploadConfig,
} from "../headless/media/photo-upload-actions";

// Photo upload with member profile integration
const config = {
  ...getPhotoUploadConfig(),
  uploadAction: createPhotoUploadAction(async () => {
    // Refresh page after successful upload
    window.location.reload();
  }),
};
```

### 3. Custom Upload with Post-Processing

```tsx
import { createGenericFileUploadAction } from "../headless/media/file-upload-actions";

const avatarUpload = createGenericFileUploadAction({
  parentFolderId: "avatars",
  allowedTypes: ["image/jpeg", "image/png"],
});

const customAvatarAction = async (file: File) => {
  // Generic upload
  const result = await avatarUpload(file);

  // Custom post-processing
  await updateUserAvatar(result.fileId);

  return { ...result, message: "Avatar updated!" };
};
```

## Benefits Achieved

### ✅ **Complete Separation of Concerns**

- **Generic**: File handling, validation, upload to Wix Media
- **Specific**: Business logic (member profile updates, etc.)
- **UI**: Presentation layer completely decoupled

### ✅ **Maximum Reusability**

- One generic service handles all file types
- Configurable validation and upload rules
- Pre-built actions for common scenarios

### ✅ **Type Safety & Developer Experience**

- Full TypeScript support throughout
- Well-documented render prop interfaces
- Clear separation between layers

### ✅ **Maintainability**

- Single source of truth for file upload logic
- Easy to add new file types or use cases
- Simplified testing and debugging

### ✅ **Performance & Features**

- Reactive state management via Signals
- Built-in drag & drop support
- Progress tracking and error handling
- Preview generation for supported file types

## Migration Path

### Current Photo Upload Users

The photo upload functionality **continues to work exactly as before** - no breaking changes for existing users.

### New File Upload Needs

Use the generic system:

```tsx
// For any new file upload requirements
import { FileUpload } from "../headless/media/FileUpload";
import { createGenericFileUploadAction } from "../headless/media/file-upload-actions";

// Configure for your specific use case
const uploadAction = createGenericFileUploadAction({
  parentFolderId: "your-folder",
  allowedTypes: ["your", "allowed", "types"],
  maxFileSize: yourMaxSize,
});

// Use with generic components
<FileUpload.FileSelector>
  {({ dragOver, handleDrop }) => (
    // Your UI here
  )}
</FileUpload.FileSelector>
```

## Server Actions Integration

The generic actions are automatically registered in `src/actions/index.ts`:

```ts
export const server = {
  photoUploadAstroActions, // Backward compatibility
  genericFileUploadAstroActions, // New generic actions
  memberPhotoUploadAstroActions, // Photo-specific actions using generic core
};
```

## Validation & Configuration

### Client-Side Validation (Generic Service)

```ts
{
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png"],
  allowedExtensions: ["jpg", "png"],
}
```

### Server-Side Validation (Astro Actions)

```ts
createFileUploadAction({
  parentFolderId: "visitor-uploads",
  requireAuth: true,
  allowedTypes: ["image/jpeg", "image/png"],
  maxFileSize: 10 * 1024 * 1024,
});
```

This extraction provides a robust, scalable foundation for all file upload needs while maintaining full backward compatibility with existing photo upload functionality.
