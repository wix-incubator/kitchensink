import type { Signal } from '@wix/services-definitions/core-services/signals';
import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import { ProductsListServiceDefinition } from './products-list';
import { productsV3 } from '@wix/stores';

export const ProductsListSortServiceDefinition = defineService<{
  selectedSortOption: Signal<string>;
  setSelectedSortOption: (sort: string) => void;
  sortOptions: SortType[];
}>('products-list-sort');

export type ProductsListSortServiceConfig = {};

export enum SortType {
  NEWEST = 'newest',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RECOMMENDED = 'recommended',
}

export const ProductsListSortService =
  implementService.withConfig<ProductsListSortServiceConfig>()(
    ProductsListSortServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      const selectedSortOptionSignal = signalsService.signal<string>('name');

      if (typeof window !== 'undefined') {
        signalsService.effect(() => {
          const sort = selectedSortOptionSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
            // @ts-expect-error
            ...productsListService.searchOptions.peek(),
          };

          if (!newSearchOptions.sort) {
            newSearchOptions.sort = [];
          } else {
            // Copy existing filter to avoid mutation
            newSearchOptions.sort = [...newSearchOptions.sort];
          }

          switch (sort) {
            case SortType.NAME_ASC:
              newSearchOptions.sort = [
                { fieldName: 'name', order: productsV3.SortDirection.ASC },
              ];
              break;
            case SortType.NAME_DESC:
              newSearchOptions.sort = [
                { fieldName: 'name', order: productsV3.SortDirection.DESC },
              ];
              break;
            case SortType.PRICE_ASC:
              newSearchOptions.sort = [
                {
                  fieldName: 'actualPriceRange.minValue.amount',
                  order: productsV3.SortDirection.ASC,
                },
              ];
              break;
            case SortType.PRICE_DESC:
              newSearchOptions.sort = [
                {
                  fieldName: 'actualPriceRange.minValue.amount',
                  order: productsV3.SortDirection.DESC,
                },
              ];
              break;
            case SortType.RECOMMENDED:
              newSearchOptions.sort = [
                {
                  fieldName: 'name',
                  order: productsV3.SortDirection.DESC,
                },
              ];
              break;
          }

          productsListService.setSearchOptions(newSearchOptions);
        });
      }

      return {
        selectedSortOption: selectedSortOptionSignal,
        sortOptions: Object.values(SortType),
        setSelectedSortOption: (sort: string) =>
          selectedSortOptionSignal.set(sort),
      };
    }
  );
