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
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
}>('products-list-pagination');

export type ProductsListPaginationServiceConfig = {};

export const ProductsListPaginationService =
  implementService.withConfig<ProductsListPaginationServiceConfig>()(
    ProductsListPaginationServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

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

      const hasPrevPageSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return typeof pagingMetadata.cursors?.prev !== 'undefined';
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
          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
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
      }

      return {
        currentLimit: currentLimitSignal,
        currentCursor: currentCursorSignal,
        hasNextPage: hasNextPageSignal,
        hasPrevPage: hasPrevPageSignal,

        setLimit: (limit: number) => {
          currentLimitSignal.set(limit);
          // Reset pagination when changing page size
          currentCursorSignal.set(null);
        },

        nextPage: () => {
          const pagingMetadata = productsListService.pagingMetadata.get();
          const nextCursor = pagingMetadata?.cursors?.next;
          if (nextCursor) {
            currentCursorSignal.set(nextCursor);
          }
        },

        prevPage: () => {
          const pagingMetadata = productsListService.pagingMetadata.get();
          const previousCursor = pagingMetadata?.cursors?.prev;
          if (previousCursor) {
            currentCursorSignal.set(previousCursor);
          }
        },

        goToFirstPage: () => {
          currentCursorSignal.set(null);
        },
      };
    }
  );

function getCurrentLimit(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): number {
  return searchOptions.cursorPaging?.limit || 100;
}

function getCurrentCursor(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): string | null {
  return searchOptions.cursorPaging?.cursor || null;
}
