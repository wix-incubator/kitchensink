# Cart Interface Documentation

A comprehensive cart display and management component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Cart component follows a compound component pattern where each part can be composed together to create flexible cart displays and interactions.

## Components

### Cart.Root

The root container that provides cart context to all child components.

**Props**
```tsx
interface CartRootProps {
  cart: CartData;
  children: React.ReactNode;
}
```

**Example**
```tsx
<Cart.Root cart={cart}>
  {/* All cart components */}
</Cart.Root>
```

---

### Cart.LineItems

Container for cart line items list.
Does not render when cart is empty.

**Props**
```tsx
interface CartLineItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}
```

**Data Attributes**
- `data-testid="cart-line-items"` - Applied to line items container

**Example**
```tsx
<Cart.LineItems emptyState={<p>Your cart is empty</p>}>
  <Cart.LineItemRepeater />
</Cart.LineItems>
```

---

### Cart.LineItemRepeater

Renders a list of line items. (list of `<LineItem.Root />`)

**Props**
```tsx
interface CartLineItemRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<Cart.LineItemRepeater>
  <LineItem.Image />
  <LineItem.Title />
  <LineItem.SelectedOptions />
</Cart.LineItemRepeater>
```

**Data Attributes**
- `data-testid="cart-line-item"` - Applied to each line item container

---

### LineItem.Title

Displays the line item product name.

**Props**
```tsx
interface LineItemTitleProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    title: string;
  }>;
}
```

**Data Attributes**
- `data-testid="line-item-title"` - Applied to title element

**Example**
```tsx
// Default usage
<LineItem.Title className="text-lg font-semibold text-content-primary" />

// Custom rendering with forwardRef
<LineItem.Title asChild>
  {React.forwardRef(({title, ...props}, ref) => (
    <h3 ref={ref} {...props} className="text-lg font-semibold text-content-primary">
      {title}
    </h3>
  ))}
</LineItem.Title>
```

---

### LineItem.Image

Displays the line item product image.

**Props**
```tsx
interface LineItemImageProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLImageElement, {
    src: string;
    alt: string;
  }>;
}
```

**Data Attributes**
- `data-testid="line-item-image"` - Applied to image element

**Example**
```tsx
// Default usage
<LineItem.Image className="w-16 h-16 rounded-lg object-cover" />

// Custom rendering with forwardRef
<LineItem.Image asChild>
  {React.forwardRef(({src, alt, ...props}, ref) => (
    <img 
      ref={ref} 
      {...props} 
      src={src} 
      alt={alt}
      className="w-16 h-16 rounded-lg object-cover"
    />
  ))}
</LineItem.Image>
```

---

### LineItem.SelectedOptions

Container for selected options display.
Does not render when there are no selected options.

**Props**
```tsx
interface LineItemSelectedOptionsProps {
  children: React.ReactNode;
}
```

**Data Attributes**
- `data-testid="line-item-selected-options"` - Applied to selected options container

**Example**
```tsx
<LineItem.SelectedOptions>
  <LineItem.SelectedOptionRepeater />
</LineItem.SelectedOptions>
```

---

### LineItem.SelectedOptionRepeater

Renders a list of selected options. (list of `<SelectedOption.Root />`)

**Props**
```tsx
interface LineItemSelectedOptionRepeaterProps {
  children: React.ReactNode;
}
```

**Example**
```tsx
<LineItem.SelectedOptionRepeater>
  <SelectedOption.Text />
  <SelectedOption.Color />
</LineItem.SelectedOptionRepeater>
```

**Data Attributes**
- `data-testid="selected-option"` - Applied to each selected option container

---

### SelectedOption.Text

Displays text-based selected option.

**Props**
```tsx
interface SelectedOptionTextProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    name: string;
    value: string;
  }>;
}
```

**Data Attributes**
- `data-testid="selected-option-text"` - Applied to text option element

**Example**
```tsx
// Default usage
<SelectedOption.Text className="text-sm text-content-secondary" />

// Custom rendering with forwardRef
<SelectedOption.Text asChild>
  {React.forwardRef(({name, value, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm text-content-secondary">
      {name}: {value}
    </span>
  ))}
</SelectedOption.Text>
```

---

### SelectedOption.Color

Displays color-based selected option.

**Props**
```tsx
interface SelectedOptionColorProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    name: string;
    colorCode: string;
  }>;
}
```

**Data Attributes**
- `data-testid="selected-option-color"` - Applied to color option element

