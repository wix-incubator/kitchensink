# Product Interface Documentation

A comprehensive product display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Product component follows a compound component pattern where each part can be composed together to create flexible product displays.

## Components

### Product.Root

The root container that provides product context to all child components.

**Props**
```tsx
interface ProductRootProps {
  product: ProductData;
  selectedVariant?: SelectedVariant;
  children: React.ReactNode;
  asChild?: boolean;
}
```

**Data Attributes**
- `data-testid="product-details"` - Applied to root container

**Example**
```tsx
<Product.Root product={product}>
  {/* All product components */}
</Product.Root>
```

---

### Product.Loading
// OPEN ISSUE: how do we define the loading state?

Displays loading state while product data is being fetched.

**Props**
```tsx
interface ProductLoadingProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<Product.Loading>
  <div className="animate-pulse">Loading product...</div>
</Product.Loading>
```

Note: it does not use asChild since it does not render dom otherwhise
Also, need to see how we use skeleton especially in list.

---

### Product.Raw

Provides direct access to product context data. Should be used only in rare cases and never by Wix implementations

**Props**
```tsx
interface ProductRawProps {
  children: React.ForwardRefRenderFunction<HTMLElement, {
    isLoading: boolean;
    product: Product;
    selectedVariant: SelectedVariant;
  }>;
  asChild?: boolean;
}
```

**Example**
```tsx
<Product.Raw>
  {React.forwardRef(({product, selectedVariant, isLoading, ...props}, ref) => (
    <div ref={ref} {...props}>
      Custom product implementation
    </div>
  ))}
</Product.Raw>
```

---

### Product.Name

Displays the product name with customizable rendering.

**Props**
```tsx
interface ProductNameProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {name: string}>;
}
```

**Data Attributes**
- `data-testid="product-name"` - Applied to name element

**Example**
```tsx
// plain
<Product.Name className="text-4xl font-bold">

// asChild with primitive
<Product.Name asChild>
  <h1 className="text-4xl font-bold">
</Product.Name>

// asChild use with react component (mind the ref)
<Product.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h1 ref={ref} {...props} className="text-4xl font-bold">
      {name}
    </h1>
  ))}
</Product.Name>
```

Note - this approach applies to all text nodes (should probably )
helper Component
---

### Product.Description

Renders the product description with HTML content support.

**Props**
```tsx
interface ProductDescriptionProps {
  as?: 'plain' | 'html' | 'ricos'; // default 'plain'
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    description: string;
  }>;
}
```

**Example**
```tsx
<Product.Description as="plain" className="text-content-secondary" />

// HTML content
<Product.Description as="html" className="prose" />

<Product.Description as="html">
  {({description}) => (
    <div 
      className="text-content-secondary"
      dangerouslySetInnerHTML={{__html: description}}
    />
  )}
</Product.Description>

```

---

### Product.Price

Displays the current product price.

**Props**
```tsx
interface ProductPriceProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    price: string;
    formattedPrice: string;
  }>;
}
```

**Example**
```tsx
// Default usage
<Product.Price className="text-3xl font-bold text-content-primary data-[discounted]:bold" />

// Custom rendering with forwardRef
<Product.Price asChild>
  {React.forwardRef(({price, formattedPrice, ...props}, ref) => (
    <span ref={ref} {...props} className="text-3xl font-bold text-content-primary">
      {formattedPrice}
    </span>
  ))}
</Product.Price>
```

- `data-testid="product-price"` - Applied to variants container
- `data-discounted` - Is price discounted

---

### Product.CompareAtPrice

Displays the compare-at (original) price when on sale.

**Props**
```tsx
interface ProductCompareAtPriceProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    price: Money;
    formattedPrice: string;
  }>;
}
```

**Example**
```tsx
// Default usage (only shows when on sale)
<Product.CompareAtPrice className="text-lg text-content-faded line-through hidden data-[discounted]:inline" />

// Custom rendering with forwardRef
<Product.CompareAtPrice asChild>
  {React.forwardRef(({formattedPrice, ...props}, ref) => (
    <span 
      ref={ref} 
      {...props} 
      className="hidden data-[discounted]:inline text-lg text-content-faded line-through"
    >
      Was: {formattedPrice}
    </span>
  ))}
</Product.CompareAtPrice>
```

**Data Attributes**
- `data-testid="product-compare-at-price"` - Applied to variants container
- `data-discounted` - Is price discounted

---

### Product.Variants (Options and Option)

Container for product variant selection system.
Does not render when there are no variants

**Props**
```tsx
interface ProductVariantsProps {
  children: React.ReactNode;
}
interface ProductVariantOptionsProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    options: Option[];
  }>;
  emptyState?: React.ReactNode;
}
```
**Example**
```tsx
<Product.Variants>
  <Product.VariantOptions>
    <Product.VariantOption {/* option={option} */}  />
  </Product.VariantOptions>
</Product.Variants>
```

**Data Attributes**
- `data-testid="product-variants"` - Applied to variants container

---

### Product.VariantOptions

Individual variant option (e.g., Color, Size).
It renders a generic Option.Root element

**Props**
```tsx
interface ProductVariantOptionProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    option: Option;
  }>;
}
```

**Data Attributes**
- `data-testid="product-variant-option"` - Applied to option container

