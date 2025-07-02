# Actions Index

## Overview

This file serves as the main entry point for server-side actions in the application. It aggregates and exports various action modules that can be used with Astro's server actions or other server-side functionality. The file currently focuses on photo upload actions but is designed to be extended with additional action modules as needed.

The actions are organized in a structured manner to provide a clean API for server-side operations while maintaining separation of concerns between different functional areas.

## Exports

### `server`
**Type**: `{ photoUploadAstroActions: any }`

A configuration object that contains all available server actions. Currently includes photo upload functionality but can be extended with additional action modules.

## Usage Examples

### Basic Server Actions Setup
```typescript
import { server } from './actions';

// Use in Astro pages or API routes
export const actions = server;
```

### Accessing Photo Upload Actions
```typescript
import { server } from './actions';

// Access photo upload actions
const photoActions = server.photoUploadAstroActions;
```

### Extending with Additional Actions
```typescript
// To extend this file with new actions:
import { photoUploadAstroActions } from "../headless/members/actions/photo-upload-service-actions";
import { newActionModule } from "./path/to/new-actions";

export const server = {
  photoUploadAstroActions,
  newActionModule,
};
```
