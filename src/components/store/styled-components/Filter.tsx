import React from 'react';
import { Filter as FilterPrimitive } from '@wix/headless-components/react';

export const Root: React.FC<
  React.ComponentProps<typeof FilterPrimitive.Root>
> = props => <FilterPrimitive.Root {...props} />;

export const Filtered: React.FC<
  React.ComponentProps<typeof FilterPrimitive.Filtered>
> = ({ className, children, ...props }) => (
  <FilterPrimitive.Filtered
    className={`bg-surface-card border border-brand-subtle rounded-lg p-4 mb-4 ${className || ''}`}
    {...props}
  >
    {children}
  </FilterPrimitive.Filtered>
);

export const FilterOptions: React.FC<
  React.ComponentProps<typeof FilterPrimitive.FilterOptions>
> = ({ className, children, ...props }) => (
  <FilterPrimitive.FilterOptions
    className={`space-y-6 ${className || ''}`}
    {...props}
  >
    {children}
  </FilterPrimitive.FilterOptions>
);

export const FilterOptionRepeater: React.FC<
  React.ComponentProps<typeof FilterPrimitive.FilterOptionRepeater>
> = ({ className, children, ...props }) => (
  <FilterPrimitive.FilterOptionRepeater
    className={`space-y-6 ${className || ''}`}
    {...props}
  >
    {children}
  </FilterPrimitive.FilterOptionRepeater>
);

// Action Components
export const Action = {
  Clear: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof FilterPrimitive.Action.Clear>
  >(({ className, ...props }, ref) => (
    <FilterPrimitive.Action.Clear
      ref={ref}
      className={`text-sm text-content-muted hover:text-content-primary transition-colors underline cursor-pointer disabled:text-content-subtle disabled:no-underline disabled:cursor-not-allowed ${className || ''}`}
      {...props}
    />
  )),
};

// FilterOption Components with Theme-Styled Defaults
export const FilterOption = {
  Label: React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof FilterPrimitive.FilterOption.Label>
  >(({ className, children, ...props }, ref) => (
    <FilterPrimitive.FilterOption.Label
      ref={ref}
      className={`text-content-primary font-medium mb-3 block ${className || ''}`}
      {...props}
    >
      {children}
    </FilterPrimitive.FilterOption.Label>
  )),

  SingleFilter: React.forwardRef<
    HTMLElement,
    React.ComponentProps<typeof FilterPrimitive.FilterOption.SingleFilter>
  >(({ className, ...props }, ref) => (
    <FilterPrimitive.FilterOption.SingleFilter
      ref={ref}
      className={`flex gap-2 [&_button]:px-3 [&_button]:py-2 [&_button]:rounded-md [&_button]:text-sm [&_button]:font-medium [&_button]:border [&_button]:transition-all [&_button]:cursor-pointer [&_button]:border-slate-300 [&_button]:bg-slate-50 [&_button]:text-slate-700 [&_button[data-state=on]]:bg-slate-900 [&_button[data-state=on]]:text-white [&_button[data-state=on]]:border-slate-900 [&_button[data-state=off]:hover]:bg-slate-100 ${className || ''}`}
      {...props}
    />
  )),

  MultiFilter: React.forwardRef<
    HTMLElement,
    React.ComponentProps<typeof FilterPrimitive.FilterOption.MultiFilter>
  >(({ className, ...props }, ref) => (
    <FilterPrimitive.FilterOption.MultiFilter
      ref={ref}
      className={`flex flex-wrap gap-2 [&_button]:transition-all [&_button]:cursor-pointer [&_button]:px-3 [&_button]:py-2 [&_button]:rounded-md [&_button]:text-sm [&_button]:font-medium [&_button]:border [&_button]:border-slate-300 [&_button]:bg-slate-50 [&_button]:text-slate-700 [&_button[data-state=on]]:bg-slate-900 [&_button[data-state=on]]:text-white [&_button[data-state=on]]:border-slate-900 [&_button[data-state=off]:hover]:bg-slate-100 ${className || ''}`}
      {...props}
    />
  )),

  RangeFilter: React.forwardRef<
    HTMLElement,
    React.ComponentProps<typeof FilterPrimitive.FilterOption.RangeFilter>
  >(({ className, ...props }, ref) => (
    <FilterPrimitive.FilterOption.RangeFilter
      ref={ref}
      className={`space-y-4 [&_span[dir=ltr]]:relative [&_span[dir=ltr]]:flex [&_span[dir=ltr]]:items-center [&_span[dir=ltr]]:select-none [&_span[dir=ltr]]:touch-none [&_span[dir=ltr]]:w-full [&_span[dir=ltr]]:h-5 [&_span[data-orientation=horizontal]]:bg-slate-200 [&_span[data-orientation=horizontal]]:relative [&_span[data-orientation=horizontal]]:grow [&_span[data-orientation=horizontal]]:rounded-full [&_span[data-orientation=horizontal]]:h-2 [&_span[data-orientation=horizontal][style*=left]:not([style*=position])]:absolute [&_span[data-orientation=horizontal][style*=left]:not([style*=position])]:bg-slate-900 [&_span[data-orientation=horizontal][style*=left]:not([style*=position])]:rounded-full [&_span[data-orientation=horizontal][style*=left]:not([style*=position])]:h-full [&_span[role=slider]]:block [&_span[role=slider]]:w-5 [&_span[role=slider]]:h-5 [&_span[role=slider]]:bg-white [&_span[role=slider]]:shadow-lg [&_span[role=slider]]:border-2 [&_span[role=slider]]:border-slate-900 [&_span[role=slider]]:rounded-full [&_span[role=slider]]:cursor-pointer [&_span[role=slider]:hover]:bg-slate-50 [&_span[role=slider]:focus]:outline-none [&_span[role=slider]:focus]:shadow-slate-500 [&_span[data-range-value]]:px-2 [&_span[data-range-value]]:py-1 [&_span[data-range-value]]:bg-slate-100 [&_span[data-range-value]]:rounded [&_span[data-range-value]]:border [&_span[data-range-value]]:border-slate-300 [&>div:last-child]:flex [&>div:last-child]:justify-between [&>div:last-child]:text-sm [&>div:last-child]:text-slate-600 ${className || ''}`}
      {...props}
    />
  )),
};

// Set display names
Action.Clear.displayName = 'Filter.Action.Clear';
FilterOption.Label.displayName = 'Filter.FilterOption.Label';
FilterOption.SingleFilter.displayName = 'Filter.FilterOption.SingleFilter';
FilterOption.MultiFilter.displayName = 'Filter.FilterOption.MultiFilter';
FilterOption.RangeFilter.displayName = 'Filter.FilterOption.RangeFilter';

// Export default to support namespace imports
export default {
  Root,
  Filtered,
  FilterOptions,
  FilterOptionRepeater,
  Action,
  FilterOption,
};