---

### Product.Variants (Options and Option)

Container for product variant selection system.
Does not render when there are no variants

**Props**
```tsx
interface ProductModifiersProps {
  children: React.ReactNode;
}
interface ProductModifierOptionsProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    options: Option[];
  }>;
  emptyState?: React.ReactNode;
}
interface ProductModifierOptionRepeterProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, Omit<Option, 'option'>>;
}
```
**Example**
```tsx
<Product.Modifiers>
  <Product.ModifierOptions>
    <Product.ModifierOptionRepeter allowedTypes={['color', 'text', 'free-text']} {/* array of<Option.Root option={option} /> */} >
      <Option.Name/>
      <Option.Choices>
        <Option.ChoiceRepeter>
          <Choice.Text/>
          <Choice.Color/>
          <Choice.FreeText/>
        </Option.ChoiceRepeter>
      </Option.Choices>
    </Product.ModifierOptionRepeter>
  </Product.ModifierOptions>
</Product.Modifiers>
```

**Data Attributes**
- `data-testid="product-modifiers"` - Applied to Modifiers container

---

### Product.ModifierOptions

Individual variant option (e.g., Color, Size).
It renders a generic Option.Root element

**Props**
```tsx
interface ProductModifierOptionProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    option: Option;
  }>;
}
```

**Data Attributes**
- `data-testid="product-variant-option"` - Applied to option container

**Contains:**
- Option.Name
- Option.FreeText
- Option.Text
- Option.Color


### Option.Root / Option.Raw

A container for a single option (variant or modifier)

**Props**
```tsx
interface OptionProps {
  option: Option;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  allowedTypes?: ('color' | 'text' | 'free-text')[]; // default - ['color', 'text', 'free-text'] - the types of the options to render
}

interface Option {
  name: string;
}

```

**Example**
```tsx
<Option.Root option={option} onValueChange={() => {}} allowedTypes={['color', 'text']}>
  <Option.Raw asChild>
    {React.forwardRef(({option, onValueChange, ...props}, ref) => (
      <div ref={ref} {...props}>
        {option.name}
      </div>
    ))}
  </Option.Raw>
</Option.Root>
```

**Data Attributes**
- `data-testid="option"` - Applied to choice buttons
- `data-type` - The type of the option 'color' | 'text' | 'free-text'

---

### Option.Name

Displays the name of a variant option.

**Props**
```tsx
interface OptionNameProps {
  asChild?: boolean;
  children?: React.ReactNode;
}
```

**Example**
```tsx
<Option.Name asChild>
  <h3 className="text-lg font-semibold">Color</h3>
</Option.Name>
```

---


### Option.Choices

A container for rendering the available choices for a given option (e.g., the set of color swatches, text buttons, or free text input for a variant or modifier option).
It does not render any UI by itself, but is used to group the available choices for an option.

It is used to render the choices for an option, and is used to render the choices for an option.

**Props**
```tsx
interface OptionChoicesProps {
  children: React.ReactNode;
}
```
**Data Attributes**
- `data-testid="option-choices"` - Applied to choices container
- `data-type` - The type of the option 'color' | 'text' | 'free-text'

---

### Choice.Root/Option.ChoiceRepeter

A container for a single choice (e.g., a color swatch, text button, or free text input for a variant or modifier option).
The Choice.Root acts as a trigger for the choice (selecting it).

**Props**
```tsx
interface Choice {
  colorCode?: string;
  choiceId?: string | null;
  linkedMedia?: ProductMedia[];
  type?: 'color' | 'text' | 'free-text';
  key?: string;
  name?: string | null;
  addedPrice?: string | null;
}
interface ChoiceRootProps {
  children: React.ForwardRefRenderFunction<HTMLElement, {
    choice: Choice;
    onValueChange: (value: string) => void;
  }>;
  asChild?: boolean;
}
```

**Example**
```tsx
<Choice.Root>
  <Choice.FreeText />
</Choice.Root>
```

**Data Attributes**
- `data-testid="choice"` - Applied to choice container
- `data-type` - The type of the option 'color' | 'text' | 'free-text'

---

### Choice.FreeText

Provides a free text input for variant selection.

**Props**
```tsx
interface FreeTextSettings {
    minCharCount?: number;
    
    maxCharCount?: number;
    
    defaultAddedPrice?: string | null;
    
    title?: string;
}

interface ChoiceFreeTextProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLTextAreaElement, FreeTextSettings>;
}
```

**Example**
```tsx
// Default usage
<Choice.FreeText className="p-3 border rounded-lg" />

// Custom rendering with forwardRef
<Choice.FreeText asChild>
  {React.forwardRef(({value, minCharCount, maxCharCount, ...props}, ref) => (
    <textarea 
      ref={ref}
      {...props}
      className="p-3 border rounded-lg resize-none"
      rows={3}
    />
  ))}
</Choice.FreeText>
```

**Data Attributes**
- `data-testid="choice-free-text"` - Applied to free text input
- `data-selected` - Is Choice selected
- `disabled` - Is Choice disabled (not in stock)

---

### Choice.Text

Text-based choice button.

**Props**
```tsx
interface ChoiceTextProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    id: string;
    value: string;
  }>;
}
```

