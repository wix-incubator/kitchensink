import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { productsV3 } from '@wix/stores';

export type ProductsListServiceConfig = {
  products: productsV3.V3Product[];
  searchOptions: Parameters<typeof productsV3.searchProducts>[0];
  pagingMetadata: productsV3.CommonCursorPagingMetadata;
};

export async function loadProductsListServiceConfig(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0]
): Promise<ProductsListServiceConfig> {
  const result = await productsV3.searchProducts(searchOptions);
  return {
    products: result.products ?? [],
    searchOptions,
    pagingMetadata: result.pagingMetadata!,
  };
}

export const ProductsListServiceDefinition = defineService<
  {
    products: Signal<productsV3.V3Product[]>;
    pagingMetadata: Signal<productsV3.CommonCursorPagingMetadata>;
    searchOptions: Signal<Parameters<typeof productsV3.searchProducts>[0]>;
    isLoading: Signal<boolean>;
    error: Signal<string | null>;
    setSearchOptions: (
      searchOptions: Parameters<typeof productsV3.searchProducts>[0]
    ) => void;
  },
  ProductsListServiceConfig
>('products-list');

export const ProductListService =
  implementService.withConfig<ProductsListServiceConfig>()(
    ProductsListServiceDefinition,
    ({ getService, config }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);

      const productsSignal = signalsService.signal<productsV3.V3Product[]>(
        config.products
      );
      const searchOptionsSignal = signalsService.signal<
        Parameters<typeof productsV3.searchProducts>[0]
      >(config.searchOptions);
      const pagingMetadataSignal =
        signalsService.signal<productsV3.CommonCursorPagingMetadata>(
          config.pagingMetadata
        );
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      if (typeof window !== 'undefined') {
        signalsService.effect(async () => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const searchOptions = searchOptionsSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          try {
            isLoadingSignal.set(true);

            const affectiveSearchOptions: Parameters<
              typeof productsV3.searchProducts
            >[0] = searchOptions.cursorPaging?.cursor
              ? {
                  cursorPaging: {
                    cursor: searchOptions.cursorPaging.cursor,
                    limit: searchOptions.cursorPaging.limit,
                  },
                }
              : searchOptions;

            const result = await productsV3.searchProducts(
              affectiveSearchOptions
            );

            productsSignal.set(result.products ?? []);
            pagingMetadataSignal.set(result.pagingMetadata!);
          } catch (error) {
            errorSignal.set(
              error instanceof Error ? error.message : 'Unknown error'
            );
          } finally {
            isLoadingSignal.set(false);
          }
        });
      }

      firstRun = false;

      return {
        products: productsSignal,
        searchOptions: searchOptionsSignal,
        pagingMetadata: pagingMetadataSignal,
        setSearchOptions: (
          searchOptions: Parameters<typeof productsV3.searchProducts>[0]
        ) => searchOptionsSignal.set(searchOptions),
        isLoading: isLoadingSignal,
        error: errorSignal,
      };
    }
  );
