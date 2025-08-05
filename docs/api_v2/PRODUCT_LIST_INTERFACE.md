# ProductList Interface Documentation

A comprehensive product list display component system built with composable primitives, similar to Radix UI architecture, for displaying and filtering collections of products.

## Architecture

The ProductList component follows a compound component pattern where each part can be composed together to create flexible product collection displays. It supports both simplified and headless interfaces.

## Components

### ProductList.Root

The root container that provides product list context to all child components.

**Props**
```tsx
interface ProductListRootProps {
  products?: Product[];
  productsListConfig?: ProductsListServiceConfig;
  productsListSearchConfig?: ProductsListSearchServiceConfig;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    totalProducts: number;
    displayedProducts: number;
    isFiltered: boolean;
  }>;
  className?: string;
}
```

**Data Attributes**
- `data-testid="product-list"` - Applied to root container

**Example**
```tsx
<ProductList.Root products={products}>
  {/* All product list components */}
</ProductList.Root>
```

---

### ProductList.Sorting/ProductList.SortingTrigger

Displays information about the current product list (count, filtering status, etc.).

**Props**
```tsx
interface ProductListSortingProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    sortedBy: 'name' | 'price' | 'date';
    sortDirection: 'asc' | 'desc';
    onSortChange: ({by, direction}: {by?: string, direction?: 'asc' | 'desc'}) => void;
  }>;
  asChild?: boolean;
  className?: string;
  valueFormatter?: ({sortBy, sortDirection}) => string; // used in order to format the value for the select, i.e. to translate the values, mandatory when rendering as select
  as: 'select' | 'list'; // default is 'select'
}

interface SortingOptionTrigger {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    onSortChange: ({by, direction}: {by?: string, direction?: 'asc' | 'desc'}) => void;
    sortBy: 'name' | 'price' | 'date'; // default is 'date'
    sortDirection: 'asc' | 'desc'; // default is 'desc'
  }>;
  sortBy: 'name' | 'price' | 'date';
  sortDirection: 'asc' | 'desc';
}
```

**Important**
The implentation should generate a plain Sort object

**Example**
```tsx
<ProductList.Sorting as="select" valueFormatter={({sortBy, sortDirection}) => `... map to human readable value`} />

// Default usage one list with sort direction indicators
<ProductList.Sorting className="flex gap-2 data-[sort-direction='asc']:arrow-up data-[sort-direction='desc']:arrow-down" as="list">
  <ProductList.SortingTrigger sortBy="name" sortDirection="asc" >By Name (A-Z)</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="name" sortDirection="desc" >By Name (Z-A)</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="price" sortDirection="asc" >Price (Low to High)</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="price" sortDirection="desc" >Price (High to Low)</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="date" sortDirection="asc" >Newest</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="date" sortDirection="desc" >Oldest</ProductList.SortingTrigger>
</ProductList.Sorting>

// Default usage two lists
<ProductList.Sorting as="list">
  // one list for sort options
  <ProductList.SortingTrigger sortBy="name" >By Name</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="price" >Price</ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortBy="date" >Date</ProductList.SortingTrigger>
  
  // one list for sort direction
  <ProductList.SortingTrigger sortDirection="asc" label="Ascending" asChild>
    <Button>Ascending</Button>
  </ProductList.SortingTrigger>
  <ProductList.SortingTrigger sortDirection="desc" label="Descending" asChild>
    <Button>Descending</Button>
  </ProductList.SortingTrigger>
</ProductList.Sorting>

// using plain select
// we should probably implement this as a separate component in components/ui but not in headless components
<ProductList.Sorting asChild>
  {React.forwardRef(({sortedBy, sortDirection, onSortChange, ...props}, ref) => (
    <select defaultValue={`${sortedBy}_${sortDirection}`} ref={ref} {...props} onChange={(e) => {
      const [by, direction] = e.target.value.split('_');
      onSortChange({by, direction});
    }}>
      <option value="date_asc">Newest</option>
      <option value="name_asc">By Name (A-Z)</option>
      <option value="name_desc">By Name (Z-A)</option>
      <option value="price_asc">Price (Low to High)</option>
      <option value="price_desc">Price (High to Low)</option>
    </select>
  ))}
</ProductList.Sorting>
```

