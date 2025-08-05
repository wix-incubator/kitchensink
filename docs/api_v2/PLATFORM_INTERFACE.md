### Filter.Root

Container for filter controls.

**Props**
```tsx
interface FilterRootProps {
  children?: React.ReactNode;
  value: Filter; // platform filter object, same one sent as query.filter
  onChange: (value: Filter) => void;
  onFilterChange: ({ value?: string; key: string }) => Filter;
  filterOptions: Array<{
    label: string;
    key: string;
    value?: any; // number[] (for range) | string[] (for multi) | string (for single)
    valueFormatter?: (value: string | number) => string;
    validValues?: Array<string | number>;
    type: 'single' | 'multi' | 'range';
    displayType: 'color' | 'text' | 'range';
  }>;
}

interface FilterOptions {
  allowedDisplayTypes: Array<'color' | 'text' | 'range'>; // use in case the 
  allowedTypes: Array<'single' | 'multi' | 'range'>;
}

interface FilterOptionsLabel {
  children?: React.ForwardRefRenderFunction<HTMLDivElement, {
    label: string;
  }>;
  asChild?: boolean;
}

interface FilterOptionRepeaterProps {
  children?: React.ForwardRefRenderFunction<HTMLDivElement, {
    label: string;
    key: string;
    value: string;
    onChange: (value: string) => void;
    onFilterChange: ({ value?: string; key: string }) => Filter;
    filterOptions: Array<{
      label: string;
      key: string;
    }>;
  }>;
}

interface SingleFilterProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLDivElement, {
    label: string;
    key: string;
    value: string;
    onChange: (value: string) => void;
    onFilterChange: ({ value?: string; key: string }) => Filter;
    filterOptions: Array<{
      label: string;
      key: string;
    }>;
  }>; 
}

interface MultiFilterProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLDivElement, {
    label: string;
    key: string;
    value: string[];
    onChange: (value: string[]) => void;
    onFilterChange: ({ value?: string; key: string }) => Filter;
    filterOptions: Array<{
      label: string;
      key: string;
    }>;
  }>;
}

interface RangeFilterProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    label: string;
    key: string;
    value: number[];
    onChange: (value: number[]) => void;
    onFilterChange: ({ value?: string; key: string }) => Filter;
    filterOptions: number[];
  }>;
}
```

**Example**
```tsx
<Filter.Root value={filter} onChange={setFilter}>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <FilterOption.Label>
      <FilterOption.SingleFilter/> // define how to render a single filter (i.e. radio button)
      <FilterOption.MultiFilter/> // define how to render a multi filter (i.e. checkbox)
      <FilterOption.RangeFilter/> // define how to render a range filter (i.e. slider)
    </FilterOption.Label>
  </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</Filter.Root>
```

The props are probably a bit off but the idea is that the user of the filter provides it with a platformized filter object and a function to update the filter.

The filter object is the same one sent as query.filter.

The function to update the filter is a function that takes a filter object and returns a filter object.

The filter object is the same one sent as query.filter.

The function to update the filter is a function that takes a filter object and returns a filter object.

When presenting the values for example in a range filter, it can use the value formatter in order to convert 10 to 10$
The allowed types/display types are used in order to be able to set different styles for different types of filters, so the label can be rendered differently.
the headless components can include just the renderprops mode for each filter type, but using shadcn we should provide basic implementations for each filter type. for example for a single filter we can have a radio button group, for a multi filter we can have a checkbox group, and for a range filter we can have a slider.

---

### Quantity.Root

Container for quantity selection controls.

**Props**
```tsx
interface QuantityRootProps {
  children: React.ReactNode;
  steps?: number; // default - 1 - how much to increment/decrement
  onValueChange?: (value: number) => void;
}
```

**Data Attributes**
- `data-testid="quantity-root"` - Applied to quantity root container

**Example**
```tsx
// Default usage
<Quantity.Root steps={1} onValueChange={(value) => updateQuantity(value)} onReset={() => updateQuantity(1)}>
  <Quantity.Decrement />
  <Quantity.Input />
  <Quantity.Increment />
  <Quantity.Reset />
</Quantity.Root>
```

---

### Quantity.Increment/Quantity.Decrement

Increment/Decrement quantity buttons.

**Props**
```tsx
interface QuantityIncrementProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
interface QuantityDecrementProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Data Attributes**
- `data-testid="quantity-increment"` - Applied to increment button
- `data-testid="quantity-decrement"` - Applied to decrement button
- `disabled` - Is button disabled

**Example**
```tsx
// Default usage
<Quantity.Increment className="px-3 py-2 border rounded hover:bg-surface-primary" />
<Quantity.Decrement className="px-3 py-2 border rounded hover:bg-surface-primary" />

// Custom rendering with forwardRef
<Quantity.Increment asChild>
  {React.forwardRef((props, ref) => (
    <button 
      ref={ref} 
      {...props}
      className="px-3 py-2 border rounded hover:bg-surface-primary transition-colors"
    >
      <Plus className="h-4 w-4" />
    </button>
  ))}
</Quantity.Increment>

<Quantity.Decrement asChild>
  {React.forwardRef((props, ref) => (
    <button 
      ref={ref} 
      {...props}
      className="px-3 py-2 border rounded hover:bg-surface-primary transition-colors"
    >
      <Minus className="h-4 w-4" />
    </button>
  ))}
</Quantity.Decrement>
```

---

### Quantity.Input

Displays and allows editing of the current quantity value.

**Props**
```tsx
interface QuantityInputProps {
  asChild?: boolean;
  disabled?: boolean; // default - false - if true, the input is always disabled, if false it is based on whether the quantity can be changed
  children?: React.ForwardRefRenderFunction<HTMLInputElement, {
    value: number;
    onChange: (value: number) => void;
  }>;
}
```

**Data Attributes**
- `data-testid="quantity-input"` - Applied to input element
- `disabled` - Is input disabled

**Example**
```tsx
// Default usage
<Quantity.Input className="px-4 py-2 border text-center min-w-16 focus:ring-2 focus:ring-brand-primary" />

// Custom rendering with forwardRef
<Quantity.Input asChild>
  {React.forwardRef(({value, onChange, ...props}, ref) => (
    <input 
      ref={ref}
      {...props}
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="px-4 py-2 border text-center min-w-16 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      min="1"
    />
  ))}
</Quantity.Input>
```

---

### Quantity.Reset

Reset quantity to default value.

**Props**
```tsx
interface QuantityResetProps {
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Example**
```tsx
<Quantity.Reset className="px-3 py-2 border rounded hover:bg-surface-primary">
  <button>Reset</button>
</Quantity.Reset>
```
---