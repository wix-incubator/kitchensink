import { defineService } from '@wix/services-definitions';
import { implementService } from '@wix/services-definitions';
import {
  type Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import type { productsV3 } from '@wix/stores';
import { ProductsListServiceDefinition } from './products-list';

export const ProductsListFiltersServiceDefinition = defineService<{
  minPrice: Signal<number>;
  maxPrice: Signal<number>;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
}>('products-list-filters');

export type ProductsListFiltersServiceConfig = {};

export const ProductsListFiltersService =
  implementService.withConfig<ProductsListFiltersServiceConfig>()(
    ProductsListFiltersServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      const minPriceSignal = signalsService.signal(
        getMinPrice(productsListService.searchOptions.get())
      );
      const maxPriceSignal = signalsService.signal(
        getMaxPrice(productsListService.searchOptions.get())
      );

      if (typeof window !== 'undefined') {
        signalsService.effect(() => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const minPrice = minPriceSignal.get();
          const maxPrice = maxPriceSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          // Build new search options with updated price filters
          const newSearchOptions = {
            // @ts-expect-error
            ...productsListService.searchOptions.peek(),
          };

          // Initialize filter if it doesn't exist
          if (!newSearchOptions.filter) {
            newSearchOptions.filter = {};
          } else {
            // Copy existing filter to avoid mutation
            newSearchOptions.filter = { ...newSearchOptions.filter };
          }

          // Remove existing price filters
          delete (newSearchOptions.filter as any)[
            'actualPriceRange.minValue.amount'
          ];
          delete (newSearchOptions.filter as any)[
            'actualPriceRange.maxValue.amount'
          ];

          // Add new price filters if they have valid values
          if (minPrice > 0) {
            (newSearchOptions.filter as any)[
              'actualPriceRange.minValue.amount'
            ] = { $gte: minPrice };
          }
          if (maxPrice > 0) {
            (newSearchOptions.filter as any)[
              'actualPriceRange.maxValue.amount'
            ] = { $lte: maxPrice };
          }

          // Use callback to update search options
          productsListService.setSearchOptions(newSearchOptions);
        });
      }

      return {
        minPrice: minPriceSignal,
        maxPrice: maxPriceSignal,
        setMinPrice: (minPrice: number) => {
          minPriceSignal.set(minPrice);
        },
        setMaxPrice: (maxPrice: number) => {
          maxPriceSignal.set(maxPrice);
        },
      };
    }
  );

function getMinPrice(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): number {
  const filter = searchOptions.filter;
  if (!filter) return 0;

  const minPriceFilter = (filter as any)['actualPriceRange.minValue.amount'];
  if (
    typeof minPriceFilter === 'object' &&
    minPriceFilter !== null &&
    '$gte' in minPriceFilter
  ) {
    return Number(minPriceFilter.$gte) || 0;
  }

  return 0;
}

function getMaxPrice(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): number {
  const filter = searchOptions.filter;
  if (!filter) return 0;

  const maxPriceFilter = (filter as any)['actualPriceRange.maxValue.amount'];
  if (
    typeof maxPriceFilter === 'object' &&
    maxPriceFilter !== null &&
    '$lte' in maxPriceFilter
  ) {
    return Number(maxPriceFilter.$lte) || 0;
  }

  return 0;
}
