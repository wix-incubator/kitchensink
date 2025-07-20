import type { Signal } from '@wix/services-definitions/core-services/signals';
import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import { ProductsListServiceDefinition } from './products-list';
import type { productsV3 } from '@wix/stores';

export const ProductsListSortServiceDefinition = defineService<{
  sort: Signal<string>;
  setSort: (sort: string) => void;
}>('products-list-sort');

export type ProductsListSortServiceConfig = {};

export const ProductsListSortService =
  implementService.withConfig<ProductsListSortServiceConfig>()(
    ProductsListSortServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      const sortSignal = signalsService.signal<string>('name');

      if (typeof window !== 'undefined') {
        signalsService.effect(() => {
          const sort = sortSignal.get();
          console.log('🔥 sort changed:', sort);

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

          productsListService.setSearchOptions(newSearchOptions);
        });
      }

      return {
        sort: sortSignal,
        setSort: (sort: string) => sortSignal.set(sort),
      };
    }
  );
