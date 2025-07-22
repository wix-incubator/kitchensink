import React, { useState } from 'react';
import { ProductsListFilters } from '../../pages/store/example-1/products-list-filters-components';

interface ProductFiltersProps {
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Setup document-level event listeners for proper drag handling
  // useEffect(() => {
  //   const handleMouseUp = () => handlePriceRangeCommit();
  //   const handleTouchEnd = () => handlePriceRangeCommit();

  //   document.addEventListener('mouseup', handleMouseUp);
  //   document.addEventListener('touchend', handleTouchEnd);

  //   return () => {
  //     document.removeEventListener('mouseup', handleMouseUp);
  //     document.removeEventListener('touchend', handleTouchEnd);
  //   };
  // }, [handlePriceRangeCommit]);

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
          <ProductsListFilters.ResetTrigger>
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
          </ProductsListFilters.ResetTrigger>
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

      <ProductsListFilters.PriceRange>
        {({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => (
          <div
            className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}
          >
            <div>
              <h4 className="text-content-primary font-medium mb-4">
                Price Range
              </h4>
              <div className="space-y-4">
                {/* Price Range Display */}
                <div className="flex items-center justify-between text-sm text-content-light">
                  <span>${String(minPrice)}</span>
                  <span>${String(maxPrice)}</span>
                </div>

                {/* Dual Range Slider */}
                <div className="relative h-6">
                  <div className="absolute top-2 left-0 right-0 h-2 bg-brand-medium rounded-full">
                    <div
                      className="absolute h-2 rounded-full bg-gradient-primary"
                      style={{
                        left: `${
                          ((minPrice - minPrice) / (maxPrice - minPrice)) * 100
                        }%`,
                        width: `${
                          ((maxPrice - minPrice) / (maxPrice - minPrice)) * 100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Min Range Input */}

                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={minPrice}
                    onChange={e => setMinPrice(Number(e.target.value))}
                    className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-min"
                    style={{
                      zIndex:
                        minPrice > minPrice + (maxPrice - minPrice) * 0.5
                          ? 2
                          : 1,
                    }}
                  />

                  {/* Max Range Input */}
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-max"
                    style={{
                      zIndex:
                        maxPrice < minPrice + (maxPrice - minPrice) * 0.5
                          ? 2
                          : 1,
                    }}
                  />
                </div>

                {/* Manual Price Input */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-content-muted mb-1">
                      Min
                    </label>

                    <input
                      type="number"
                      value={minPrice}
                      onChange={e => {
                        setMinPrice(Number(e.target.value));
                      }}
                      className="w-full px-3 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-content-muted mb-1">
                      Max
                    </label>

                    <input
                      type="number"
                      value={maxPrice}
                      onChange={e => {
                        setMaxPrice(Number(e.target.value));
                      }}
                      className="w-full px-3 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ProductsListFilters.PriceRange>

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