**Example**
```tsx
// Default usage
<SelectedOption.Color className="flex items-center gap-2 text-sm text-content-secondary" />

// Custom rendering with forwardRef
<SelectedOption.Color asChild>
  {React.forwardRef(({name, colorCode, ...props}, ref) => (
    <div ref={ref} {...props} className="flex items-center gap-2 text-sm text-content-secondary">
      <div 
        className="w-4 h-4 rounded-full border"
        style={{ backgroundColor: colorCode }}
      />
      <span>{name}</span>
    </div>
  ))}
</SelectedOption.Color>
```

---

### Cart.Summary

Container for cart summary information including totals, taxes, and discounts.

**Props**
```tsx
interface CartSummaryProps {
  children: React.ReactNode;
  asChild?: boolean;
}
```

**Data Attributes**
- `data-testid="cart-summary"` - Applied to summary container

**Example**
```tsx
<Cart.Summary className="border-t pt-4 space-y-2">
  <Cart.Totals.Price label="Total" />
  <Cart.Totals.Tax label="Tax" />
  <Cart.Totals.Discount label="Discount" />
</Cart.Summary>
```


Each section for the price renders if relevant, it also renders a loader in case the cart is updating.
The implementation of price part should be available using shadcn/ui components.

---

### Cart.Coupon.Input

Coupon code input field.

**Props**
```tsx
interface CartCouponInputProps {
  asChild?: boolean;
  placeholder?: string;
  children?: React.ForwardRefRenderFunction<HTMLInputElement, {
    value: string;
    onChange: (value: string) => void;
  }>;
}
```

**Data Attributes**
- `data-testid="coupon-input"` - Applied to input element

**Example**
```tsx
// Default usage
<Cart.Coupon.Input placeholder="Enter coupon code" className="px-3 py-2 border rounded-lg" />

// Custom rendering with forwardRef
<Cart.Coupon.Input asChild>
  {React.forwardRef(({value, onChange, ...props}, ref) => (
    <input
      ref={ref}
      {...props}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
    />
  ))}
</Cart.Coupon.Input>
```

---

### Cart.Coupon.Trigger

Apply coupon button.

**Props**
```tsx
interface CartCouponTriggerProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
}
```

**Data Attributes**
- `data-testid="coupon-trigger"` - Applied to trigger button
- `disabled` - Is button disabled
- `data-loading` - Is coupon application in progress

**Example**
```tsx
// Default usage
<Cart.Coupon.Trigger className="btn-primary px-4 py-2">Apply</Cart.Coupon.Trigger>

// Custom rendering with forwardRef
<Cart.Coupon.Trigger asChild>
  {React.forwardRef(({disabled, isLoading, onClick, ...props}, ref) => (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      onClick={onClick}
      className="btn-primary px-4 py-2 disabled:opacity-50"
    >
      {isLoading ? 'Applying...' : 'Apply'}
    </button>
  ))}
</Cart.Coupon.Trigger>
```

---

### Cart.Coupon.Clear

Remove applied coupon button.

**Props**
```tsx
interface CartCouponClearProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    onClick: () => Promise<void>;
  }>;
}
```

**Data Attributes**
- `data-testid="coupon-clear"` - Applied to clear button

**Example**
```tsx
// Default usage
<Cart.Coupon.Clear className="text-sm text-content-muted hover:text-content-primary">Remove</Cart.Coupon.Clear>

// Custom rendering with forwardRef
<Cart.Coupon.Clear asChild>
  {React.forwardRef(({onClick, ...props}, ref) => (
    <button
      ref={ref}
      {...props}
      onClick={onClick}
      className="text-sm text-content-muted hover:text-content-primary underline"
    >
      Remove coupon
    </button>
  ))}
</Cart.Coupon.Clear>
```

---

### Cart.Note.Input

Order notes input field for customers to add special instructions or comments.

**Props**
```tsx
interface CartNoteInputProps {
  asChild?: boolean;
  placeholder?: string;
  maxLength?: number; // default - 500 - maximum character limit
  children?: React.ForwardRefRenderFunction<HTMLTextAreaElement, {
    value: string;
    onChange: (value: string) => void;
  }>;
}
```

**Data Attributes**
- `data-testid="cart-note-input"` - Applied to note input element

