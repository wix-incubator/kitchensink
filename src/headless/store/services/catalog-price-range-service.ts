import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { productsV3 } from '@wix/stores';

// Helper function to extract scalar aggregation values
const extractScalarAggregationValue = (
  aggregationResponse: any,
  name: string
): number | null => {
  const aggregation =
    aggregationResponse.aggregations?.[name] ||
    aggregationResponse.aggregationData?.results?.find(
      (r: any) => r.name === name
    );
  const value = aggregation?.scalar?.value;
  return value !== undefined && value !== null ? parseFloat(value) : null;
};

const buildCategoryFilter = (categoryId?: string) => {
  if (!categoryId) {
    return { visible: true };
  }

  return {
    visible: true,
    'allCategoriesInfo.categories': {
      $matchItems: [{ _id: { $in: [categoryId] } }],
    },
  };
};

export interface CatalogPriceRange {
  minPrice: number;
  maxPrice: number;
}

export interface CatalogPriceRangeServiceAPI {
  catalogPriceRange: Signal<CatalogPriceRange | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
}

export const CatalogPriceRangeServiceDefinition =
  defineService<CatalogPriceRangeServiceAPI>('catalogPriceRange');

export const CatalogPriceRangeService = implementService.withConfig<{}>()(
  CatalogPriceRangeServiceDefinition,
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);

    // Signal declarations
    const catalogPriceRange: Signal<CatalogPriceRange | null> =
      signalsService.signal(null as any);
    const isLoading: Signal<boolean> = signalsService.signal(false as any);
    const error: Signal<string | null> = signalsService.signal(null as any);

    /**
     * Load the catalog-wide price range using a single aggregation query
     * This fetches min/max prices from ALL products in the catalog using SCALAR aggregations
     */
    const loadCatalogPriceRange = async (
      categoryId?: string
    ): Promise<void> => {
      isLoading.set(true);
      error.set(null);

      try {
        // Single aggregation request to get both min and max prices (no products returned)
        const aggregationRequest = {
          aggregations: [
            {
              name: 'minPrice',
              fieldPath: 'actualPriceRange.minValue.amount',
              type: 'SCALAR' as const,
              scalar: { type: 'MIN' as const },
            },
            {
              name: 'maxPrice',
              fieldPath: 'actualPriceRange.maxValue.amount',
              type: 'SCALAR' as const,
              scalar: { type: 'MAX' as const },
            },
          ],
          filter: buildCategoryFilter(categoryId),
          includeProducts: false,
          cursorPaging: { limit: 0 },
        };

        const aggregationResponse = await productsV3.searchProducts(
          aggregationRequest as any
        );

        const minPrice = extractScalarAggregationValue(
          aggregationResponse,
          'minPrice'
        );
        const maxPrice = extractScalarAggregationValue(
          aggregationResponse,
          'maxPrice'
        );

        // Only set price range if we found valid prices
        if (
          minPrice !== null &&
          maxPrice !== null &&
          (minPrice > 0 || maxPrice > 0)
        ) {
          catalogPriceRange.set({
            minPrice,
            maxPrice,
          });
        } else {
          // No products found or no valid prices - don't show the filter
          catalogPriceRange.set(null);
        }
      } catch (err) {
        console.error('Failed to load catalog price range:', err);
        error.set(
          err instanceof Error ? err.message : 'Failed to load price range'
        );

        // Don't set fallback values - let the component handle the error state
        catalogPriceRange.set(null);
      } finally {
        isLoading.set(false);
      }
    };

    return {
      catalogPriceRange,
      isLoading,
      error,
      loadCatalogPriceRange,
    };
  }
);

export async function loadCatalogPriceRangeServiceConfig(): Promise<
  ServiceFactoryConfig<typeof CatalogPriceRangeService>
> {
  return {};
}
