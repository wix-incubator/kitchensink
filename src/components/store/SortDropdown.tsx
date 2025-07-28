import React from 'react';
import { ProductListSort } from '@wix/headless-stores/react';
import { SortType } from '@wix/headless-stores/services';

export function SortDropdown() {
  return (
    <ProductListSort.Root>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-content-primary font-semibold text-sm uppercase tracking-wide">
            Sort Products
          </h3>
        </div>

        <ProductListSort.Options>
          {({ selectedSortOption, setSelectedSortOption, sortOptions }) => (
            <div className="relative">
              <select
                value={selectedSortOption}
                onChange={e => setSelectedSortOption(e.target.value)}
                className="w-full px-4 py-2 bg-surface-primary border border-surface-primary rounded-lg text-content-primary focus:outline-none focus:border-brand-primary transition-colors"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>
                    {getSortOptionLabel(option)}
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-content-secondary"
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
              </div>
            </div>
          )}
        </ProductListSort.Options>
      </div>
    </ProductListSort.Root>
  );
}

// Helper function to convert sort option to display label
function getSortOptionLabel(sortOption: SortType): string {
  switch (sortOption) {
    case SortType.NEWEST:
      return 'Newest First';
    case SortType.NAME_ASC:
      return 'Name: A to Z';
    case SortType.NAME_DESC:
      return 'Name: Z to A';
    case SortType.PRICE_ASC:
      return 'Price: Low to High';
    case SortType.PRICE_DESC:
      return 'Price: High to Low';
    case SortType.RECOMMENDED:
      return 'Recommended';
    default:
      return String(sortOption);
  }
}

export default SortDropdown;
