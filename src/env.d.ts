/// <reference path="../.astro/types.d.ts" />
import type { Host } from '@wix/sdk-types';

declare global {
  interface ContextualClient {
    host: Host;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly SSR: boolean;
  }
}
