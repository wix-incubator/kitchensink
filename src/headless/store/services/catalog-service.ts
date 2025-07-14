import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { productsV3, customizationsV3 } from '@wix/stores';

const { SortDirection, SortType: SDKSortType } = productsV3;

export interface ProductOption {
  id: string;
  name: string;
  choices: ProductChoice[];
  optionRenderType?: string;
}

export interface ProductChoice {
  id: string;
  name: string;
  colorCode?: string;
}

export interface CatalogPriceRange {
  minPrice: number;
  maxPrice: number;
}

export interface CatalogServiceAPI {
  catalogOptions: Signal<ProductOption[] | null>;
  catalogPriceRange: Signal<CatalogPriceRange | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogData: (categoryId?: string) => Promise<void>;
}

// Helper functions
const extractAggregationValues = (
  aggregationResponse: any,
  name: string
): string[] => {
  const aggregation =
    aggregationResponse.aggregations?.[name] ||
    aggregationResponse.aggregationData?.results?.find(
      (r: any) => r.name === name
    );
  return aggregation?.values?.results?.map((item: any) => item.value) || [];
};

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

const matchesAggregationName = (
  name: string,
  aggregationNames: string[]
): boolean => {
  return aggregationNames.some(
    aggName => aggName.toLowerCase() === name.toLowerCase()
  );
};

const sortChoicesIntelligently = (
  choices: ProductChoice[]
): ProductChoice[] => {
  return [...choices].sort((a, b) => {
    const aIsNumber = /^\d+$/.test(a.name);
    const bIsNumber = /^\d+$/.test(b.name);

    if (aIsNumber && bIsNumber) {
      return parseInt(b.name) - parseInt(a.name);
    }
    if (aIsNumber && !bIsNumber) return -1;
    if (!aIsNumber && bIsNumber) return 1;

    return a.name.localeCompare(b.name);
  });
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

export const CatalogServiceDefinition =
  defineService<CatalogServiceAPI>('catalog');

export const CatalogService = implementService.withConfig<{}>()(
  CatalogServiceDefinition,
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const catalogOptions: Signal<ProductOption[] | null> =
      signalsService.signal(null as any);
    const catalogPriceRange: Signal<CatalogPriceRange | null> =
      signalsService.signal(null as any);
    const isLoading: Signal<boolean> = signalsService.signal(false as any);
    const error: Signal<string | null> = signalsService.signal(null as any);

    const loadCatalogData = async (categoryId?: string): Promise<void> => {
      isLoading.set(true);
      error.set(null);

      try {
        // Single aggregation request to get ALL catalog data at once
        const aggregationRequest = {
          aggregations: [
            // Price range aggregations
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
            // Options aggregations
            {
              name: 'optionNames',
              fieldPath: 'options.name',
              type: SDKSortType.VALUE,
              value: {
                limit: 20,
                sortType: SDKSortType.VALUE,
                sortDirection: SortDirection.ASC,
              },
            },
            {
              name: 'choiceNames',
              fieldPath: 'options.choicesSettings.choices.name',
              type: SDKSortType.VALUE,
              value: {
                limit: 50,
                sortType: SDKSortType.VALUE,
                sortDirection: SortDirection.ASC,
              },
            },
            {
              name: 'inventoryStatus',
              fieldPath: 'inventory.availabilityStatus',
              type: SDKSortType.VALUE,
              value: {
                limit: 10,
                sortType: SDKSortType.VALUE,
                sortDirection: SortDirection.ASC,
              },
            },
          ],
          filter: buildCategoryFilter(categoryId),
          includeProducts: false,
          cursorPaging: { limit: 0 },
        };

        // Make the single aggregation request
        const [aggregationResponse, customizationsResponse] = await Promise.all(
          [
            productsV3.searchProducts(aggregationRequest as any),
            customizationsV3.queryCustomizations().find(),
          ]
        );

        // Process price range data
        const minPrice = extractScalarAggregationValue(
          aggregationResponse,
          'minPrice'
        );
        const maxPrice = extractScalarAggregationValue(
          aggregationResponse,
          'maxPrice'
        );

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
          catalogPriceRange.set(null);
        }

        // Process options data
        const optionNames = extractAggregationValues(
          aggregationResponse,
          'optionNames'
        );
        const choiceNames = extractAggregationValues(
          aggregationResponse,
          'choiceNames'
        );
        const inventoryStatuses = extractAggregationValues(
          aggregationResponse,
          'inventoryStatus'
        );

        const customizations = customizationsResponse.items || [];

        // Build options by matching customizations with aggregation data
        const options: ProductOption[] = customizations
          .filter(
            customization =>
              customization.name &&
              customization._id &&
              customization.customizationType ===
                customizationsV3.CustomizationType.PRODUCT_OPTION &&
              matchesAggregationName(customization.name, optionNames)
          )
          .map(customization => {
            const choices: ProductChoice[] = (
              customization.choicesSettings?.choices || []
            )
              .filter(
                choice =>
                  choice._id &&
                  choice.name &&
                  matchesAggregationName(choice.name, choiceNames)
              )
              .map(choice => ({
                id: choice._id!,
                name: choice.name!,
                colorCode: choice.colorCode,
              }));

            return {
              id: customization._id!,
              name: customization.name!,
              choices: sortChoicesIntelligently(choices),
              optionRenderType: customization.customizationRenderType,
            };
          })
          .filter(option => option.choices.length > 0);

        // Add inventory filter if there are multiple inventory statuses
        if (inventoryStatuses.length > 1) {
          const inventoryChoices: ProductChoice[] = inventoryStatuses.map(
            status => ({
              id: status.toUpperCase(),
              name: status.toUpperCase(),
            })
          );

          options.push({
            id: 'inventory-filter',
            name: 'Availability',
            choices: inventoryChoices,
            optionRenderType: productsV3.ModifierRenderType.TEXT_CHOICES,
          });
        }

        catalogOptions.set(options);
      } catch (err) {
        console.error('Failed to load catalog data:', err);
        error.set(
          err instanceof Error ? err.message : 'Failed to load catalog data'
        );
        catalogOptions.set([]);
        catalogPriceRange.set(null);
      } finally {
        isLoading.set(false);
      }
    };

    return {
      catalogOptions,
      catalogPriceRange,
      isLoading,
      error,
      loadCatalogData,
    };
  }
);

export async function loadCatalogServiceConfig(): Promise<
  ServiceFactoryConfig<typeof CatalogService>
> {
  return {};
}
