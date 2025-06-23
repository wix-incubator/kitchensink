import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { productsV3 } from "@wix/stores";
import { URLParamsUtils } from "../utils/url-params";
import { CatalogPriceRangeServiceDefinition } from "./catalog-price-range-service";
import { CatalogOptionsServiceDefinition } from "./catalog-options-service";

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
  calculateAvailableOptions: (
    products: productsV3.V3Product[]
  ) => Promise<void>;
  loadCatalogPriceRange: (categoryId?: string) => Promise<void>;
  loadCatalogOptions: (categoryId?: string) => Promise<void>;
}

export const FilterServiceDefinition = defineService<FilterServiceAPI>(
  "filtered-collection"
);

export const defaultFilter: Filter = {
  priceRange: { min: 0, max: 0 },
  selectedOptions: {},
};

export const FilterService = implementService.withConfig<{
  initialFilters?: Filter;
}>()(FilterServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const catalogPriceRangeService = getService(CatalogPriceRangeServiceDefinition);
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

  // Subscribe to catalog price range changes and automatically update our signals
  catalogPriceRangeService.catalogPriceRange.subscribe((catalogPriceRange) => {
    if (catalogPriceRange && catalogPriceRange.minPrice < catalogPriceRange.maxPrice) {
      const priceRange = {
        min: catalogPriceRange.minPrice,
        max: catalogPriceRange.maxPrice
      };
      
      // Update available options with catalog price range
      const currentAvailableOptions = availableOptions.get();
      availableOptions.set({
        ...currentAvailableOptions,
        priceRange
      });
      
      // Update current filters to use catalog price range
      const currentFiltersValue = currentFilters.get();
      // Only update if current filter range is at defaults (either 0-0 or 0-1000)
      const isDefaultRange = (currentFiltersValue.priceRange.min === 0 && currentFiltersValue.priceRange.max === 0) ||
                             (currentFiltersValue.priceRange.min === 0 && currentFiltersValue.priceRange.max === 1000);
      
      if (isDefaultRange) {
        currentFilters.set({
          ...currentFiltersValue,
          priceRange
        });
      }
    }
  });

  // Subscribe to catalog options changes and automatically update our signals
  catalogOptionsService.catalogOptions.subscribe((catalogOptions) => {
    if (catalogOptions && catalogOptions.length > 0) {
      // Update available options with catalog options
      const currentAvailableOptions = availableOptions.get();
      availableOptions.set({
        ...currentAvailableOptions,
        productOptions: catalogOptions
      });
    }
  });

  const sortChoices = (
    choices: { id: string; name: string; colorCode?: string }[],
    optionName: string
  ) => {
    const sortedChoices = [...choices];

    // Check if all choices are numbers
    const allNumbers = sortedChoices.every(
      (choice) => !isNaN(Number(choice.name))
    );

    if (allNumbers) {
      // Sort numbers in descending order
      return sortedChoices.sort((a, b) => Number(b.name) - Number(a.name));
    }

    // Check if choices are sizes (common clothing/shoe sizes)
    const sizeOrder = [
      "XXS",
      "XS",
      "S",
      "SM",
      "M",
      "MD",
      "L",
      "LG",
      "XL",
      "XXL",
      "XXXL",
      "2XL",
      "3XL",
      "4XL",
      "5XL",
    ];
    const shoeSizePattern = /^\d+(\.\d+)?$/; // Pattern for shoe sizes like "8", "8.5", "10"
    const allSizes = sortedChoices.every(
      (choice) =>
        sizeOrder.includes(choice.name.toUpperCase()) ||
        shoeSizePattern.test(choice.name)
    );

    if (allSizes) {
      return sortedChoices.sort((a, b) => {
        const aUpper = a.name.toUpperCase();
        const bUpper = b.name.toUpperCase();

        // Handle shoe sizes (numeric)
        if (shoeSizePattern.test(a.name) && shoeSizePattern.test(b.name)) {
          return Number(a.name) - Number(b.name); // Ascending for shoe sizes
        }

        // Handle clothing sizes
        const aIndex = sizeOrder.indexOf(aUpper);
        const bIndex = sizeOrder.indexOf(bUpper);

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex; // Ascending for clothing sizes
        }

        // Fallback to alphabetical
        return a.name.localeCompare(b.name);
      });
    }

    // For colors or other text, use alphabetical order
    return sortedChoices.sort((a, b) => a.name.localeCompare(b.name));
  };

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
            (opt) => opt.id === optionId
          );
          if (option && choiceIds.length > 0) {
            const selectedChoices = option.choices.filter((choice) =>
              choiceIds.includes(choice.id)
            );
            if (selectedChoices.length > 0) {
              urlParams[option.name] = selectedChoices.map(
                (choice) => choice.name
              );
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
    console.log('🔄 calculateAvailableOptions called but using catalog-wide options instead');
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
    calculateAvailableOptions,
    loadCatalogPriceRange,
    loadCatalogOptions,
  };
});