**Example**
```tsx
// Default usage
<Choice.Text className="px-4 py-2 border rounded-lg" />
```

**Data Attributes**
- `data-testid="choice-text"` - Applied to choice buttons
- `data-selected` - Is Choice selected
- `disabled` - Is Choice disabled (not in stock)


---

### Choice.Color

Color swatch choice.

**Props**
```tsx
interface ChoiceColorProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    colorCode: string;
    name: string;
    id: string;
  }>;
}
```

**Data Attributes**
- `data-testid="choice-color"` - Applied to color swatches
- `data-selected` - Is Choice selected
- `disabled` - Is Choice disabled (not in stock)

**Example**
```tsx
// Default usage
<Choice.Color className="w-10 h-10 rounded-full border-4" />

// Custom rendering with forwardRef
<Choice.Color asChild>
  {React.forwardRef(({colorCode, name, ...props}, ref) => (
    <button 
      ref={ref}
      {...props}
      style={{backgroundColor: colorCode}}
      className="w-10 h-10 rounded-full border-4 transition-all data-[selected]:border-brand-primary data-[selected]:shadow-lg scale-110"
      title={name}
    />
  ))}
</Choice.Color>
```

---

### Product.Quantity

Container for quantity selection controls.

**Props**
```tsx
interface ProductQuantityProps {
  children: React.ReactNode;
  steps?: number; // default - 1 - how much to increment/decrement 
}
```

**Example**
```tsx
<Product.Quantity steps={10}>
  <Quantity.Decrement />
  <Quantity.Input />
  <Quantity.Increment />
</Product.Quantity>
```

---

### Quantity.Root

Container for quantity selection controls.

**Props**
```tsx
interface ProductQuantityProps {
  children: React.ReactNode;
  steps?: number; // default - 1 - how much to increment/decrement
  onValueChange?: (value: number) => void;
}
```

**Example**
```tsx
// Default usage
<Quantity.Root steps={10} onValueChange={() => {}}>
  <Quantity.Increment />
  <Quantity.Input />
  <Quantity.Decrement />
</Quantity.Root>
```
---

### Quantity.Increment/Quantity.Decrement

Increment/Decrement quantity button.

**Props**
```tsx
interface QuantityIncrementProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
interface QuantityIncrementProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Example**
```tsx
// Default usage
<Quantity.Increment className="px-3 py-2 border rounded" />
<Quantity.Decrement className="px-3 py-2 border rounded" />

// Custom rendering with forwardRef
<Quantity.Increment asChild>
  {React.forwardRef(({increment, ...props}, ref) => (
    <button 
      ref={ref} 
      {...props}
      className="px-3 py-2 border rounded hover:bg-surface-primary"
    >
      +
    </button>
  ))}
</Quantity.Increment>
```

**Data Attributes**
- `data-testid="quantity-increment|quantity-decrement"` - Applied to increment/decrement button
- `disabled` - Is option disabled

---

### Quantity.Input

Displays current quantity value.

**Props**
```tsx
interface QuantityInputValueProps {
  asChild?: boolean;
  disabled?: boolean; // default - false - if true, the input is always disabled, if false it is based on whether the product quantity can be changed
  children?: React.ForwardRefRenderFunction<HTMLInputElement, {}>;
}
```

**Example**
```tsx
// Default usage
<Quantity.Input className="px-4 py-2 border text-center min-w-16" editable={false} />

// Custom rendering with forwardRef
<Quantity.Input asChild>
  {React.forwardRef((props, ref) => (
    <input 
      ref={ref}
      {...props}
      type="number"
      className="px-4 py-2 border text-center min-w-16 focus:outline-none focus:ring-2 focus:ring-brand-primary"
    />
  ))}
</Quantity.Input>
```

**Data Attributes**
- `data-testid="quantity-input"` - Applied to input
- `disabled` - Is input disabled

---

### Product.MediaGallery

Container for product media gallery.
Renders a MediaGallery.Root with the product media items.

**Props**
```tsx
interface ProductMediaGalleryProps extends Omit<MediaGalleryRootProps, 'items'> {}
```

**Example**
```tsx
<Product.MediaGallery
  infinite={true} 
  autoPlay={true} 
  autoPlayInterval={5000}
  direction="forward"
>
  <MediaGallery.Viewport />
  <MediaGallery.Previous />
  <MediaGallery.Next />
  <MediaGallery.Thumbnails>
    <MediaGallery.ThumbnailRepeter />
  </MediaGallery.Thumbnails>
</Product.MediaGallery>
```

---

### MediaGallery.Root

Media gallery root container.

**Props**
```tsx
interface MediaGalleryRootProps {
  items: MediaItem[];
  children: React.ReactNode;
  infinite?: boolean; // default - false - if true, the gallery will loop back to the first item when the user reaches the end
  autoPlay?: boolean; // default - false - if true, the gallery will automatically advance to the next item every 5 seconds
  direction?: 'forward' | 'backward' | 'top' | 'bottom'; // default - 'forward' - the direction of the gallery
  autoPlayInterval?: number; // default - 5000 - the interval in milliseconds between auto-advances
}
```

**Example**
```tsx
<MediaGallery.Root items={media}>
  <MediaGallery.Viewport />