**Example**
```tsx
// Default usage
<>
<label className="text-sm font-medium text-content-primary">
  Order Notes (Optional)
</label>
<Cart.Note.Input
  placeholder="Add special instructions for your order..." 
  className="w-full p-3 border border-brand-light rounded-lg resize-none focus:ring-2 focus:ring-brand-primary" 
  maxLength={500}
/>
</>

// Custom rendering with forwardRef
<Cart.Note.Input asChild>
  {React.forwardRef(({value, onChange, ...props}, ref) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-content-primary">
        Order Notes (Optional)
      </label>
      <textarea
        ref={ref}
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-brand-light rounded-lg resize-none focus:ring-2 focus:ring-brand-primary"
        placeholder="Add any special instructions, delivery notes, or comments..."
        rows={3}
        maxLength={500}
      />
      <div className="flex justify-between text-xs text-content-muted">
        <span>Optional: Add special instructions for your order</span>
        <span>{value?.length || 0}/500</span>
      </div>
    </div>
  ))}
</Cart.Note.Input>
```

---

### Cart.Errors

Displays cart-related errors.

**Props**
```tsx
interface CartErrorsProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    errors: string[];
  }>;
}
```

**Data Attributes**
- `data-testid="cart-errors"` - Applied to errors container

**Example**
```tsx
// Default usage
<Cart.Errors className="text-status-danger text-sm space-y-1" />

// Custom rendering with forwardRef
<Cart.Errors asChild>
  {React.forwardRef(({errors, ...props}, ref) => (
    <div ref={ref} {...props} className="text-status-danger text-sm space-y-1">
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  ))}
</Cart.Errors>
```

---

### Cart.Totals.Price/Cart.Totals.Tax/Cart.Totals.Discount

Displays the cart total price.

**Props**
```tsx
interface CartPriceProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    price: Money;
    formattedPrice: string;
  }>;
  label?: string;
}
```

**Data Attributes**
- `data-testid="cart-price"` - Applied to price element

**Example**
```tsx
// Default usage
<Cart.Totals.Price className="text-xl font-bold text-content-primary" label="Total" />

// Custom rendering with forwardRef
<Cart.Totals.Price asChild>
  {React.forwardRef(({formattedPrice, label, ...props}, ref) => (
    <div ref={ref} {...props} className="flex justify-between items-center">
      <span className="text-lg font-semibold">{label}:</span>
      <span className="text-xl font-bold text-content-primary">{formattedPrice}</span>
    </div>
  ))}
</Cart.Totals.Price>
```

---

### LineItem.Quantity

Container for line item quantity selection controls.

**Props**
```tsx
interface LineItemQuantityProps {
  children: React.ReactNode;
  steps?: number; // default - 1 - how much to increment/decrement 
}
```

**Example**
```tsx
<LineItem.Quantity steps={1}>
  <Quantity.Decrement />
  <Quantity.Input />
  <Quantity.Increment />
  <Quantity.Reset />
</LineItem.Quantity>
```

**Data Attributes**
- `data-testid="line-item-quantity"` - Applied to quantity container

