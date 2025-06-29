import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  type AvailableOptions,
  type Filter,
  defaultFilter,
} from "../headless/store/services/filter-service";

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    priceRange: { min: number; max: number };
    selectedOptions: { [optionId: string]: string[] };
  }) => void;
  className?: string;
  availableOptions: {
    productOptions: Array<{
      id: string;
      name: string;
      choices: Array<{ id: string; name: string; colorCode?: string }>;
      optionRenderType?: string;
    }>;
    priceRange: { min: number; max: number };
  };
  currentFilters: {
    priceRange: { min: number; max: number };
    selectedOptions: { [optionId: string]: string[] };
  };
  clearFilters: () => void;
  isFiltered: boolean;
}

interface ProductOption {
  id: string;
  name: string;
  choices: { id: string; name: string; colorCode?: string }[];
  optionRenderType?: string;
  availableOptions: AvailableOptions;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFiltersChange,
  className = "",
  availableOptions,
  currentFilters,
  clearFilters,
  isFiltered,
}) => {
  const { priceRange, productOptions } = availableOptions;
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [selectedOptions, setSelectedOptions] = useState<{
    [optionId: string]: string[];
  }>(currentFilters.selectedOptions);

  const [isExpanded, setIsExpanded] = useState(false);

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (newRange: { min: number; max: number }) => {
      setTempPriceRange(newRange);
    },
    []
  );

  useEffect(() => {
    setTempPriceRange(currentFilters.priceRange);
    setSelectedOptions(currentFilters.selectedOptions);
  }, [currentFilters.selectedOptions, currentFilters.priceRange]);

  // Handle price range commit (when user releases slider)
  const handlePriceRangeCommit = useCallback(() => {
    if (
      tempPriceRange.min !== currentFilters.priceRange.min ||
      tempPriceRange.max !== currentFilters.priceRange.max
    ) {
      onFiltersChange({
        priceRange: tempPriceRange,
        selectedOptions,
      });
    }
  }, [
    tempPriceRange,
    selectedOptions,
    onFiltersChange,
    currentFilters.priceRange,
  ]);

  // Setup document-level event listeners for proper drag handling
  useEffect(() => {
    const handleMouseUp = () => handlePriceRangeCommit();
    const handleTouchEnd = () => handlePriceRangeCommit();

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handlePriceRangeCommit]);

  // Handle option selection
  const handleOptionChange = useCallback(
    (optionId: string, choiceId: string, checked: boolean) => {
      setSelectedOptions((prev) => {
        const newOptions = { ...prev };
        if (!newOptions[optionId]) {
          newOptions[optionId] = [];
        }

        if (checked) {
          if (!newOptions[optionId].includes(choiceId)) {
            newOptions[optionId] = [...newOptions[optionId], choiceId];
          }
        } else {
          newOptions[optionId] = newOptions[optionId].filter(
            (id) => id !== choiceId
          );
          if (newOptions[optionId].length === 0) {
            delete newOptions[optionId];
          }
        }

        // Trigger filter change
        onFiltersChange({
          priceRange: tempPriceRange,
          selectedOptions: newOptions,
        });

        return newOptions;
      });
    },
    [tempPriceRange, onFiltersChange]
  );

  return (
    <div
      className={`bg-[var(--theme-bg-options)] backdrop-blur-sm rounded-xl p-6 border border-[var(--theme-border-primary-10)] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[var(--theme-text-content)] flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-sm text-[var(--theme-text-content-60)] hover:text-[var(--theme-text-content)] transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-[var(--theme-text-content-60)] hover:text-[var(--theme-text-content)] transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {/* Price Range Filter - Only show if valid price range is available */}
        {priceRange.min < priceRange.max && priceRange.max > 0 && (
          <div>
            <h4 className="text-[var(--theme-text-content)] font-medium mb-4">
              Price Range
            </h4>
            <div className="space-y-4">
              {/* Price Range Display */}
              <div className="flex items-center justify-between text-sm text-[var(--theme-text-content-70)]">
                <span>${String(tempPriceRange.min)}</span>
                <span>${String(tempPriceRange.max)}</span>
              </div>

              {/* Dual Range Slider */}
              <div className="relative h-6">
                <div className="absolute top-2 left-0 right-0 h-2 bg-[var(--theme-bg-primary-20)] rounded-full">
                  <div
                    className="absolute h-2 rounded-full"
                    style={{
                      background: "var(--theme-gradient-primary)",
                      left: `${
                        ((tempPriceRange.min - priceRange.min) /
                          (priceRange.max - priceRange.min)) *
                        100
                      }%`,
                      width: `${
                        ((tempPriceRange.max - tempPriceRange.min) /
                          (priceRange.max - priceRange.min)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {/* Min Range Input */}
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={tempPriceRange.min}
                  onChange={(e) =>
                    handlePriceRangeChange({
                      ...tempPriceRange,
                      min: Math.min(Number(e.target.value), tempPriceRange.max),
                    })
                  }
                  className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-min"
                  style={{
                    zIndex:
                      tempPriceRange.min >
                      priceRange.min + (priceRange.max - priceRange.min) * 0.5
                        ? 2
                        : 1,
                  }}
                />

                {/* Max Range Input */}
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={tempPriceRange.max}
                  onChange={(e) =>
                    handlePriceRangeChange({
                      ...tempPriceRange,
                      max: Math.max(Number(e.target.value), tempPriceRange.min),
                    })
                  }
                  className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-max"
                  style={{
                    zIndex:
                      tempPriceRange.max <
                      priceRange.min + (priceRange.max - priceRange.min) * 0.5
                        ? 2
                        : 1,
                  }}
                />
              </div>

              {/* Manual Price Input */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--theme-text-content-60)] mb-1">
                    Min
                  </label>
                  <input
                    type="number"
                    value={tempPriceRange.min}
                    onChange={(e) => {
                      const value = Math.max(
                        priceRange.min,
                        Math.min(Number(e.target.value), tempPriceRange.max)
                      );
                      setTempPriceRange({ ...tempPriceRange, min: value });
                    }}
                    onBlur={handlePriceRangeCommit}
                    className="w-full px-3 py-2 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[var(--theme-text-content-60)] mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    value={tempPriceRange.max}
                    onChange={(e) => {
                      const value = Math.min(
                        priceRange.max,
                        Math.max(Number(e.target.value), tempPriceRange.min)
                      );
                      setTempPriceRange({ ...tempPriceRange, max: value });
                    }}
                    onBlur={handlePriceRangeCommit}
                    className="w-full px-3 py-2 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Options Filters */}
        {productOptions.map((option) => (
          <div key={option.id}>
            <h4 className="text-[var(--theme-text-content)] font-medium mb-3">
              {String(option.name)}
            </h4>

            {/* Color Swatch Options */}
            {option.optionRenderType === "SWATCH_CHOICES" ? (
              <div className="flex flex-wrap gap-4 mb-8">
                {option.choices.map((choice) => (
                  <label
                    key={choice.id}
                    className="cursor-pointer group relative mb-6"
                    title={String(choice.name)}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedOptions[option.id]?.includes(choice.id) || false
                      }
                      onChange={(e) =>
                        handleOptionChange(
                          option.id,
                          choice.id,
                          e.target.checked
                        )
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        selectedOptions[option.id]?.includes(choice.id)
                          ? "border-[var(--theme-text-content)] shadow-lg scale-110 ring-2 ring-[var(--theme-primary-500)]"
                          : "border-[var(--theme-color-border-40)] hover:border-[var(--theme-color-border-80)] hover:scale-105"
                      }`}
                      style={{
                        backgroundColor:
                          choice.colorCode || "var(--theme-text-content-40)",
                      }}
                    />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-[var(--theme-text-content-70)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {String(choice.name)}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              /* Regular Text Options */
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {option.choices.map((choice) => (
                  <label
                    key={choice.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedOptions[option.id]?.includes(choice.id) || false
                      }
                      onChange={(e) =>
                        handleOptionChange(
                          option.id,
                          choice.id,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-30)] rounded text-[var(--theme-primary-500)] focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:ring-offset-0"
                    />
                    <span className="text-[var(--theme-text-content-80)] group-hover:text-[var(--theme-text-content)] transition-colors text-sm">
                      {String(choice.name)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {productOptions.length === 0 && (
          <div className="text-center py-4 text-[var(--theme-text-content-60)]">
            <p>No filter options available</p>
          </div>
        )}
      </div>

      <style>{`
        .range-slider {
          pointer-events: none;
        }
        
        .range-slider::-webkit-slider-thumb {
          pointer-events: all;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--theme-gradient-primary);
          cursor: pointer;
          border: 2px solid var(--theme-text-content);
          box-shadow: 0 2px 8px var(--theme-bg-tooltip);
          position: relative;
        }

        .range-slider::-moz-range-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--theme-gradient-primary);
          cursor: pointer;
          border: 2px solid var(--theme-text-content);
          box-shadow: 0 2px 8px var(--theme-bg-tooltip);
          border: none;
        }

        .range-slider::-webkit-slider-track {
          background: transparent;
          border: none;
        }

        .range-slider::-moz-range-track {
          background: transparent;
          border: none;
        }

        /* Different colors for min and max sliders */
        .range-slider-min::-webkit-slider-thumb {
          background: var(--theme-gradient-primary);
        }
        
        .range-slider-min::-moz-range-thumb {
          background: var(--theme-gradient-primary);
        }
        
        .range-slider-max::-webkit-slider-thumb {
          background: var(--theme-gradient-primary);
        }
        
        .range-slider-max::-moz-range-thumb {
          background: var(--theme-gradient-primary);
        }
      `}</style>
    </div>
  );
};

export default ProductFilters;