**Data Attributes**
- `data-testid="product-list-sorting"` - Applied to sorting container
- `data-filtered` - Is list currently filtered
- `data-sorted-by` - Current sorting by
- `data-sort-direction` - Current sort direction

---

### ProductList.Filters

Container for product list filters and controls.

**Props**
```tsx
interface ProductListFilterProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<ProductList.Filter className="flex gap-4"> // defines the <Filter.Root value={filter} onChange={setFilter}>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <Filter.SingleFilter/> // define how to render a single filter (i.e. radio button)
      <Filter.MultiFilter/> // define how to render a multi filter (i.e. checkbox)
      <Filter.RangeFilter/> // define how to render a range filter (i.e. slider)
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</ProductList.Filter>
```

refere to [Filter.Root](./PLATFORM_INTERFACE.md#filterroot) for more details.

**Data Attributes**
- `data-testid="product-list-filters"` - Applied to filters container

---

### ProductList.Products

Main container for the product list display with support for empty states and custom layouts.
See [ProductList.Root](./PRODUCT_LIST_INTERFACE.md#productlistroot) for more details.

**Props**
```tsx
interface ProductListProductsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<ProductList.Products 
  emptyState={<div>No products found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
>
  <ProductList.ProductRepeater>
    {/* Product template */}
  </ProductList.ProductRepeater>
</ProductList.Products>
```

**Data Attributes**
- `data-testid="product-list-products"` - Applied to products container
- `data-empty` - Is list empty

---

### ProductList.ProductRepeter

Repeats for each product in the list, providing individual product context.

**Props**
```tsx
interface ProductListProductRepeaterProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<ProductList.ProductRepeater className="product-card">
  <Product.Name />
  <Product.Price />
  <Product.MediaGallery>
    <MediaGallery.Viewport />
  </Product.MediaGallery>
</ProductList.ProductRepeater>
```

**Data Attributes**
- `data-testid="product-list-item"` - Applied to each product item
- `data-product-id` - Product ID

---


## Data Attributes Summary

| Attribute | Applied To | Purpose |
|-----------|------------|---------|
| `data-testid="product-list"` | ProductList.Root | Root container identification |
| `data-testid="product-list-info"` | ProductList.Info | List info display |
| `data-testid="product-list-filters"` | ProductList.Filters | Filters container |
| `data-testid="product-list-products"` | ProductList.Products | Products container |
| `data-testid="product-list-item"` | ProductList.ProductRepeter | Individual product item |
| `data-testid="product-list-empty-state"` | ProductList.EmptyState | Empty state container |
| `data-testid="product-list-load-more"` | ProductList.LoadMoreTrigger | Load more button |
| `data-testid="product-list-error"` | ProductList.Error | Error state container |
| `data-testid="product-list-filter-status"` | ProductList.FilterStatus | Filter status display |
| `data-product-id` | ProductList.ProductRepeter | Product ID |
| `data-product-available` | ProductList.ProductRepeter | Product availability |
| `data-filtered` | Various components | Filtering status |
| `data-empty` | ProductList.Products | Empty list status |

## CSS Custom Properties

## Usage Examples

### Basic Usage (Simplified Interface)
```tsx
function BasicProductList() {
  const products = useProducts();

  return (
    <ProductList.Root products={products}>
      <div className="space-y-6">
        {/* Header with Sorting and Filters */}
        <div className="flex justify-between items-center bg-surface-card p-4 rounded-lg">
          <ProductList.Root asChild>
            {React.forwardRef(({totalProducts, displayedProducts, isFiltered, ...props}, ref) => (
              <div ref={ref} {...props} className="text-content-muted">
                Showing {displayedProducts} of {totalProducts} products
                {isFiltered && <span className="ml-2 text-brand-primary">(Filtered)</span>}
              </div>
            ))}
          </ProductList.Root>
          
          <div className="flex gap-4">
            <ProductList.Sorting as="select" valueFormatter={({sortBy, sortDirection}) => 
              `${sortBy === 'name' ? 'Name' : sortBy === 'price' ? 'Price' : 'Date'} (${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`
            } />
            <ProductList.Filters>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.SingleFilter />
                  <Filter.MultiFilter />
                  <Filter.RangeFilter />
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </ProductList.Filters>
          </div>
        </div>

        {/* Product Grid */}
        <ProductList.Products 
          emptyState={<div className="text-center py-12">No products found</div>}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <ProductList.ProductRepeter className="bg-surface-card p-4 rounded-lg border border-surface-subtle hover:shadow-lg transition-shadow">
            <Product.MediaGallery className="mb-4">
              <MediaGallery.Viewport className="aspect-square rounded-lg" />
            </Product.MediaGallery>
            
            <Product.Name className="text-lg font-semibold text-content-primary mb-2" />
            <Product.Price className="text-xl font-bold text-brand-primary" />
            <Product.CompareAtPrice className="text-sm text-content-muted line-through" />
            
            <div className="mt-4 space-y-2">
              <Product.Action.AddToCart label="Add to Cart" className="w-full btn-primary" />
              <Product.Action.QuickView label="Quick View" className="w-full btn-secondary" />
            </div>
          </ProductList.ProductRepeter>
        </ProductList.Products>
      </div>
    </ProductList.Root>
  );
}
```

### Advanced Usage (With Custom Components and Filters)
```tsx
function AdvancedProductList() {
  const products = useProducts();

  return (
    <ProductList.Root products={products}>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <Card className="bg-surface-card border-surface-subtle">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <ProductList.Root asChild>
                {React.forwardRef(({totalProducts, displayedProducts, isFiltered, ...props}, ref) => (
                  <div ref={ref} {...props} className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-content-primary">
                      Products ({displayedProducts})
                    </h2>
                    {isFiltered && (
                      <Badge variant="secondary" className="bg-brand-light text-brand-primary">
                        Filtered
                      </Badge>
                    )}
                  </div>
                ))}
              </ProductList.Root>
              
              <div className="flex flex-wrap gap-3">
                <ProductList.Sorting as="list" className="flex gap-2">
                  <ProductList.SortingTrigger sortBy="name" sortDirection="asc">
                    Name (A-Z)
                  </ProductList.SortingTrigger>
                  <ProductList.SortingTrigger sortBy="price" sortDirection="asc">
                    Price (Low-High)
                  </ProductList.SortingTrigger>
                  <ProductList.SortingTrigger sortBy="date" sortDirection="desc">
                    Newest
                  </ProductList.SortingTrigger>
                </ProductList.Sorting>
                
                <ProductList.Filters>
                  <Filter.FilterOptions>
                    <Filter.FilterOptionRepeater>
                      <Filter.SingleFilter />
                      <Filter.MultiFilter />
                      <Filter.RangeFilter />
                    </Filter.FilterOptionRepeater>
                  </Filter.FilterOptions>
                </ProductList.Filters>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products with Enhanced Layout */}
        <ProductList.Products 
          emptyState={
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-24 h-24 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <PackageIcon className="w-12 h-12 text-content-muted" />
                </div>
                <h3 className="text-2xl font-bold text-content-primary mb-4">
                  No Products Available
                </h3>
                <p className="text-content-muted mb-6 max-w-md mx-auto">
                  Check back later for new products.
                </p>
              </CardContent>
            </Card>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductList.ProductRepeter className="group">
              <Card className="h-full bg-surface-card border-surface-subtle hover:shadow-xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  {/* Product Image with Quick Actions */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Product.MediaGallery>
                      <MediaGallery.Viewport className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      
                      {/* Quick Action Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Product.Action.QuickView asChild>
                          <Button size="sm" variant="secondary" className="shadow-lg">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        </Product.Action.QuickView>
                        <Product.Url asChild>
                          <Button size="sm" variant="secondary" className="shadow-lg">
                            <ShareIcon className="w-4 h-4" />
                          </Button>
                        </Product.Url>
                      </div>
                    </Product.MediaGallery>
                    
                    {/* Product Badge */}
                    <Product.Raw>
                      {React.forwardRef(({product, ...props}, ref) => 
                        product.ribbon?.name && (
                          <div ref={ref} {...props} className="absolute top-2 left-2">
                            <Badge variant="destructive">{product.ribbon.name}</Badge>
                          </div>
                        )
                      )}
                    </Product.Raw>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Product Info */}
                    <div className="space-y-2">
                      <Product.Name asChild>
                        <h3 className="font-semibold text-content-primary line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer" />
                      </Product.Name>
                      
                      <Product.Description asChild>
                        {React.forwardRef(({plainDescription, ...props}, ref) => (
                          <p ref={ref} {...props} className="text-sm text-content-muted line-clamp-2">
                            {plainDescription}
                          </p>
                        ))}
                      </Product.Description>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Product.Price className="text-lg font-bold text-brand-primary" />
                        <Product.CompareAtPrice className="text-sm text-content-muted line-through" />
                      </div>
                      <div className="text-xs text-status-success">In Stock</div>
                    </div>

                    {/* Variants Preview */}
                    <Product.Variants>
                      <Product.VariantOptions>
                        <div className="flex gap-1">
                          <Product.VariantOptionRepeter>
                            <Option.Root>
                              <Option.Choices>
                                <div className="flex gap-1">
                                  <Option.ChoiceRepeter>
                                    <Choice.Color className="w-6 h-6 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform" />
                                  </Option.ChoiceRepeter>
                                </div>
                              </Option.Choices>
                            </Option.Root>
                          </Product.VariantOptionRepeter>
                        </div>
                      </Product.VariantOptions>
                    </Product.Variants>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 space-y-2">
                  <Product.Action.AddToCart 
                    label="Add to Cart" 
                    className="w-full btn-primary" 
                  />
                  <div className="flex gap-2">
                    <Product.Action.BuyNow 
                      label="Buy Now" 
                      className="flex-1 btn-secondary" 
                    />
                    <Button variant="outline" size="sm" className="px-3">
                      <HeartIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </ProductList.ProductRepeter>
          </div>
        </ProductList.Products>
      </div>
    </ProductList.Root>
  );
}
```

### Minimal Example (Essential Components Only)
```tsx
function MinimalProductList() {
  const products = useProducts();

  return (
    <ProductList.Root products={products}>
      <div className="space-y-4">
        <ProductList.Root asChild>
          {React.forwardRef(({displayedProducts, ...props}, ref) => (
            <div ref={ref} {...props} className="text-sm text-content-muted">
              {displayedProducts} products
            </div>
          ))}
        </ProductList.Root>
        
        <ProductList.Products 
          emptyState={<p className="text-center py-8">No products found</p>}
          className="grid grid-cols-2 gap-4"
        >
          <ProductList.ProductRepeter className="border rounded p-4">
            <Product.Name className="font-medium mb-2" />
            <Product.Price className="text-lg font-bold text-brand-primary" />
            <Product.Action.AddToCart label="Add" className="w-full mt-2 btn-primary btn-sm" />
          </ProductList.ProductRepeter>
        </ProductList.Products>
      </div>
    </ProductList.Root>
  );
}
```

### With Search and Filters Integration
```tsx
function SearchableProductList() {
  return (
    <ProductList.Root 
      productsListSearchConfig={{
        searchQuery: "shoes",
        facets: ['brand', 'price', 'color']
      }}
    >
      <div className="space-y-6">
        {/* Search Header */}
        <div className="flex flex-col gap-4">
          <SearchInput />
          <ProductList.Sorting as="select" valueFormatter={({sortBy, sortDirection}) => 
            `Sort by ${sortBy} (${sortDirection})`
          } />
        </div>

        {/* Filters Sidebar + Products */}
        <div className="flex gap-8">
          <aside className="w-64 space-y-6">
            <ProductList.Filters>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.SingleFilter />
                  <Filter.MultiFilter />
                  <Filter.RangeFilter />
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </ProductList.Filters>
          </aside>
          
          <main className="flex-1">
            <ProductList.Products>
              <ProductList.ProductRepeter>
                <Product.Name className="font-semibold mb-2" />
                <Product.Price className="text-brand-primary font-bold" />
                <Product.Action.AddToCart label="Add to Cart" className="w-full mt-2 btn-primary" />
              </ProductList.ProductRepeter>
            </ProductList.Products>
          </main>
        </div>
      </div>
    </ProductList.Root>
  );
}
```