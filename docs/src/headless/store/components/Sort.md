# Sort Components

The `Sort` components provide headless functionality for sorting product collections. These components use React context to manage sort state and provide sorting controls.

## Overview

The Sort module exports components and hooks for managing product sorting:

- **Provider** - Context provider for sort state
- **Controller** - Render prop component for sort controls
- **useSortContext** - Hook for accessing sort context

## Exports

### Provider

A React context provider that manages sort state and integrates with the Sort Service.

**Signature:**
```tsx
interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps): JSX.Element
```

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

<Sort.Provider>
  <YourSortingInterface />
</Sort.Provider>
```

### Controller

A render prop component that provides access to sort state and actions.

**Signature:**
```tsx
interface ControllerProps {
  children: (props: SortContextValue) => React.ReactNode;
}

interface SortContextValue {
  currentSort: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

export function Controller({ children }: ControllerProps): JSX.Element
```

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

<Sort.Provider>
  <Sort.Controller>
    {({ currentSort, setSortBy }) => (
      <div className="sort-controls">
        <label htmlFor="sort-select">Sort by:</label>
        <select 
          id="sort-select"
          value={currentSort} 
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="border rounded px-3 py-2"
        >
          <option value="">Default</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="recommended">Recommended</option>
        </select>
      </div>
    )}
  </Sort.Controller>
</Sort.Provider>
```

### useSortContext

A React hook that provides access to the sort context. Must be used within a Sort.Provider.

**Signature:**
```tsx
function useSortContext(): SortContextValue

interface SortContextValue {
  currentSort: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}
```

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

function CustomSortDropdown() {
  const { currentSort, setSortBy } = Sort.useSortContext();
  
  return (
    <div className="relative">
      <button 
        className="flex items-center px-4 py-2 border rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        Sort: {getSortLabel(currentSort)}
        <ChevronDownIcon className="ml-2 w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg">
          <button onClick={() => setSortBy("name-asc")}>Name (A-Z)</button>
          <button onClick={() => setSortBy("price-asc")}>Price (Low to High)</button>
          <button onClick={() => setSortBy("recommended")}>Recommended</button>
        </div>
      )}
    </div>
  );
}

// Use within Provider
<Sort.Provider>
  <CustomSortDropdown />
</Sort.Provider>
```

## Sort Options

The Sort components work with these sort values:

### SortBy Type
```tsx
type SortBy = "" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "recommended";
```

### Sort Options
- `""` (empty string) - Default/no sorting
- `"name-asc"` - Sort by name ascending (A-Z)
- `"name-desc"` - Sort by name descending (Z-A)
- `"price-asc"` - Sort by price ascending (low to high)
- `"price-desc"` - Sort by price descending (high to low)
- `"recommended"` - Sort by recommendation (category-based)

## Integration with Sort Service

The Sort components integrate automatically with the Sort Service:

- **State Synchronization**: The Provider syncs with the Sort Service state
- **Automatic Updates**: Changes in sort selection trigger collection refresh
- **URL Integration**: Sort state can be persisted in URL parameters

## Usage Examples

The Sort components are used throughout the application:

### In Product List Components
```tsx
// src/components/store/ProductList.tsx
import { Sort } from "../../headless/store/components";

export function ProductList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Products</h2>
        
        <Sort.Provider>
          <Sort.Controller>
            {({ currentSort, setSortBy }) => (
              <select 
                value={currentSort} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            )}
          </Sort.Controller>
        </Sort.Provider>
      </div>
      
      <ProductGrid />
    </div>
  );
}
```

### In FilteredCollection Pages
```tsx
// src/react-pages/store/example-2/index.tsx
import { Sort } from "../../../headless/store/components";

export default function StoreExample2Page() {
  return (
    <div>
      <Sort.Provider>
        <div className="flex justify-between items-center mb-8">
          <h1>Advanced Store</h1>
          
          <Sort.Controller>
            {({ currentSort, setSortBy }) => (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={currentSort}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="">Default</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="recommended">Recommended</option>
                </select>
              </div>
            )}
          </Sort.Controller>
        </div>
        
        <ProductGridContent />
      </Sort.Provider>
    </div>
  );
}
```

### Custom Sort Component with Icons
```tsx
import { Sort } from "../../headless/store/components";

function SortButtons() {
  return (
    <Sort.Provider>
      <Sort.Controller>
        {({ currentSort, setSortBy }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy("name-asc")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "name-asc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <AlphabeticalIcon className="w-4 h-4 mr-1" />
              A-Z
            </button>
            
            <button
              onClick={() => setSortBy("price-asc")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "price-asc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <PriceUpIcon className="w-4 h-4 mr-1" />
              Price ↑
            </button>
            
            <button
              onClick={() => setSortBy("price-desc")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "price-desc" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <PriceDownIcon className="w-4 h-4 mr-1" />
              Price ↓
            </button>
            
            <button
              onClick={() => setSortBy("recommended")}
              className={`flex items-center px-3 py-2 rounded ${
                currentSort === "recommended" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <StarIcon className="w-4 h-4 mr-1" />
              Recommended
            </button>
          </div>
        )}
      </Sort.Controller>
    </Sort.Provider>
  );
}
```

### Advanced Sort Dropdown
```tsx
import { Sort } from "../../headless/store/components";

function AdvancedSortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "recommended", label: "Recommended" }
  ];
  
  return (
    <Sort.Provider>
      <Sort.Controller>
        {({ currentSort, setSortBy }) => {
          const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Default";
          
          return (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-48 px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-sm font-medium text-gray-700">
                  Sort: {currentLabel}
                </span>
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              </button>
              
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        currentSort === option.value
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </Sort.Controller>
    </Sort.Provider>
  );
}
```

## Error Handling

The Sort components provide error handling:

### Context Validation
The `useSortContext` hook throws an error if used outside of a `Sort.Provider`:

```tsx
function useSortContext() {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSortContext must be used within a Sort.Provider");
  }
  return context;
}
```

### Service Integration Error Handling
The Provider component handles errors from the Sort Service gracefully and provides fallback states. 