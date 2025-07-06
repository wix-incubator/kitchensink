# Store Components Index

This module exports all the headless components for store/e-commerce catalog functionality.

## Overview

The store components provide headless functionality for product catalogs, collections, variants, and related store operations. These components are designed to be framework-agnostic and use render props patterns for maximum flexibility.

## Exports

### Sort

Components for handling product sorting functionality.

**Signature:**
```tsx
export * as Sort from "./Sort";
```

The Sort namespace includes:
- `Provider` - Sort context provider
- `Controller` - Sort controller with render props
- `useSortContext` - Hook for accessing sort context

**Example:**
```tsx
import { Sort } from "../../headless/store/components";

<Sort.Provider>
  <Sort.Controller>
    {({ currentSort, setSortBy }) => (
      <select value={currentSort} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Default</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    )}
  </Sort.Controller>
</Sort.Provider>
```

### Category

Components for category selection and management.

**Signature:**
```tsx
export * as Category from "./Category";
```

The Category namespace includes:
- `Provider` - Category context provider
- `List` - Category list with render props
- `useCategory` - Hook for accessing category service

**Example:**
```tsx
import { Category } from "../../headless/store/components";

<Category.Provider>
  <Category.List>
    {({ categories, selectedCategory, setSelectedCategory }) => (
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <button onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </Category.List>
</Category.Provider>
```

### FilteredCollection

Components for filtered product collections with advanced filtering capabilities.

**Signature:**
```tsx
export * as FilteredCollection from "./FilteredCollection";
```

The FilteredCollection namespace includes:
- `Provider` - Filtered collection context provider
- `Grid` - Product grid with filtering
- `Filters` - Filter controls
- `FiltersLoading` - Loading state for filters

**Example:**
```tsx
import { FilteredCollection } from "../../headless/store/components";

<FilteredCollection.Provider>
  <FilteredCollection.Grid>
    {({ products, isLoading, totalProducts }) => (
      <div>
        <p>Total: {totalProducts}</p>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    )}
  </FilteredCollection.Grid>
</FilteredCollection.Provider>
```

### ProductVariantSelector

Components for managing product variant selection.

**Signature:**
```tsx
export * as ProductVariantSelector from "./ProductVariantSelector";
```

The ProductVariantSelector namespace includes:
- `Options` - Product options display
- `Choice` - Individual choice selection
- `AddToCartButton` - Add to cart with variant handling

**Example:**
```tsx
import { ProductVariantSelector } from "../../headless/store/components";

<ProductVariantSelector.Options>
  {({ options, selectedChoices, onChoiceSelect }) => (
    <div>
      {options.map(option => (
        <div key={option.name}>
          <h4>{option.name}</h4>
          {option.choices.map(choice => (
            <button
              key={choice.value}
              onClick={() => onChoiceSelect(option.name, choice.value)}
            >
              {choice.description}
            </button>
          ))}
        </div>
      ))}
    </div>
  )}
</ProductVariantSelector.Options>
```

### RelatedProducts

Components for displaying related products.

**Signature:**
```tsx
export * as RelatedProducts from "./RelatedProducts";
```

The RelatedProducts namespace includes:
- `List` - Related products list
- `Item` - Individual related product item

**Example:**
```tsx
import { RelatedProducts } from "../../headless/store/components";

<RelatedProducts.List>
  {({ products, isLoading, hasProducts }) => (
    <div>
      {hasProducts && (
        <div>
          <h3>Related Products</h3>
          {products.map(product => (
            <RelatedProducts.Item key={product._id} product={product}>
              {({ title, image, price, href }) => (
                <a href={href}>
                  <img src={image} alt={title} />
                  <h4>{title}</h4>
                  <p>{price}</p>
                </a>
              )}
            </RelatedProducts.Item>
          ))}
        </div>
      )}
    </div>
  )}
</RelatedProducts.List>
```

### SocialSharing

Components for social media sharing functionality.

**Signature:**
```tsx
export * as SocialSharing from "./SocialSharing";
```

The SocialSharing namespace includes:
- `Root` - Social sharing root component
- `Platforms` - Platform-specific sharing

**Example:**
```tsx
import { SocialSharing } from "../../headless/store/components";

<SocialSharing.Root>
  {({ platforms, shareFacebook, shareTwitter, copyLink }) => (
    <div>
      <button onClick={shareFacebook}>Share on Facebook</button>
      <button onClick={shareTwitter}>Share on Twitter</button>
      <button onClick={copyLink}>Copy Link</button>
    </div>
  )}
</SocialSharing.Root>
```

### Collection

Components for product collection display and management.

**Signature:**
```tsx
export * as Collection from "./Collection";
```

The Collection namespace includes:
- `Grid` - Product grid display
- `Item` - Individual product item
- `Header` - Collection header with stats

**Example:**
```tsx
import { Collection } from "../../headless/store/components";

<Collection.Grid>
  {({ products, isLoading, hasProducts }) => (
    <div>
      <Collection.Header>
        {({ totalProducts, isLoading: headerLoading }) => (
          <h2>Products ({totalProducts})</h2>
        )}
      </Collection.Header>
      
      {hasProducts && (
        <div className="grid">
          {products.map(product => (
            <Collection.Item key={product._id} product={product}>
              {({ title, image, price, href }) => (
                <a href={href}>
                  <img src={image} alt={title} />
                  <h3>{title}</h3>
                  <p>{price}</p>
                </a>
              )}
            </Collection.Item>
          ))}
        </div>
      )}
    </div>
  )}
</Collection.Grid>
```

