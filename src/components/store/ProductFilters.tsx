import React, { useState } from 'react';
import { getStockStatusMessage } from './enums/product-status-enums';
import { ProductListFilters } from '@wix/headless-stores/react';
import PriceRangeSelector from './PriceRangeSelector';

interface ProductFiltersProps {
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to format choice display names
  const formatChoiceName = (
    choice: { id: string; name: string },
    optionId: string
  ): string => {
    // For inventory filter, convert raw status to display message
    if (optionId === 'inventory-filter') {
      // choice.name contains raw status like "IN_STOCK", "OUT_OF_STOCK"
      return getStockStatusMessage(choice.name as any, false);
    }
    // For all other choices, use the name as-is
    return String(choice.name);
  };

  return (
    <div
      className={`bg-surface-primary backdrop-blur-sm rounded-xl p-6 border border-brand-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-content-primary flex items-center gap-2">
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
          <ProductListFilters.ResetTrigger>
            {({ resetFilters, isFiltered }) =>
              isFiltered && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-content-muted hover:text-content-primary transition-colors"
                >
                  Clear All
                </button>
              )
            }
          </ProductListFilters.ResetTrigger>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-content-muted hover:text-content-primary transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isExpanded ? 'rotate-180' : ''
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

      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <ProductListFilters.PriceRange>
          {({
            availableMinPrice,
            availableMaxPrice,
            selectedMinPrice,
            selectedMaxPrice,
            setSelectedMinPrice,
            setSelectedMaxPrice,
          }) => (
            <PriceRangeSelector
              min={availableMinPrice}
              max={availableMaxPrice}
              selectedMin={selectedMinPrice}
              selectedMax={selectedMaxPrice}
              setSelectedMin={setSelectedMinPrice}
              setSelectedMax={setSelectedMaxPrice}
            />
          )}
        </ProductListFilters.PriceRange>

        {/* Product Options Filters */}
        <ProductListFilters.ProductOptions>
          {({ option, selectedChoices, toggleChoice }) => (
            <div key={option.id}>
              <h4 className="text-content-primary font-medium mb-3">
                {String(option.name)}
              </h4>

              {/* Color Swatch Options */}
              {option.optionRenderType === 'SWATCH_CHOICES' ? (
                <div className="flex flex-wrap gap-4 mb-8">
                  {option.choices.map(choice => (
                    <label
                      key={choice.id}
                      className="cursor-pointer group relative mb-6"
                      title={formatChoiceName(choice, option.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChoices.includes(choice.id)}
                        onChange={() => toggleChoice(choice.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          selectedChoices.includes(choice.id)
                            ? 'border-content-primary shadow-lg scale-110 ring-2 ring-brand-primary'
                            : 'border-color-swatch hover:border-color-swatch-hover hover:scale-105'
                        }`}
                        style={{
                          backgroundColor:
                            choice.colorCode || 'var(--theme-text-content-40)',
                        }}
                      />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-content-light opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatChoiceName(choice, option.id)}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                /* Regular Text Options */
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {option.choices.map(choice => (
                    <label
                      key={choice.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedChoices.includes(choice.id)}
                        onChange={() => toggleChoice(choice.id)}
                        className="w-4 h-4 bg-surface-primary border border-brand-medium rounded text-brand-primary focus:ring-2 focus:ring-brand-primary focus:ring-offset-0"
                      />
                      <span className="text-content-secondary group-hover:text-content-primary transition-colors text-sm">
                        {formatChoiceName(choice, option.id)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </ProductListFilters.ProductOptions>

        <ProductListFilters.InventoryStatus>
          {({
            availableInventoryStatuses,
            selectedInventoryStatuses,
            toggleInventoryStatus,
          }) => (
            <div>
              <h4 className="text-content-primary font-medium mb-3">
                Availability
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableInventoryStatuses.map(status => (
                  <label
                    key={status}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedInventoryStatuses.includes(status)}
                      onChange={() => toggleInventoryStatus(status)}
                      className="w-4 h-4 bg-surface-primary border border-brand-medium rounded text-brand-primary focus:ring-2 focus:ring-brand-primary focus:ring-offset-0"
                    />
                    <span className="text-content-secondary group-hover:text-content-primary transition-colors text-sm">
                      {(() => {
                        switch (status) {
                          case 'IN_STOCK':
                            return 'In Stock';
                          case 'OUT_OF_STOCK':
                            return 'Out of Stock';
                          case 'PARTIALLY_OUT_OF_STOCK':
                            return 'Partially Out of Stock';
                          default:
                            return status;
                        }
                      })()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </ProductListFilters.InventoryStatus>
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
          background: var(--theme-primary-500);
        }
        
        .range-slider-min::-moz-range-thumb {
          background: var(--theme-primary-500);
        }
        
        .range-slider-max::-webkit-slider-thumb {
          background: var(--theme-primary-600);
        }
        
        .range-slider-max::-moz-range-thumb {
          background: var(--theme-primary-600);
        }
      `}</style>
    </div>
  );
};

export default ProductFilters;
