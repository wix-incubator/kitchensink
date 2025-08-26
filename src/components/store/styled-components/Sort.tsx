import React from 'react';
import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { ProductList as ProductListPrimitive } from '@wix/headless-stores/react';
import type {
  Sort as SortType,
  SortRootProps as PrimitiveSortRootProps,
  SortOptionProps as PrimitiveSortOptionProps,
  SortValue,
} from '@wix/headless-components/react';

// Re-export types from primitive
export type { SortType as SortObject };

// Styled component props (same as primitive for consistency)
export interface SortRootProps extends PrimitiveSortRootProps {
  /** Additional CSS classes */
  className?: string;
}

export interface SortOptionProps extends PrimitiveSortOptionProps {
  /** Additional CSS classes */
  className?: string;
}

export interface StyledProductListSortProps {
  /** Additional CSS classes */
  className?: string;
  as?: 'select' | 'list';
  children?: React.ReactNode;
}

export const StyledProductListSort = (props: StyledProductListSortProps) => {
  return (
    <ProductListPrimitive.Sort>
      {({ currentSort, sortOptions, setSort }) => (
        <Root
          value={currentSort}
          onChange={setSort as (value: SortValue) => void}
          sortOptions={sortOptions}
          as={props.as}
          className={props.className}
        />
      )}
    </ProductListPrimitive.Sort>
  );
};

// Styled Root component - pure styling wrapper, no logic
export const Root: React.FC<SortRootProps> = props => {
  // For select mode, we need to wrap with a container to add the arrow
  // This IF is an exception of the pattern because we need to add the arrow as a design element.
  if (props.as === 'select') {
    return (
      <div className="relative">
        <SortPrimitive.Root
          {...props}
          className={`pl-3 pr-10 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px] appearance-none w-full ${props.className || ''}`}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-content-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }

  // For list mode, use as before
  return (
    <SortPrimitive.Root {...props} className={`${props.className || ''}`} />
  );
};

// Styled Option component - pure styling wrapper, no logic
export const Option: React.FC<SortOptionProps> = props => (
  <SortPrimitive.Option
    {...props}
    className={`px-3 py-2 text-sm text-content-primary hover:bg-brand-light data-[selected=true]:bg-blue-500 data-[selected=true]:text-white rounded cursor-pointer border border-brand-light transition-colors ${props.className || ''}`}
  />
);

// Clean namespace (NO Radix exports)
const SortComponents = {
  Root,
  Option,
};

// Export as Sort namespace
export { SortComponents as Sort };

// Also export as StyledSort for backward compatibility
export const StyledSort = SortComponents;