### Product

Components for individual product display and management.

**Signature:**
```tsx
export * as Product from "./Product";
```

The Product namespace includes:
- `Name` - Product name display
- `Description` - Product description
- `Details` - Product details and specifications

**Example:**
```tsx
import { Product } from "../../headless/store/components";

<Product.Name>
  {({ name, isLoading }) => (
    <h1>{name}</h1>
  )}
</Product.Name>

<Product.Description>
  {({ description, isLoading }) => (
    <div dangerouslySetInnerHTML={{ __html: description }} />
  )}
</Product.Description>
```

### ProductModifiers

Components for product modifiers and customization options.

**Signature:**
```tsx
export * as ProductModifiers from "./ProductModifiers";
```

The ProductModifiers namespace includes:
- `Modifiers` - All product modifiers
- `FreeText` - Free text input modifier

**Example:**
```tsx
import { ProductModifiers } from "../../headless/store/components";

<ProductModifiers.Modifiers>
  {({ modifiers, hasModifiers, selectedModifiers }) => (
    <div>
      {hasModifiers && (
        <div>
          <h3>Customize Your Product</h3>
          {modifiers.map(modifier => (
            <div key={modifier.name}>
              <label>{modifier.name}</label>
              {/* Render modifier input based on type */}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</ProductModifiers.Modifiers>
```

### SelectedVariant

Components for managing selected product variants.

**Signature:**
```tsx
export * as SelectedVariant from "./SelectedVariant";
```

The SelectedVariant namespace includes:
- `ProductDetails` - Selected variant details
- Variant-specific information and pricing

**Example:**
```tsx
import { SelectedVariant } from "../../headless/store/components";

<SelectedVariant.ProductDetails>
  {({ variant, price, availability, image }) => (
    <div>
      <img src={image} alt="Product" />
      <h2>{variant.name}</h2>
      <p>{price}</p>
      <p>Availability: {availability}</p>
    </div>
  )}
</SelectedVariant.ProductDetails>
```

## Usage Examples

The store components are used extensively throughout the application:

### In Product List Pages
```tsx
// src/components/store/ProductList.tsx
import { FilteredCollection } from "../../headless/store/components";

export const ProductGridContent = () => (
  <FilteredCollection.Provider>
    <FilteredCollection.Grid>
      {({ products, isLoading, totalProducts }) => (
        <FilteredCollection.Filters>
          {({ currentFilters, applyFilters, clearFilters }) => (
            <div>
              <ProductFilters 
                currentFilters={currentFilters}
                onFiltersChange={applyFilters}
                clearFilters={clearFilters}
              />
              <ProductGrid products={products} />
            </div>
          )}
        </FilteredCollection.Filters>
      )}
    </FilteredCollection.Grid>
  </FilteredCollection.Provider>
);
```

### In Product Detail Pages
```tsx
// src/components/store/ProductDetails.tsx
import { Product, ProductVariantSelector, SelectedVariant } from "../../headless/store/components";

export default function ProductDetails() {
  return (
    <div>
      <Product.Name>
        {({ name }) => <h1>{name}</h1>}
      </Product.Name>
      
      <SelectedVariant.ProductDetails>
        {({ variant, price, image }) => (
          <div>
            <img src={image} alt={variant.name} />
            <p>{price}</p>
          </div>
        )}
      </SelectedVariant.ProductDetails>
      
      <ProductVariantSelector.Options>
        {({ options, selectedChoices, onChoiceSelect }) => (
          <VariantSelector 
            options={options}
            selectedChoices={selectedChoices}
            onChoiceSelect={onChoiceSelect}
          />
        )}
      </ProductVariantSelector.Options>
    </div>
  );
}
```

### In Store Example Pages
```tsx
// src/react-pages/store/example-1/index.tsx
import { FilteredCollection } from "../../../headless/store/components";

export default function StoreExample1Page() {
  return (
    <StoreLayout>
      <FilteredCollection.Provider>
        <FilteredCollection.Grid>
          {({ products, isLoading, totalProducts }) => (
            <div>
              <h1>Store Collection ({totalProducts})</h1>
              <ProductGrid products={products} />
            </div>
          )}
        </FilteredCollection.Grid>
      </FilteredCollection.Provider>
    </StoreLayout>
  );
}
```

### In WixServicesProvider
```tsx
// src/providers/WixServicesProvider.tsx
import { 
  CollectionServiceDefinition, 
  ProductServiceDefinition,
  CategoryServiceDefinition 
} from "../headless/store/services";

export default function WixServicesProvider({ children }) {
  const servicesMap = createServicesMap()
    .addService(CollectionServiceDefinition, CollectionService)
    .addService(ProductServiceDefinition, ProductService)
    .addService(CategoryServiceDefinition, CategoryService);

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      {children}
    </ServicesManagerProvider>
  );
}
``` 