See [Quantity.Root](./PLATFORM_INTERFACE.md#quantityroot) for more details.

---

### Commerce.Actions.AddToCart/Commerce.Actions.BuyNow

Add to cart and buy now action buttons.

**Props**
```tsx
interface CartActionsProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
  lineItems: Array<{
    catalogReference: {
      catalogItemId: string;
      appId: string;
      options: any;
    };
    quantity: number;
  }>;
}
```

**Example**
```tsx
// Default usage
<Commerce.Actions.AddToCart label="add to cart" className="w-full btn-primary" />

// Custom rendering with forwardRef
<Commerce.Actions.BuyNow asChild label="Buy Now">
  <button/>
</Commerce.Actions.BuyNow>
```

**Important**
The implementation of these buttons should be done by rendering Commerce.Actions.AddToCart and Commerce.Actions.BuyNow which are ecommerce headless components.

**Data Attributes**
- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

### Commerce.Actions.Checkout

Checkout action button.

**Props**
```tsx
interface CartActionsCheckoutProps {
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
<Commerce.Actions.Checkout label="Checkout" className="w-full btn-primary" />

// Custom rendering with forwardRef
<Commerce.Actions.Checkout asChild label="Checkout">
  <button/>
</Commerce.Actions.Checkout>

<Commerce.Actions.Checkout asChild label="Checkout">
  {React.forwardRef(({disabled, isLoading, onClick, ...props}, ref) => (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      onClick={onClick}
      className="w-full btn-primary"
    >
      {isLoading ? 'Checking out...' : 'Checkout'}
    </button>
  ))}
</Commerce.Actions.Checkout>
```

**Data Attributes**
- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

## Usage Examples

### Basic Cart Display
```tsx
function BasicCart() {
  const cart = useCart();

  return (
    <Cart.Root cart={cart}>
      <div className="max-w-2xl mx-auto space-y-6 p-6">
        {/* Cart Line Items */}
        <Cart.LineItems emptyState={
          <div className="text-center py-12 text-content-muted">
            <p className="text-lg">Your cart is empty</p>
            <p className="text-sm">Add some products to get started!</p>
          </div>
        }>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-content-primary">Shopping Cart</h2>
            <Cart.LineItemRepeater>
              <div className="flex gap-4 p-4 border border-brand-light rounded-lg">
                <LineItem.Image className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 space-y-2">
                  <LineItem.Title className="text-lg font-semibold text-content-primary" />
                  <LineItem.SelectedOptions>
                    <div className="flex flex-wrap gap-2">
                      <LineItem.SelectedOptionRepeater>
                        <SelectedOption.Text className="text-sm text-content-secondary" />
                        <SelectedOption.Color className="flex items-center gap-2 text-sm text-content-secondary" />
                      </LineItem.SelectedOptionRepeater>
                    </div>
                  </LineItem.SelectedOptions>
                  
                  {/* Quantity Controls */}
                  <LineItem.Quantity steps={1}>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-content-secondary">Qty:</span>
                      <div className="flex items-center border border-brand-light rounded-lg">
                        <Quantity.Decrement className="px-3 py-1 hover:bg-surface-primary transition-colors" />
                        <Quantity.Input className="w-16 text-center py-1 border-x border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                        <Quantity.Increment className="px-3 py-1 hover:bg-surface-primary transition-colors" />
                      </div>
                      <Quantity.Reset className="px-2 py-1 text-xs text-status-danger hover:text-status-danger/80 hover:bg-status-danger/10 rounded transition-colors">
                        Remove
                      </Quantity.Reset>
                    </div>
                  </LineItem.Quantity>
                </div>
              </div>
            </Cart.LineItemRepeater>
          </div>
        </Cart.LineItems>

        {/* Coupon Section */}
        <div className="border border-brand-light rounded-lg p-4">
          <h3 className="text-lg font-semibold text-content-primary mb-3">Coupon Code</h3>
          <div className="flex gap-2">
            <Cart.Coupon.Input 
              placeholder="Enter coupon code" 
              className="flex-1 px-3 py-2 border border-brand-light rounded-lg focus:ring-2 focus:ring-brand-primary" 
            />
            <Cart.Coupon.Trigger className="btn-primary px-4 py-2">
              Apply
            </Cart.Coupon.Trigger>
          </div>
          <Cart.Coupon.Clear className="text-sm text-content-muted hover:text-content-primary mt-2 inline-block">
            Remove applied coupon
          </Cart.Coupon.Clear>
        </div>

        {/* Order Notes */}
        <div className="border border-brand-light rounded-lg p-4">
          <h3 className="text-lg font-semibold text-content-primary mb-3">Order Notes</h3>
          <Cart.Note.Input 
            placeholder="Add special instructions for your order..." 
            className="w-full p-3 border border-brand-light rounded-lg resize-none focus:ring-2 focus:ring-brand-primary" 
            maxLength={500}
          />
          <p className="text-xs text-content-muted mt-2">
            Optional: Add delivery instructions, special requests, or comments about your order
          </p>
        </div>

        {/* Cart Errors */}
        <Cart.Errors className="text-status-danger text-sm space-y-1" />

        {/* Cart Summary */}
        <Cart.Summary className="border border-brand-light rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-content-primary">Order Summary</h3>
          <div className="space-y-2">
            <Cart.Totals.Tax className="flex justify-between text-sm text-content-secondary" label="Tax" />
            <Cart.Totals.Discount className="flex justify-between text-sm text-status-success" label="Discount" />
            <div className="border-t border-brand-light pt-2">
              <Cart.Totals.Price className="flex justify-between text-xl font-bold text-content-primary" label="Total" />
            </div>
          </div>
        </Cart.Summary>

        {/* Checkout Actions */}
        <div className="space-y-3">
          <Commerce.Actions.Checkout label="Checkout" className="w-full btn-primary" />
        </div>
      </div>
    </Cart.Root>
  );
}
```

### Advanced Cart with Custom Components
```tsx
function AdvancedCart() {
  const cart = useCart();

  return (
    <Cart.Root cart={cart}>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
        {/* Cart Items - 2/3 width */}
        <div className="lg:col-span-2">
          <Cart.LineItems emptyState={
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 mx-auto text-content-muted mb-4" />
              <h3 className="text-xl font-semibold text-content-primary mb-2">Your cart is empty</h3>
              <p className="text-content-muted mb-6">Looks like you haven't added any items yet.</p>
              <Button asChild>
                <Link href="/store">Continue Shopping</Link>
              </Button>
            </div>
          }>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-content-primary">Shopping Cart</h1>
                <Badge variant="secondary">{cart?.lineItems?.length || 0} items</Badge>
              </div>
              
              <Cart.LineItemRepeater>
                <Card className="p-6">
                  <div className="flex gap-6">
                    <LineItem.Image asChild>
                      {React.forwardRef(({src, alt, ...props}, ref) => (
                        <div className="relative">
                          <img 
                            ref={ref}
                            {...props}
                            src={src}
                            alt={alt}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <Badge className="absolute -top-2 -right-2 text-xs">
                            {lineItem.quantity}
                          </Badge>
                        </div>
                      ))}
                    </LineItem.Image>
                    
                    <div className="flex-1 space-y-3">
                      <LineItem.Title asChild>
                        {React.forwardRef(({title, ...props}, ref) => (
                          <div ref={ref} {...props}>
                            <h3 className="text-xl font-semibold text-content-primary">{title}</h3>
                            <p className="text-sm text-content-muted">SKU: {lineItem.sku}</p>
                          </div>
                        ))}
                      </LineItem.Title>
                      
                      <LineItem.SelectedOptions>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-content-primary">Selected Options:</h4>
                          <div className="flex flex-wrap gap-3">
                            <LineItem.SelectedOptionRepeater>
                              <SelectedOption.Text asChild>
                                {React.forwardRef(({name, value, ...props}, ref) => (
                                  <Badge ref={ref} {...props} variant="outline" className="text-xs">
                                    {name}: {value}
                                  </Badge>
                                ))}
                              </SelectedOption.Text>
                              
                              <SelectedOption.Color asChild>
                                {React.forwardRef(({name, colorCode, ...props}, ref) => (
                                  <div ref={ref} {...props} className="flex items-center gap-2">
                                    <div 
                                      className="w-5 h-5 rounded-full border-2 border-brand-light"
                                      style={{ backgroundColor: colorCode }}
                                    />
                                    <Badge variant="outline" className="text-xs">{name}</Badge>
                                  </div>
                                ))}
                              </SelectedOption.Color>
                            </LineItem.SelectedOptionRepeater>
                          </div>
                        </div>
                      </LineItem.SelectedOptions>
                      
                      {/* Enhanced Quantity Controls */}
                      <LineItem.Quantity steps={1}>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-content-primary">Quantity</h4>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border-2 border-brand-light rounded-lg overflow-hidden">
                              <Quantity.Decrement asChild>
                                {React.forwardRef((props, ref) => (
                                  <Button 
                                    ref={ref}
                                    {...props}
                                    variant="ghost"
                                    size="sm"
                                    className="px-3 py-2 rounded-none border-r border-brand-light hover:bg-brand-light/10"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                ))}
                              </Quantity.Decrement>
                              
                              <Quantity.Input asChild>
                                {React.forwardRef(({value, onChange, ...props}, ref) => (
                                  <Input
                                    ref={ref}
                                    {...props}
                                    type="number"
                                    value={value}
                                    onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                    className="w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    min="1"
                                  />
                                ))}
                              </Quantity.Input>
                              
                              <Quantity.Increment asChild>
                                {React.forwardRef((props, ref) => (
                                  <Button 
                                    ref={ref}
                                    {...props}
                                    variant="ghost"
                                    size="sm"
                                    className="px-3 py-2 rounded-none border-l border-brand-light hover:bg-brand-light/10"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                ))}
                              </Quantity.Increment>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-content-muted">
                                {lineItem.inStock ? `${lineItem.stockQuantity} in stock` : 'Out of stock'}
                              </span>
                              <Quantity.Reset asChild>
                                {React.forwardRef((props, ref) => (
                                  <Button
                                    ref={ref}
                                    {...props}
                                    variant="ghost"
                                    size="sm"
                                    className="text-status-danger hover:text-status-danger/80 hover:bg-status-danger/10 px-2 py-1 h-auto"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Remove Item
                                  </Button>
                                ))}
                              </Quantity.Reset>
                            </div>
                          </div>
                        </div>
                      </LineItem.Quantity>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-brand-subtle">
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Save for later
                          </Button>
                          <Button variant="ghost" size="sm" className="text-status-danger">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-content-primary">
                            {lineItem.formattedPrice}
                          </p>
                          {lineItem.compareAtPrice && (
                            <p className="text-sm text-content-muted line-through">
                              {lineItem.formattedCompareAtPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Cart.LineItemRepeater>
            </div>
          </Cart.LineItems>
        </div>

        {/* Cart Summary Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Coupon Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-content-primary mb-4">Promo Code</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Cart.Coupon.Input asChild>
                  {React.forwardRef(({value, onChange, ...props}, ref) => (
                    <Input
                      ref={ref}
                      {...props}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1"
                    />
                  ))}
                </Cart.Coupon.Input>
                
                <Cart.Coupon.Trigger asChild>
                  {React.forwardRef(({disabled, isLoading, onClick, ...props}, ref) => (
                    <Button
                      ref={ref}
                      {...props}
                      disabled={disabled}
                      onClick={onClick}
                      variant="outline"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  ))}
                </Cart.Coupon.Trigger>
              </div>
              
              <Cart.Coupon.Clear asChild>
                {React.forwardRef(({onClick, ...props}, ref) => (
                  <Button
                    ref={ref}
                    {...props}
                    variant="ghost"
                    size="sm"
                    onClick={onClick}
                    className="text-status-danger hover:text-status-danger/80 p-0 h-auto"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove coupon
                  </Button>
                ))}
              </Cart.Coupon.Clear>
            </div>
          </Card>

          {/* Order Notes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-content-primary mb-4">Order Notes</h3>
            <Cart.Note.Input asChild>
              {React.forwardRef(({value, onChange, ...props}, ref) => (
                <div className="space-y-3">
                  <Textarea
                    ref={ref}
                    {...props}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Add any special instructions, delivery notes, or comments about your order..."
                    className="min-h-[80px] resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center text-xs text-content-muted">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" />
                      <span>Optional: Special instructions for your order</span>
                    </div>
                    <span className="font-mono">{value?.length || 0}/500</span>
                  </div>
                </div>
              ))}
            </Cart.Note.Input>
          </Card>

          {/* Cart Errors */}
          <Cart.Errors asChild>
            {React.forwardRef(({errors, ...props}, ref) => (
              <div ref={ref} {...props}>
                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Cart Issues</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </Cart.Errors>

          {/* Order Summary */}
          <Cart.Summary asChild>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-content-primary mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-content-secondary">
                  <span>Subtotal ({cart?.lineItems?.length || 0} items)</span>
                  <span>{cart?.formattedSubtotal}</span>
                </div>
                
                <Cart.Totals.Tax asChild>
                  {React.forwardRef(({formattedTax, ...props}, ref) => (
                    <div ref={ref} {...props} className="flex justify-between text-content-secondary">
                      <span>Estimated Tax</span>
                      <span>{formattedTax}</span>
                    </div>
                  ))}
                </Cart.Totals.Tax>
                
                <Cart.Totals.Discount asChild>
                  {React.forwardRef(({formattedDiscount, ...props}, ref) => (
                    <div ref={ref} {...props} className="flex justify-between text-status-success">
                      <span>Discount</span>
                      <span>-{formattedDiscount}</span>
                    </div>
                  ))}
                </Cart.Totals.Discount>
                
                <div className="flex justify-between text-content-secondary">
                  <span>Shipping</span>
                  <span className="text-status-success">FREE</span>
                </div>
                
                <Separator />
                
                <Cart.Totals.Price asChild>
                  {React.forwardRef(({formattedPrice, ...props}, ref) => (
                    <div ref={ref} {...props} className="flex justify-between text-xl font-bold text-content-primary">
                      <span>Total</span>
                      <span>{formattedPrice}</span>
                    </div>
                  ))}
                </Cart.Totals.Price>
              </div>
              
              <div className="mt-6 space-y-3">
                <Commerce.Actions.Checkout label="Checkout" className="w-full btn-primary" />
                
                <Button variant="outline" size="lg" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </div>
            </Card>
          </Cart.Summary>
        </div>
      </div>
    </Cart.Root>
  );
}
```