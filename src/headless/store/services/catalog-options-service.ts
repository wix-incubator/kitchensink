import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { productsV3, customizationsV3 } from "@wix/stores";

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

export interface CatalogOptionsServiceAPI {
  catalogOptions: Signal<ProductOption[] | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
}

// Helper functions
const extractAggregationValues = (aggregationResponse: any, name: string): string[] => {
  const aggregation = aggregationResponse.aggregations?.[name] || 
    aggregationResponse.aggregationData?.results?.find((r: any) => r.name === name);
  return aggregation?.values?.results?.map((item: any) => item.value) || [];
};

const matchesAggregationName = (name: string, aggregationNames: string[]): boolean => {
  return aggregationNames.some(aggName => aggName.toLowerCase() === name.toLowerCase());
};

const sortChoicesIntelligently = (choices: ProductChoice[]): ProductChoice[] => {
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
      $matchItems: [{ _id: { $in: [categoryId] } }]
    }
  };
};

export const CatalogOptionsServiceDefinition =
  defineService<CatalogOptionsServiceAPI>("catalogOptions");

export const CatalogOptionsService = implementService.withConfig<{}>()(
  CatalogOptionsServiceDefinition,
  ({ getService }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const catalogOptions: Signal<ProductOption[] | null> = signalsService.signal(null as any);
    const isLoading: Signal<boolean> = signalsService.signal(false as any);
    const error: Signal<string | null> = signalsService.signal(null as any);

    const loadCatalogOptions = async (categoryId?: string): Promise<void> => {
      isLoading.set(true);
      error.set(null);

      try {
        // Step 1: Get unique option and choice names from catalog via aggregation (no products returned)
        const aggregationRequest = {
          aggregations: [
            {
              name: 'optionNames',
              fieldPath: 'options.name',
              type: 'VALUE' as const,
              value: { limit: 20, sortType: 'VALUE' as const, sortDirection: 'ASC' as const }
            },
            {
              name: 'choiceNames', 
              fieldPath: 'options.choicesSettings.choices.name',
              type: 'VALUE' as const,
              value: { limit: 50, sortType: 'VALUE' as const, sortDirection: 'ASC' as const }
            }
          ],
          filter: buildCategoryFilter(categoryId),
          includeProducts: false,
          cursorPaging: { limit: 0 }
        };

        const aggregationResponse = await productsV3.searchProducts(aggregationRequest as any);
        
        const optionNames = extractAggregationValues(aggregationResponse, 'optionNames');
        const choiceNames = extractAggregationValues(aggregationResponse, 'choiceNames');

        if (optionNames.length === 0) {
          catalogOptions.set([]);
          return;
        }

        // Step 2: Get option structure from customizations API
        const customizationsResponse = await customizationsV3.queryCustomizations().find();
        const customizations = customizationsResponse.items || [];

        // Step 3: Build options by matching customizations with aggregation data
        const options: ProductOption[] = customizations
          .filter(customization => 
            customization.name && 
            customization._id && 
            customization.customizationType === 'PRODUCT_OPTION' &&
            matchesAggregationName(customization.name, optionNames)
          )
          .map(customization => {
            const choices: ProductChoice[] = (customization.choicesSettings?.choices || [])
              .filter(choice => 
                choice._id && 
                choice.name && 
                matchesAggregationName(choice.name, choiceNames)
              )
              .map(choice => ({
                id: choice._id!,
                name: choice.name!,
                colorCode: choice.colorCode
              }));

            return {
              id: customization._id!,
              name: customization.name!,
              choices: sortChoicesIntelligently(choices),
              optionRenderType: customization.customizationRenderType
            };
          })
          .filter(option => option.choices.length > 0);
        
        catalogOptions.set(options);

      } catch (err) {
        console.error('Failed to load catalog options:', err);
        error.set(err instanceof Error ? err.message : 'Failed to load catalog options');
        catalogOptions.set([]);
      } finally {
        isLoading.set(false);
      }
    };

    return {
      catalogOptions,
      isLoading,
      error,
      loadCatalogOptions,
    };
  }
);

export async function loadCatalogOptionsServiceConfig(): Promise<
  ServiceFactoryConfig<typeof CatalogOptionsService>
> {
  return {};
} 