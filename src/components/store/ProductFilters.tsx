import React, { useState } from 'react';
import { getStockStatusMessage } from './enums/product-status-enums';
import { ProductListFilters } from '@wix/headless-stores/react';
import PriceRangeSelector from './PriceRangeSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  
}

export const ProductFilters: React.FC<ProductFiltersProps> = () => {
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
    <Card className="border-surface-subtle mb-6 bg-surface-card">
      <CardContent className="p-6">
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
                  <Button
                    variant="link"
                    size="sm"
                    onClick={resetFilters}
                    className="text-content-muted"
                  >
                    Clear All
                  </Button>
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

        <div
          className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}
        >
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
                      <Label
                        key={choice.id}
                        className="cursor-pointer group relative mb-6"
                        title={formatChoiceName(choice, option.id)}
                      >
                        <Checkbox
                          checked={selectedChoices.includes(choice.id)}
                          onCheckedChange={() => toggleChoice(choice.id)}
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
                              choice.colorCode ||
                              'var(--theme-text-content-40)',
                          }}
                        />
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-content-light opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatChoiceName(choice, option.id)}
                        </span>
                      </Label>
                    ))}
                  </div>
                ) : (
                  /* Regular Text Options */
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {option.choices.map(choice => (
                      <div
                        key={choice.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          id={`choice-${choice.id}`}
                          checked={selectedChoices.includes(choice.id)}
                          onCheckedChange={() => toggleChoice(choice.id)}
                        />
                        <Label
                          htmlFor={`choice-${choice.id}`}
                          className="text-content-secondary"
                        >
                          {formatChoiceName(choice, option.id)}
                        </Label>
                      </div>
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
                    <div
                      key={status}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedInventoryStatuses.includes(status)}
                        onCheckedChange={() => toggleInventoryStatus(status)}
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className="text-content-secondary"
                      >
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
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ProductListFilters.InventoryStatus>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
