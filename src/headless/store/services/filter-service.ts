import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
import { URLParamsUtils } from '../utils/url-params';
import { CatalogPriceRangeServiceDefinition } from './catalog-price-range-service';
import { CatalogOptionsServiceDefinition } from './catalog-options-service';
import { productsV3 } from '@wix/stores';

export interface ProductOption {
  id: string;
  name: string;
  choices: { id: string; name: string; colorCode?: string }[];
  optionRenderType?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface AvailableOptions {
  productOptions: ProductOption[];
  priceRange: PriceRange;
}

export interface Filter {
  priceRange: { min: number; max: number };
  selectedOptions: { [optionId: string]: string[] };
}

export interface FilterServiceAPI {
  currentFilters: Signal<Filter>;
  applyFilters: (filters: Filter) => Promise<void>;
  clearFilters: () => Promise<void>;
  availableOptions: Signal<{
    productOptions: ProductOption[];
    priceRange: { min: number; max: number };
  }>;
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
  isFullyLoaded: Signal<boolean>;
}

export const FilterServiceDefinition = defineService<FilterServiceAPI>(
  'filtered-collection'
);

export const defaultFilter: Filter = {
  priceRange: { min: 0, max: 0 },
  selectedOptions: {},
};

export const FilterService = implementService.withConfig<{
  initialFilters?: Filter;
}>()(FilterServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const catalogPriceRangeService = getService(
    CatalogPriceRangeServiceDefinition
  );
  const catalogOptionsService = getService(CatalogOptionsServiceDefinition);

  const currentFilters: Signal<Filter> = signalsService.signal(
    (config.initialFilters || defaultFilter) as any
  );

  const availableOptions: Signal<{
    productOptions: ProductOption[];
    priceRange: { min: number; max: number };
  }> = signalsService.signal({
    productOptions: [],
    priceRange: { min: 0, max: 0 },
  } as any);

  const isFullyLoaded: Signal<boolean> = signalsService.signal(false as any);

  // Helper function to check if both catalog data are loaded
  const checkIfFullyLoaded = () => {
    const catalogPriceRange = catalogPriceRangeService.catalogPriceRange.get();
    const catalogOptions = catalogOptionsService.catalogOptions.get();

    // Price range data is considered loaded whether it's null (no prices) or has valid data
    const hasPriceRangeData = catalogPriceRange !== undefined; // includes null case
    const hasOptionsData = !!(catalogOptions && catalogOptions.length >= 0); // Even 0 options is valid

    isFullyLoaded.set(hasPriceRangeData && hasOptionsData);
  };

  // Subscribe to catalog price range changes and automatically update our signals
  catalogPriceRangeService.catalogPriceRange.subscribe(catalogPriceRange => {
    if (
      catalogPriceRange &&
      catalogPriceRange.minPrice < catalogPriceRange.maxPrice
    ) {
      const priceRange = {
        min: catalogPriceRange.minPrice,
        max: catalogPriceRange.maxPrice,
      };

      // Update available options with catalog price range
      const currentAvailableOptions = availableOptions.get();
      availableOptions.set({
        ...currentAvailableOptions,
        priceRange,
      });

      // Update current filters to use catalog price range
      const currentFiltersValue = currentFilters.get();
      // Only update if current filter range is at defaults (either 0-0 or 0-1000)
      const isDefaultRange =
        (currentFiltersValue.priceRange.min === 0 &&
          currentFiltersValue.priceRange.max === 0) ||
        (currentFiltersValue.priceRange.min === 0 &&
          currentFiltersValue.priceRange.max === 1000);

      if (isDefaultRange) {
        currentFilters.set({
          ...currentFiltersValue,
          priceRange,
        });
      }
    }

    // Check if fully loaded after price range update
    checkIfFullyLoaded();
  });

  // Subscribe to catalog options changes and automatically update our signals
  catalogOptionsService.catalogOptions.subscribe(catalogOptions => {
    if (catalogOptions && catalogOptions.length > 0) {
      // Update available options with catalog options
      const currentAvailableOptions = availableOptions.get();
      availableOptions.set({
        ...currentAvailableOptions,
        productOptions: catalogOptions,
      });
    }

    // Check if fully loaded after options update
    checkIfFullyLoaded();
  });

  // Apply filters by delegating to the collection service
  const applyFilters = async (filters: Filter) => {
    currentFilters.set(filters);

    // Update URL with filter parameters
    const urlParams: Record<string, string | string[]> = {};
    const availableOpts = availableOptions.get();

    // Add price filters if different from defaults
    if (availableOpts?.priceRange) {
      if (filters.priceRange.min > availableOpts.priceRange.min) {
        urlParams.minPrice = filters.priceRange.min.toString();
      }
      if (filters.priceRange.max < availableOpts.priceRange.max) {
        urlParams.maxPrice = filters.priceRange.max.toString();
      }
    }

    // Add option filters using option names as keys
    if (availableOpts?.productOptions) {
      Object.entries(filters.selectedOptions).forEach(
        ([optionId, choiceIds]) => {
          const option = availableOpts.productOptions.find(
            opt => opt.id === optionId
          );
          if (option && choiceIds.length > 0) {
            const selectedChoices = option.choices.filter(choice =>
              choiceIds.includes(choice.id)
            );
            if (selectedChoices.length > 0) {
              // Use 'availability' as URL param for inventory filter
              const paramName =
                optionId === 'inventory-filter' ? 'availability' : option.name;
              urlParams[paramName] = selectedChoices.map(choice => choice.name);
            }
          }
        }
      );
    }

    // Preserve existing sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    if (currentParams.sort) {
      urlParams.sort = currentParams.sort;
    }

    URLParamsUtils.updateURL(urlParams);
  };

  // Clear all filters by applying default filter state
  const clearFilters = async () => {
    const availablePriceRange = availableOptions.get()?.priceRange;
    currentFilters.set({
      ...defaultFilter,
      priceRange: availablePriceRange || { min: 0, max: 0 },
    });

    // Clear filter parameters from URL, keeping only sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    const urlParams: Record<string, string | string[]> = {};
    if (currentParams.sort) {
      urlParams.sort = currentParams.sort;
    }
    URLParamsUtils.updateURL(urlParams);
  };

  const calculateAvailableOptions = async (
    products: productsV3.V3Product[]
  ) => {
    // No longer calculating options from current page products
    // Options are now loaded from the catalog-wide service
    // This function is kept for backward compatibility but does nothing
    console.log(
      '🔄 calculateAvailableOptions called but using catalog-wide options instead'
    );
  };

  const loadCatalogPriceRange = async (categoryId?: string) => {
    // Just call the catalog service - subscriptions will handle signal updates
    await catalogPriceRangeService.loadCatalogPriceRange(categoryId);
  };

  const loadCatalogOptions = async (categoryId?: string) => {
    // Just call the catalog service - subscriptions will handle signal updates
    await catalogOptionsService.loadCatalogOptions(categoryId);
  };

  return {
    currentFilters,
    applyFilters,
    clearFilters,
    availableOptions,
    loadCatalogPriceRange,
    loadCatalogOptions,
    isFullyLoaded,
  };
});
