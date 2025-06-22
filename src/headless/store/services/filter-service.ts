import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { productsV3 } from "@wix/stores";
import { URLParamsUtils } from "../utils/url-params";

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
}

export const FilterServiceDefinition = defineService<FilterServiceAPI>(
  "filtered-collection"
);

export const defaultFilter: Filter = {
  priceRange: { min: 0, max: 1000 },
  selectedOptions: {},
};

export const FilterService = implementService.withConfig<{
  initialFilters?: Filter;
}>()(FilterServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const currentFilters: Signal<Filter> = signalsService.signal(
    (config.initialFilters || defaultFilter) as any
  );

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

  const availableOptions: Signal<{
    productOptions: ProductOption[];
    priceRange: { min: number; max: number };
  }> = signalsService.signal({
    productOptions: [],
    priceRange: { min: 0, max: 1000 },
  } as any);

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
    currentFilters.set({
      ...defaultFilter,
      priceRange: availableOptions.get()?.priceRange || { min: 0, max: 1000 },
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
    if (!products || products.length === 0) return;

    // Calculate price range
    let minPrice = Infinity;
    let maxPrice = 0;

    // Extract all unique options
    const optionsMap = new Map<string, ProductOption>();

    products.forEach((product) => {
      // Calculate price range
      if (product.actualPriceRange?.minValue?.amount) {
        const min = parseFloat(product.actualPriceRange.minValue.amount);
        minPrice = Math.min(minPrice, min);
      }
      if (product.actualPriceRange?.maxValue?.amount) {
        const max = parseFloat(product.actualPriceRange.maxValue.amount);
        maxPrice = Math.max(maxPrice, max);
      }

      // Extract options
      if (product.options) {
        product.options.forEach((option) => {
          if (!option._id || !option.name) return;

          if (!optionsMap.has(option._id)) {
            optionsMap.set(option._id, {
              id: option._id,
              name: option.name,
              choices: [],
              optionRenderType: option.optionRenderType,
            });
          }

          const optionData = optionsMap.get(option._id)!;

          // Add choices
          if (option.choicesSettings?.choices) {
            option.choicesSettings.choices.forEach((choice) => {
              if (
                choice.choiceId &&
                choice.name &&
                !optionData.choices.find((c) => c.id === choice.choiceId)
              ) {
                optionData.choices.push({
                  id: choice.choiceId,
                  name: choice.name,
                  colorCode: choice.colorCode,
                });
              }
            });
          }
        });
      }
    });

    if (minPrice === Infinity) minPrice = 0;
    if (maxPrice === 0) maxPrice = 1000;

    const sortedOptions = Array.from(optionsMap.values()).map((option) => ({
      ...option,
      choices: sortChoices(option.choices, option.name),
    }));

    availableOptions.set({
      productOptions: Array.from(sortedOptions.values()),
      priceRange: { min: minPrice, max: maxPrice },
    });
    currentFilters.set({
      ...currentFilters.get(),
      priceRange: { min: minPrice, max: maxPrice },
    });
  };

  return {
    currentFilters,
    applyFilters,
    clearFilters,
    availableOptions,
    calculateAvailableOptions,
  };
});
