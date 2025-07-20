import { defineService } from '@wix/services-definitions';
import { implementService } from '@wix/services-definitions';
import {
  type Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { productsV3 } from '@wix/stores';
import { ProductsListServiceDefinition } from './products-list';

export const ProductsListPaginationServiceDefinition = defineService<{
  currentLimit: Signal<number>;
  currentCursor: Signal<string | null>;
  hasNextPage: { get: () => boolean };
  hasPrevPage: { get: () => boolean };
  totalCount: { get: () => number };
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
}>('products-list-pagination');

export type ProductsListPaginationServiceConfig = {};

export const ProductsListPaginationService =
  implementService.withConfig<ProductsListPaginationServiceConfig>()(
    ProductsListPaginationServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      // Track cursor history for previous page functionality
      const cursorHistory: string[] = [];
      let nextCursor: string | null = null;

      const currentLimitSignal = signalsService.signal(
        getCurrentLimit(productsListService.searchOptions.get())
      );
      const currentCursorSignal = signalsService.signal<string | null>(
        getCurrentCursor(productsListService.searchOptions.get())
      );
      // Computed signals derived from paging metadata
      const hasNextPageSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return pagingMetadata?.hasNext || false;
      });

      const totalCountSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return pagingMetadata?.count || 0;
      });

      const hasPrevPageSignal = signalsService.computed(() => {
        
        const currentCursor = currentCursorSignal.get();
        return !!currentCursor || cursorHistory.length > 0;
      });

      if (typeof window !== 'undefined') {
        // Watch for changes in pagination settings and update search options
        signalsService.effect(() => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const limit = currentLimitSignal.get();
          const cursor = currentCursorSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          // Build new search options with updated pagination
          const newSearchOptions = {
            // @ts-expect-error
            ...productsListService.searchOptions.peek(),
          };

          // Update cursor paging
          if (limit > 0) {
            newSearchOptions.cursorPaging = {
              limit,
              ...(cursor && { cursor }),
            };
          } else {
            delete newSearchOptions.cursorPaging;
          }

          // Use callback to update search options
          productsListService.setSearchOptions(newSearchOptions);
        });

        // Update next cursor for navigation when paging metadata changes
        signalsService.effect(() => {
          const pagingMetadata = productsListService.pagingMetadata.get();
          nextCursor = pagingMetadata?.cursors?.next || null;
        });
      }

      return {
        currentLimit: currentLimitSignal,
        currentCursor: currentCursorSignal,
        hasNextPage: hasNextPageSignal,
        hasPrevPage: hasPrevPageSignal,
        totalCount: totalCountSignal,

        setLimit: (limit: number) => {
          currentLimitSignal.set(limit);
          // Reset pagination when changing page size
          currentCursorSignal.set(null);
          cursorHistory.length = 0;
        },

        nextPage: () => {
          const currentCursor = currentCursorSignal.get();
          if (currentCursor) {
            cursorHistory.push(currentCursor);
          }

          if (nextCursor) {
            currentCursorSignal.set(nextCursor);
          }
        },

        prevPage: () => {
          if (cursorHistory.length > 0) {
            const previousCursor = cursorHistory.pop();
            currentCursorSignal.set(previousCursor || null);
          } else {
            // Go to first page
            currentCursorSignal.set(null);
          }
        },

        firstPage: () => {
          currentCursorSignal.set(null);
          cursorHistory.length = 0;
        },
      };
    }
  );

function getCurrentLimit(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): number {
  return searchOptions.cursorPaging?.limit || 12; // Default to 12 items per page
}

function getCurrentCursor(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): string | null {
  return searchOptions.cursorPaging?.cursor || null;
}
