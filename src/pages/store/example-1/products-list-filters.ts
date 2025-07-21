import { defineService } from '@wix/services-definitions';
import { implementService } from '@wix/services-definitions';
import {
  type Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { productsV3 } from '@wix/stores';
import { ProductsListServiceDefinition } from './products-list';
import { CategoriesListServiceDefinition } from './categories-list';

export enum InventoryStatusType {
  IN_STOCK = productsV3.InventoryAvailabilityStatus.IN_STOCK,
  OUT_OF_STOCK = productsV3.InventoryAvailabilityStatus.OUT_OF_STOCK,
  PARTIALLY_OUT_OF_STOCK = productsV3.InventoryAvailabilityStatus
    .PARTIALLY_OUT_OF_STOCK,
}

export const ProductsListFiltersServiceDefinition = defineService<{
  minPrice: Signal<number>;
  maxPrice: Signal<number>;
  availableInventoryStatuses: Signal<InventoryStatusType[]>;
  selectedInventoryStatuses: Signal<InventoryStatusType[]>;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
  toggleInventoryStatus: (status: InventoryStatusType) => void;
}>('products-list-filters');

export type ProductsListFiltersServiceConfig = {};

export const ProductsListFiltersService =
  implementService.withConfig<ProductsListFiltersServiceConfig>()(
    ProductsListFiltersServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      let categoriesListService:
        | ReturnType<typeof getService<typeof CategoriesListServiceDefinition>>
        | undefined;
      try {
        categoriesListService = getService(CategoriesListServiceDefinition);
      } catch (error) {
        categoriesListService = undefined;
      }

      const aggregationData = productsListService.aggregations.get();
      // TODO: use the aggregations to get the available inventory statuses
      // and the available price ranges
      // and the available product options
      // and the available product choices

      const minPriceSignal = signalsService.signal(
        getMinPrice(productsListService.searchOptions.get())
      );
      const maxPriceSignal = signalsService.signal(
        getMaxPrice(productsListService.searchOptions.get())
      );
      const availableInventoryStatusesSignal = signalsService.signal([
        InventoryStatusType.IN_STOCK,
        InventoryStatusType.OUT_OF_STOCK,
        InventoryStatusType.PARTIALLY_OUT_OF_STOCK,
      ] as InventoryStatusType[]);
      const selectedInventoryStatusesSignal = signalsService.signal(
        getSelectedInventoryStatuses(productsListService.searchOptions.get())
      );

      if (typeof window !== 'undefined') {
        signalsService.effect(() => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const minPrice = minPriceSignal.get();
          const maxPrice = maxPriceSignal.get();
          const selectedInventoryStatuses =
            selectedInventoryStatusesSignal.get();
          const selectedCategoryId =
            categoriesListService?.selectedCategoryId.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          // Build new search options with updated price filters
          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
            // @ts-expect-error
            ...productsListService.searchOptions.peek(),
          };

          delete newSearchOptions.cursorPaging?.cursor;

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

          // Remove existing inventory filter
          delete (newSearchOptions.filter as any)[
            'inventory.availabilityStatus'
          ];

          // Remove existing category filter
          delete (newSearchOptions.filter as any)[
            'allCategoriesInfo.categories'
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

          // Add new inventory filter if there are selected statuses
          if (selectedInventoryStatuses.length > 0) {
            if (selectedInventoryStatuses.length === 1) {
              (newSearchOptions.filter as any)['inventory.availabilityStatus'] =
                selectedInventoryStatuses[0];
            } else {
              (newSearchOptions.filter as any)['inventory.availabilityStatus'] =
                {
                  $in: selectedInventoryStatuses,
                };
            }
          }

          if (categoriesListService && selectedCategoryId) {
            (newSearchOptions.filter as any)['allCategoriesInfo.categories'] = {
              $matchItems: [{ _id: { $in: [selectedCategoryId] } }],
            };
          }

          // Use callback to update search options
          productsListService.setSearchOptions(newSearchOptions);
        });
      }

      return {
        minPrice: minPriceSignal,
        maxPrice: maxPriceSignal,
        availableInventoryStatuses: availableInventoryStatusesSignal,
        selectedInventoryStatuses: selectedInventoryStatusesSignal,
        setMinPrice: (minPrice: number) => {
          minPriceSignal.set(minPrice);
        },
        setMaxPrice: (maxPrice: number) => {
          maxPriceSignal.set(maxPrice);
        },
        toggleInventoryStatus: (status: InventoryStatusType) => {
          const current = selectedInventoryStatusesSignal.get();
          const isSelected = current.includes(status);
          if (isSelected) {
            selectedInventoryStatusesSignal.set(
              current.filter((s: InventoryStatusType) => s !== status)
            );
          } else {
            selectedInventoryStatusesSignal.set([...current, status]);
          }
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

function getSelectedInventoryStatuses(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): InventoryStatusType[] {
  const filter = searchOptions.filter;
  if (!filter) return [];

  const inventoryFilter = (filter as any)['inventory.availabilityStatus'];

  if (typeof inventoryFilter === 'string' && inventoryFilter.length > 0) {
    return [inventoryFilter as InventoryStatusType];
  }

  if (
    typeof inventoryFilter === 'object' &&
    inventoryFilter !== null &&
    '$in' in inventoryFilter
  ) {
    return Array.isArray(inventoryFilter.$in) ? inventoryFilter.$in : [];
  }

  return [];
}
