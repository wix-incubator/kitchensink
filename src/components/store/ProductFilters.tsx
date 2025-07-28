import React, { useState } from 'react';
import { ProductListFilters } from '@wix/headless-stores/react';
import type { ProductsListFiltersServiceConfig } from '@wix/headless-stores/services';
import { getStockStatusMessage } from './enums/product-status-enums';

interface ProductFiltersProps {
  productsListFiltersConfig: ProductsListFiltersServiceConfig;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  productsListFiltersConfig,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ProductListFilters.Root
      productsListFiltersConfig={productsListFiltersConfig}
    >
      <div
        className={`bg-surface-primary backdrop-blur-sm rounded-xl p-6 border border-brand-subtle ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-content-primary font-semibold text-lg">
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

            {/* Expand/Collapse button for mobile */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden text-content-secondary hover:text-content-primary transition-colors"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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

        <div
          className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}
        >
          {/* Price Range Filter */}
          <PriceRangeFilter />

          {/* Inventory Status Filter */}
          <InventoryStatusFilter />

          {/* Product Options Filters */}
          <ProductOptionsFilters />
        </div>
      </div>
    </ProductListFilters.Root>
  );
};

// Price Range Filter Component
const PriceRangeFilter: React.FC = () => {
  return (
    <div>
      <h4 className="text-content-primary font-medium mb-3">Price Range</h4>
      <ProductListFilters.PriceRange>
        {({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-content-secondary mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  value={minPrice || ''}
                  onChange={e => setMinPrice(Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-surface-primary rounded-lg bg-surface-primary text-content-primary text-sm focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-content-secondary mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  value={maxPrice || ''}
                  onChange={e => setMaxPrice(Number(e.target.value) || 0)}
                  placeholder="∞"
                  min="0"
                  className="w-full px-3 py-2 border border-surface-primary rounded-lg bg-surface-primary text-content-primary text-sm focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {/* Price range display */}
            {(minPrice > 0 || maxPrice > 0) && (
              <div className="text-xs text-content-muted">
                Range: ${minPrice || 0} - ${maxPrice || '∞'}
              </div>
            )}
          </div>
        )}
      </ProductListFilters.PriceRange>
    </div>
  );
};

// Inventory Status Filter Component
const InventoryStatusFilter: React.FC = () => {
  return (
    <div>
      <h4 className="text-content-primary font-medium mb-3">Availability</h4>
      <ProductListFilters.InventoryStatus>
        {({
          availableInventoryStatuses,
          selectedInventoryStatuses,
          toggleInventoryStatus,
        }) => (
          <div className="space-y-2">
            {availableInventoryStatuses.map(status => (
              <label
                key={status}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedInventoryStatuses.includes(status)}
                  onChange={() => toggleInventoryStatus(status)}
                  className="w-4 h-4 rounded border-2 border-surface-primary bg-surface-primary text-brand-primary focus:ring-brand-primary focus:ring-2 transition-colors"
                />
                <span className="text-content-secondary text-sm group-hover:text-content-primary transition-colors">
                  {getStockStatusMessage(status)}
                </span>
                {selectedInventoryStatuses.includes(status) && (
                  <span className="text-xs text-brand-primary">✓</span>
                )}
              </label>
            ))}
          </div>
        )}
      </ProductListFilters.InventoryStatus>
    </div>
  );
};

// Product Options Filters Component
const ProductOptionsFilters: React.FC = () => {
  return (
    <ProductListFilters.ProductOptions>
      {({ option, selectedChoices, toggleChoice }) => (
        <div key={option.id}>
          <h4 className="text-content-primary font-medium mb-3">
            {option.name}
          </h4>
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
                  className="w-4 h-4 rounded border-2 border-surface-primary bg-surface-primary text-brand-primary focus:ring-brand-primary focus:ring-2 transition-colors"
                />

                {/* Color swatch for color options */}
                {choice.colorCode && (
                  <div
                    className="w-4 h-4 rounded-full border border-surface-primary"
                    style={{ backgroundColor: choice.colorCode }}
                    title={choice.name}
                  />
                )}

                <span className="text-content-secondary text-sm group-hover:text-content-primary transition-colors flex-1">
                  {choice.name}
                </span>

                {selectedChoices.includes(choice.id) && (
                  <span className="text-xs text-brand-primary">✓</span>
                )}
              </label>
            ))}
          </div>

          {/* Show count of selected choices */}
          {selectedChoices.length > 0 && (
            <div className="mt-2 text-xs text-brand-primary">
              {selectedChoices.length} selected
            </div>
          )}
        </div>
      )}
    </ProductListFilters.ProductOptions>
  );
};

export default ProductFilters;
