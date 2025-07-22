import type { Host } from '@wix/sdk-types';

declare global {
  interface ContextualClient {
    host: Host;
  }
}