</MediaGallery.Root>
```

---

### MediaGallery.Viewport

Main media display area.

**Props**
```tsx
interface MediaGalleryViewportProps {
  children?: React.ForwardRefRenderFunction<HTMLImageElement, {currentIndex: number}>;
}
```

**Example**
```tsx
<MediaGallery.Viewport className="w-full h-full" />

<MediaGallery.Viewport asChild>
  {React.forwardRef(({currentIndex, ...props}, ref) => (
    <img ref={ref} {...props} className="w-full h-full" />
  ))}
</MediaGallery.Viewport>
```

---

### MediaGallery.Previous

Previous media navigation button.

**Props**
```tsx
interface MediaGalleryPreviousProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Example**
```tsx
// Default usage
<MediaGallery.Previous className="absolute left-4 top-1/2 -translate-y-1/2" />
```
**Data Attributes**
- `data-testid="media-gallery-previous"` - Applied to previous button
- `disabled` - Is previous button disabled

---

### MediaGallery.Next

Next media navigation button.

**Props**
```tsx
interface MediaGalleryNextProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Example**
```tsx
// Default usage
<MediaGallery.Next className="absolute right-4 top-1/2 -translate-y-1/2" />
```

**Data Attributes**
- `data-testid="media-gallery-next"` - Applied to next button
- `disabled` - Is next button disabled

---

### MediaGallery.Thumbnails

Container for media thumbnails.
This can be used to either render a small images or just small circles for navigation.

**Props**
```tsx
interface MediaGalleryThumbnailsProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<MediaGallery.Thumbnails>
  <MediaGallery.ThumbnailRepeter />
</MediaGallery.Thumbnails>
```

**Data Attributes**
- `data-testid="media-gallery-thumbnails"` - Applied to thumbnails container

---

### MediaGallery.ThumbnailRepeter
Renders a list of thumbnails. (list of <MediaGallery.Thumbnail />)

Media gallery thumbnail.

**Props**
```tsx
interface MediaGalleryThumbnailProps {
  asChild?: boolean;
  as?: 'image' | 'div'; // default - 'image' (render a view port), if 'div' it can be used to render a custom thumbnail
  children: React.ReactNode;
}
```

**Example**
```tsx
<MediaGallery.Thumbnail className="w-10 h-10 rounded-full border-4" />

<MediaGallery.Thumbnail as="div" className="w-2 h-2 rounded-full border-4" />

<MediaGallery.Thumbnail asChild>
  <MediaGallery.Viewport className="w-full h-full" />
</MediaGallery.Thumbnail>
```

**Data Attributes**
- `data-testid="media-gallery-thumbnail"` - Applied to thumbnail
- `data-selected` - Is thumbnail selected
- `data-index` - thumbnail index
- `data-direction` - thumbnail direction
- `disabled` - Is thumbnail disabled

---

### Product.Url

Provides product URL for sharing.

**Props**
```tsx
interface ProductUrlProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    url: string;
  }>;
}
```

**Example**
```tsx
// default usage
<Product.Url asChild>
  <FacebookShare />
</Product.Url>
<Product.Url asChild>
  <TwitterShare />
</Product.Url>

// Custom rendering with forwardRef
<Product.Url asChild>
  {React.forwardRef(({url, ...props}, ref) => (
    <div ref={ref} {...props}>
     // if the rendered component does not support url plain prop
      <FacebookShare facebookUrl={url} />
      <TwitterShare twitterUrl={url} />
    </div>
  ))}
</Product.Url>
```

---

### Product.Action.AddToCart/Product.Action.BuyNow/Product.Action.PreOrder

Add to cart action button.

**Props**
```tsx
interface ProductActionProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
}
```

**Example**
```tsx
// Default usage
<Product.Action.AddToCart label="add to cart" className="w-full btn-primary" />

// Custom rendering with forwardRef
<Product.Action.PreOrder asChild label="Pre Order">
  <button/>
</Product.Action.PreOrder>
```

**Important**
The implentation of these buttons should be done by rendering Cart.Actions.AddToCart and Cart.Actions.BuyNow which are ecommerce headless components.

- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

### Product.InfoSections/InfoSection.Root/InfoSection.Title/InfoSection.Content

```tsx
interface ProductInfoSectionsProps {
  children: React.ReactNode;
}
interface ProductInfoSectionRootProps {
  children: React.ReactNode;
  infoSection: InfoSection;
}
```

**Example**
```tsx
<Product.InfoSections>
  <Product.InfoSectionRepeter> // renders InfoSection.Root
    <InfoSection.Title />
    <InfoSection.Content /> // renders the content of the info section using Ricos
  </Product.InfoSectionRepeter>
</Product.InfoSections>

// with Accordion
<Product.InfoSections>
  <Accordion.Root>
    <Product.InfoSectionRepeter>
       <Accordion.Item>
        <Accordion.Trigger>
          <InfoSection.Title />
        </Accordion.Trigger>
        <Accordion.Content>
          <InfoSection.Content /> // renders the content of the info section using Ricos
        </Accordion.Content>
      </Accordion.Item>
    </Product.InfoSectionRepeter>
  </Accordion.Root>
</Product.InfoSections>
```

**Data Attributes**
- `data-testid="info-section"` - Applied to info section container
- `data-testid="info-section-title"` - Applied to info section title
- `data-testid="info-section-content"` - Applied to info section content

---

### Product.Subscriptions/Subscription.Root/Subscription.Title/Subscription.Root

```tsx
interface ProductSubscriptionsProps {
  children: React.ReactNode;
}
interface SubscriptionRootProps {
  children: React.ReactNode;
  subscription: Subscription;
}
```
**Example**
```tsx
<Product.Subscriptions emptyState={<p>No subscriptions available</p>}>
  <Product.SubscriptionRepeter>
    <Subscription.Title/>
  </Product.SubscriptionRepeter>
</Product.Subscriptions>
```

**Data Attributes**
- `data-testid="subscription"` - Applied to subscription container
- `data-testid="subscription-title"` - Applied to subscription title

---


| Attribute | Applied To | Purpose |
|-----------|------------|---------|
| `data-testid="product-details"` | Product.Root | Root container identification |
| `data-testid="product-name"` | Product.Name | Product name element |
| `data-testid="product-options"` | Product.Variants | Variant options container |
| `data-testid="product-option"` | Product.Variants.Option | Individual option container |
| `data-testid="product-modifiers"` | Product.Modifiers | Modifiers container |
| `data-testid="product-modifier-choice-button"` | Option buttons/swatches | Choice interaction elements |
| `data-testid="product-modifier-free-text-input"` | Free text inputs | Text input elements |
| `data-testid="product-modifier-free-text"` | Free text containers | Free text wrapper |
| `data-testid="view-cart-button"` | Cart navigation | Cart view button |

## CSS Custom Properties

## Usage Examples

### Basic Usage (Default Components) - how should Kitchensink look like
```tsx
function BasicProduct() {
  const product = useProduct();

  return (
    <Product.Root product={product}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Media Gallery */}
        <Product.MediaGallery
          infinite={true}
          autoPlay={false}
          direction="forward"
        >
          <MediaGallery.Viewport className="aspect-square bg-surface-primary rounded-2xl" />
          <MediaGallery.Previous className="absolute left-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full" />
          <MediaGallery.Next className="absolute right-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full" />
          <MediaGallery.Thumbnails>
            <MediaGallery.ThumbnailRepeter>
              <MediaGallery.Thumbnail className="w-16 h-16 rounded-lg border-2 cursor-pointer" />
            </MediaGallery.ThumbnailRepeter>
          </MediaGallery.Thumbnails>
        </Product.MediaGallery>

        {/* Product Info */}
        <div className="space-y-6">
          <Product.Name className="text-4xl font-bold text-content-primary" />
          
          {/* Price Section */}
          <div className="flex items-center gap-3">
            <Product.Price className="text-3xl font-bold text-content-primary data-[discounted]:text-brand-primary" />
            <Product.CompareAtPrice className="text-lg text-content-faded line-through hidden data-[discounted]:inline" />
          </div>
          
          <Product.Description as="html" className="text-content-secondary prose max-w-none" />
          
          {/* Product Variants */}
          <Product.Variants>
            <Product.VariantOptions>
              <Product.VariantOptionRepeter>
                  <Option.Name className="text-lg font-medium mb-3" />
                  <Option.Choices>
                    <Option.ChoiceRepeter>
                      <Choice.FreeText className="w-full p-3 border rounded-lg resize-none" rows={3} />
                      <Choice.Text className="px-4 py-2 border rounded-lg transition-colors data-[selected]:bg-brand-primary data-[selected]:text-white" />
                      <Choice.Color className="w-10 h-10 rounded-full border-4 transition-all data-[selected]:border-brand-primary data-[selected]:shadow-lg" />
                    </Option.ChoiceRepeter>
                  </Option.Choices>
              </Product.VariantOptionRepeter>
            </Product.VariantOptions>
          </Product.Variants>

          {/* Product Modifiers */}
          <Product.Modifiers>
            <Product.ModifierOptions>
              <Product.ModifierOptionRepeter allowedTypes={['color', 'text', 'free-text']}>
                  <Option.Name className="text-lg font-medium mb-3" />
                  <Option.Choices>
                    <Option.ChoiceRepeter>
                      <Choice.FreeText className="w-full p-3 border rounded-lg resize-none" rows={3} />
                      <Choice.Text className="px-4 py-2 border rounded-lg transition-colors data-[selected]:bg-brand-primary data-[selected]:text-white" />
                      <Choice.Color className="w-10 h-10 rounded-full border-4 transition-all data-[selected]:border-brand-primary data-[selected]:shadow-lg" />
                    </Option.ChoiceRepeter>
                  </Option.Choices>
              </Product.ModifierOptionRepeter>
            </Product.ModifierOptions>
          </Product.Modifiers>

          {/* Quantity Selection */}
          <Product.Quantity steps={1}>
            <div className="flex items-center border border-brand-light rounded-lg w-fit">
              <Quantity.Decrement className="px-4 py-2 hover:bg-surface-primary transition-colors" />
              <Quantity.Input className="px-4 py-2 border-x border-brand-light text-center w-16 focus:outline-none" />
              <Quantity.Increment className="px-4 py-2 hover:bg-surface-primary transition-colors" />
            </div>
          </Product.Quantity>

          {/* Product Subscriptions */}
          <Product.Subscriptions emptyState={<p className="text-content-muted">No subscriptions available</p>}>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-content-primary">Available Subscriptions</h3>
              <Product.SubscriptionRepeter>
                <div className="p-3 border border-brand-light rounded-lg">
                  <Subscription.Title className="font-medium text-content-primary" />
                </div>
              </Product.SubscriptionRepeter>
            </div>
          </Product.Subscriptions>

          {/* Product Actions */}
          <div className="space-y-3">
            <Product.Action.AddToCart 
              label="Add to Cart" 
              className="w-full btn-primary py-3 text-lg font-semibold" 
            />
            <Product.Action.BuyNow 
              label="Buy Now" 
              className="w-full btn-secondary py-3 text-lg font-semibold" 
            />
          </div>

          {/* Product Info Sections */}
          <Product.InfoSections>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-content-primary">Product Information</h3>
              <Product.InfoSectionRepeter>
                <div className="border-b border-brand-subtle pb-4">
                  <InfoSection.Title className="text-base font-medium text-content-primary mb-2" />
                  <InfoSection.Content className="text-content-secondary prose prose-sm max-w-none" />
                </div>
              </Product.InfoSectionRepeter>
            </div>
          </Product.InfoSections>

          {/* Social Sharing */}
          <div className="flex gap-2">
            <Product.Url asChild>
              <FacebookShare className="btn-social" />
            </Product.Url>
            <Product.Url asChild>
              <TwitterShare className="btn-social" />
            </Product.Url>
          </div>
        </div>
      </div>
    </Product.Root>
  );
}
```

### Advanced Usage (Custom Components with forwardRef)
```tsx
function CustomizedProduct() {
  const product = useProduct();

  return (
    <Product.Root product={product}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Custom Media Gallery */}
        <Product.MediaGallery 
          infinite={true}
          autoPlay={true}
          autoPlayInterval={3000}
          direction="forward"
        >
          <MediaGallery.Viewport asChild>
            {React.forwardRef(({currentIndex, ...props}, ref) => (
              <div ref={ref} {...props} className="aspect-square bg-gradient-to-br from-surface-primary to-surface-secondary rounded-2xl overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-surface-tooltip text-nav px-2 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {product.media?.length || 1}
                </div>
                <img className="w-full h-full object-cover" />
              </div>
            ))}
          </MediaGallery.Viewport>
          
          <MediaGallery.Thumbnails className="mt-4 flex gap-2 justify-center">
            <MediaGallery.Thumbnail 
              as="div" 
              className="w-3 h-3 rounded-full border-2 transition-all data-[selected]:bg-brand-primary data-[selected]:border-brand-primary cursor-pointer" 
            />
          </MediaGallery.Thumbnails>
        </Product.MediaGallery>

        <div className="space-y-8">
          {/* Enhanced Product Name */}
          <Product.Name asChild>
            {React.forwardRef(({name, ...props}, ref) => (
              <div ref={ref} {...props}>
                <Badge variant="outline" className="mb-2">Premium Collection</Badge>
                <h1 className="text-5xl font-bold text-content-primary leading-tight">
                  {name}
                </h1>
              </div>
            ))}
          </Product.Name>

          {/* Custom Price Display with Savings */}
          <div className="p-4 bg-surface-card rounded-lg border border-brand-subtle">
            <div className="flex items-center gap-4">
              <Product.Price asChild>
                {React.forwardRef(({formattedPrice, ...props}, ref) => (
                  <span 
                    ref={ref} 
                    {...props} 
                    className="text-4xl font-bold text-brand-primary data-[discounted]:text-status-success"
                  >
                    {formattedPrice}
                  </span>
                ))}
              </Product.Price>
              
              <Product.CompareAtPrice asChild>
                {React.forwardRef(({formattedPrice, ...props}, ref) => (
                  <div ref={ref} {...props} className="hidden data-[discounted]:flex flex-col items-start">
                    <span className="text-lg text-content-muted line-through">
                      {formattedPrice}
                    </span>
                    <Badge variant="destructive" className="text-xs">SALE</Badge>
                  </div>
                ))}
              </Product.CompareAtPrice>
            </div>
          </div>

          {/* Rich Product Description */}
          <Product.Description asChild>
            {React.forwardRef(({description, ...props}, ref) => (
              <div ref={ref} {...props} className="space-y-3">
                <h3 className="text-xl font-semibold text-content-primary">About this product</h3>
                <div 
                  className="prose prose-sm max-w-none text-content-secondary"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            ))}
          </Product.Description>

          {/* Enhanced Variants with Labels */}
          <Product.Variants>
            <Product.VariantOptions>
              <Product.VariantOptionRepeter>
                  <Option.Name asChild>
                    {React.forwardRef(({option, ...props}, ref) => (
                      <div ref={ref} {...props} className="mb-4">
                        <h4 className="text-lg font-semibold text-content-primary">
                          Choose {option.name}
                        </h4>
                        <p className="text-sm text-content-muted">Select your preferred {option.name.toLowerCase()}</p>
                      </div>
                    ))}
                  </Option.Name>
                  
                  <Option.Choices>
                    <div className="grid grid-cols-4 gap-3">
                      <Option.ChoiceRepeter>
                        <Choice.Color asChild>
                          {React.forwardRef(({colorCode, name, id, ...props}, ref) => (
                            <div className="text-center">
                              <button
                                ref={ref}
                                {...props}
                                style={{ backgroundColor: colorCode }}
                                className="w-12 h-12 rounded-full border-4 transition-all data-[selected]:border-brand-primary data-[selected]:scale-110 data-[selected]:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={name}
                                data-testid="product-modifier-choice-button"
                              />
                              <span className="text-xs text-content-secondary mt-1 block">{name}</span>
                            </div>
                          ))}
                        </Choice.Color>
                        <Choice.Text asChild>
                          {React.forwardRef(({name, ...props}, ref) => (
                            <Button
                              ref={ref}
                              {...props}
                              variant="outline"
                              className="data-[selected]:bg-brand-primary data-[selected]:text-white data-[selected]:border-brand-primary"
                            >
                              {name}
                            </Button>
                          ))}
                        </Choice.Text>
                      </Option.ChoiceRepeter>
                    </div>
                  </Option.Choices>
              </Product.VariantOptionRepeter>
            </Product.VariantOptions>
          </Product.Variants>
          
          {/* Enhanced Modifiers */}
          <Product.Modifiers>
            <Product.ModifierOptions>
              <Product.ModifierOptionRepeter allowedTypes={['color', 'text', 'free-text']}>
                  <Option.Name asChild>
                    {React.forwardRef(({option, ...props}, ref) => (
                      <div ref={ref} {...props} className="mb-4">
                        <h4 className="text-lg font-semibold text-content-primary">
                          {option.name}
                        </h4>
                        <p className="text-sm text-content-muted">Customize your {option.name.toLowerCase()}</p>
                      </div>
                    ))}
                  </Option.Name>
                  
                  <Option.Choices>
                    <Option.ChoiceRepeter>
                      <Choice.FreeText asChild>
                        {React.forwardRef(({minCharCount, maxCharCount, title, ...props}, ref) => (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-content-primary">{title}</label>
                            <textarea
                              ref={ref}
                              {...props}
                              className="w-full p-3 border border-brand-light rounded-lg resize-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                              rows={3}
                              placeholder={`Enter your custom text (${minCharCount}-${maxCharCount} characters)`}
                            />
                          </div>
                        ))}
                      </Choice.FreeText>
                      <Choice.Text asChild>
                        {React.forwardRef(({name, addedPrice, ...props}, ref) => (
                          <Button
                            ref={ref}
                            {...props}
                            variant="outline"
                            className="flex justify-between items-center data-[selected]:bg-brand-primary data-[selected]:text-white data-[selected]:border-brand-primary"
                          >
                            <span>{name}</span>
                            {addedPrice && <span className="text-xs">{addedPrice}</span>}
                          </Button>
                        ))}
                      </Choice.Text>
                      <Choice.Color asChild>
                        {React.forwardRef(({colorCode, name, addedPrice, ...props}, ref) => (
                          <div className="text-center">
                            <button
                              ref={ref}
                              {...props}
                              style={{ backgroundColor: colorCode }}
                              className="w-12 h-12 rounded-full border-4 transition-all data-[selected]:border-brand-primary data-[selected]:scale-110 data-[selected]:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={name}
                            />
                            <div className="mt-1">
                              <span className="text-xs text-content-secondary block">{name}</span>
                              {addedPrice && <span className="text-xs text-brand-primary">{addedPrice}</span>}
                            </div>
                          </div>
                        ))}
                      </Choice.Color>
                    </Option.ChoiceRepeter>
                  </Option.Choices>
              </Product.ModifierOptionRepeter>
            </Product.ModifierOptions>
          </Product.Modifiers>

          {/* Custom Quantity with Stock Info */}
          <Product.Quantity steps={1}>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-content-primary">Quantity</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-brand-light rounded-lg overflow-hidden">
                  <Quantity.Decrement asChild>
                    {React.forwardRef((props, ref) => (
                      <Button 
                        ref={ref}
                        {...props}
                        variant="ghost"
                        size="sm"
                        className="px-4 py-3 rounded-none border-r border-brand-light hover:bg-brand-light/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    ))}
                  </Quantity.Decrement>
                  
                  <Quantity.Input 
                    className="w-20 text-center py-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  />
                  
                  <Quantity.Increment asChild>
                    {React.forwardRef((props, ref) => (
                      <Button 
                        ref={ref}
                        {...props}
                        variant="ghost"
                        size="sm"
                        className="px-4 py-3 rounded-none border-l border-brand-light hover:bg-brand-light/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ))}
                  </Quantity.Increment>
                </div>
                <span className="text-sm text-content-muted">12 in stock</span>
              </div>
            </div>
          </Product.Quantity>

          {/* Enhanced Subscriptions */}
          <Product.Subscriptions emptyState={<div className="text-center py-8 text-content-muted">No subscription options available for this product</div>}>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-content-primary">Subscription Options</h4>
              <Product.SubscriptionRepeter>
                <div className="p-4 border-2 border-brand-light rounded-lg hover:border-brand-primary transition-colors cursor-pointer data-[selected]:border-brand-primary data-[selected]:bg-brand-light/5">
                  <Subscription.Title asChild>
                    {React.forwardRef(({subscription, ...props}, ref) => (
                      <div ref={ref} {...props} className="flex justify-between items-center">
                        <div>
                          <h5 className="font-semibold text-content-primary">{subscription.title}</h5>
                          <p className="text-sm text-content-secondary">{subscription.description}</p>
                        </div>
                        <Badge variant="secondary">Save {subscription.discount}%</Badge>
                      </div>
                    ))}
                  </Subscription.Title>
                </div>
              </Product.SubscriptionRepeter>
            </div>
          </Product.Subscriptions>

          {/* Enhanced Action Buttons */}
          <div className="space-y-3">
            <Product.Action.AddToCart asChild>
              <Button size="lg" className="w-full text-lg py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </Product.Action.AddToCart>
            
            <Product.Action.BuyNow asChild>
              <Button variant="outline" size="lg" className="w-full text-lg py-4">
                <Zap className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </Product.Action.BuyNow>
          </div>

          {/* Enhanced Product Info Sections with Accordion */}
          <Product.InfoSections>
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-content-primary">Detailed Information</h4>
              <Accordion type="multiple" className="w-full">
                <Product.InfoSectionRepeter>
                  <Accordion.Item value="info-section" className="border-b">
                    <Accordion.Trigger className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
                      <InfoSection.Title className="text-left font-medium text-content-primary" />
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </Accordion.Trigger>
                    <Accordion.Content className="pb-4 pt-0">
                      <InfoSection.Content asChild>
                        {React.forwardRef(({content, ...props}, ref) => (
                          <div 
                            ref={ref} 
                            {...props} 
                            className="prose prose-sm max-w-none text-content-secondary"
                            dangerouslySetInnerHTML={{ __html: content }}
                          />
                        ))}
                      </InfoSection.Content>
                    </Accordion.Content>
                  </Accordion.Item>
                </Product.InfoSectionRepeter>
              </Accordion>
            </div>
          </Product.InfoSections>

          {/* Custom Social Sharing */}
          <div className="border-t border-brand-subtle pt-6">
            <h4 className="text-lg font-semibold text-content-primary mb-3">Share this product</h4>
            <div className="flex gap-3">
              <Product.Url asChild>
                <Button variant="outline" size="sm" className="social-btn facebook">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
              </Product.Url>
              <Product.Url asChild>
                <Button variant="outline" size="sm" className="social-btn twitter">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              </Product.Url>
              <Product.Url>
                {React.forwardRef(({url, ...props}, ref) => (
                  <Button 
                    ref={ref} 
                    {...props}
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(url)}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                ))}
              </Product.Url>
            </div>
          </div>
        </div>
      </div>
    </Product.Root>
  );
}
```

### Minimal Example (Essential Components Only)
```tsx
function MinimalProduct() {
  const product = useProduct();

  return (
    <Product.Root product={product}>
      <div className="max-w-md mx-auto space-y-4 p-6 border rounded-lg">
        <Product.MediaGallery>
          <MediaGallery.Viewport className="aspect-square rounded-lg" />
          <MediaGallery.Thumbnails>
            <MediaGallery.ThumbnailRepeter>
              <MediaGallery.Thumbnail as="div" className="w-2 h-2 rounded-full cursor-pointer" />
            </MediaGallery.ThumbnailRepeter>
          </MediaGallery.Thumbnails>
        </Product.MediaGallery>
        
        <Product.Name className="text-2xl font-bold text-content-primary" />
        <Product.Price className="text-xl font-semibold text-brand-primary" />
        
        {/* Basic Variants */}
        <Product.Variants>
          <Product.VariantOptions>
            <Product.VariantOptionRepeter>
              <Option.Name className="font-medium mb-2" />
              <Option.Choices>
                <Option.ChoiceRepeter>
                  <Choice.Text className="px-3 py-1 border rounded text-sm" />
                  <Choice.Color className="w-8 h-8 rounded-full border-2" />
                </Option.ChoiceRepeter>
              </Option.Choices>
            </Product.VariantOptionRepeter>
          </Product.VariantOptions>
        </Product.Variants>
        
        <Product.Quantity steps={1}>
          <div className="flex items-center border rounded">
            <Quantity.Decrement className="px-3 py-2" />
            <Quantity.Input className="w-16 text-center border-x" />
            <Quantity.Increment className="px-3 py-2" />
          </div>
        </Product.Quantity>
        
        {/* Simple Subscriptions */}
        <Product.Subscriptions>
          <Product.SubscriptionRepeter>
            <div className="p-2 border rounded text-sm">
              <Subscription.Title className="font-medium" />
            </div>
          </Product.SubscriptionRepeter>
        </Product.Subscriptions>
        
        <Product.Action.AddToCart label="Add to Cart" className="w-full btn-primary" />
        
        {/* Basic Info Sections */}
        <Product.InfoSections>
          <Product.InfoSectionRepeter>
            <details className="border rounded p-2">
              <summary className="cursor-pointer font-medium">
                <InfoSection.Title />
              </summary>
              <InfoSection.Content className="mt-2 text-sm text-content-secondary" />
            </details>
          </Product.InfoSectionRepeter>
        </Product.InfoSections>
      </div>
    </Product.Root>
  );
}
```