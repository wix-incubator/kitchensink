import React from 'react';
import { cn } from '@/lib/utils';
import {
  Product as ProductPrimitive,
  ProductModifiers as ProductModifiersPrimitive,
  SelectedVariant as SelectedVariantPrimitive,
  ProductVariantSelector as ProductVariantSelectorPrimitive,
} from '@wix/headless-stores/react';
import { CurrentCart } from '@wix/headless-ecom/react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const Product = ProductPrimitive.Root;

export const ProductName = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Name>
>((props, ref) => {
  return (
    <ProductPrimitive.Name
      {...props}
      ref={ref}
      className={cn(
        'text-4xl font-bold text-content-primary mb-4 font-theme-heading',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.Name>
  );
});

ProductName.displayName = 'ProductName';

export const ProductDescription = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Description>
>((props, ref) => {
  return (
    <ProductPrimitive.Description
      {...props}
      ref={ref}
      className={cn('text-content-secondary leading-relaxed', props.className)}
    >
      {props.children}
    </ProductPrimitive.Description>
  );
});

ProductDescription.displayName = 'ProductDescription';

export const ProductPrice = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Price>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Price>
>((props, ref) => {
  return (
    <ProductPrimitive.Price
      {...props}
      ref={ref}
      className={cn(
        'text-3xl font-bold text-content-primary data-[discounted]:text-status-success',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.Price>
  );
});

ProductPrice.displayName = 'ProductPrice';

export const ProductCompareAtPrice = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.CompareAtPrice>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.CompareAtPrice>
>((props, ref) => {
  return (
    <ProductPrimitive.CompareAtPrice
      {...props}
      ref={ref}
      className={cn(
        'text-lg text-content-muted line-through hidden data-[discounted]:inline',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.CompareAtPrice>
  );
});

ProductCompareAtPrice.displayName = 'ProductCompareAtPrice';

export const ProductSlug = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Slug>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Slug>
>((props, ref) => {
  return (
    <ProductPrimitive.Slug
      {...props}
      ref={ref}
      className={cn(
        'text-content-secondary font-mono text-sm',
        props.className
      )}
    >
      {props.children}
    </ProductPrimitive.Slug>
  );
});

ProductSlug.displayName = 'ProductSlug';

export const ProductRaw = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Raw>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Raw>
>((props, ref) => {
  return (
    <ProductPrimitive.Raw
      {...props}
      ref={ref}
      className={cn('block', props.className)}
    >
      {props.children}
    </ProductPrimitive.Raw>
  );
});

ProductRaw.displayName = 'ProductRaw';

export const ProductMediaGallery = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ProductMediaGallery>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ProductMediaGallery>
>((props, ref) => {
  return (
    <ProductPrimitive.ProductMediaGallery {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.ProductMediaGallery>
  );
});

ProductMediaGallery.displayName = 'ProductMediaGallery';

export const ProductVariants = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Variants>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Variants>
>((props, ref) => {
  return (
    <ProductPrimitive.Variants
      {...props}
      ref={ref}
      className={cn('space-y-4', props.className)}
    >
      {props.children}
    </ProductPrimitive.Variants>
  );
});

ProductVariants.displayName = 'ProductVariants';

export const ProductModifiers = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.Modifiers>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.Modifiers>
>((props, ref) => {
  return (
    <ProductPrimitive.Modifiers
      {...props}
      ref={ref}
      className={cn('space-y-4', props.className)}
    >
      {props.children}
    </ProductPrimitive.Modifiers>
  );
});

ProductModifiers.displayName = 'ProductModifiers';

export const ProductVariantOptions = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.VariantOptions>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.VariantOptions>
>((props, ref) => {
  return (
    <ProductPrimitive.VariantOptions {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.VariantOptions>
  );
});

ProductVariantOptions.displayName = 'ProductVariantOptions';

export const ProductVariantOptionRepeater =
  ProductPrimitive.VariantOptionRepeater;

ProductVariantOptionRepeater.displayName = 'ProductVariantOptionRepeater';

export const ProductModifierOptions = React.forwardRef<
  React.ElementRef<typeof ProductPrimitive.ModifierOptions>,
  React.ComponentPropsWithoutRef<typeof ProductPrimitive.ModifierOptions>
>((props, ref) => {
  return (
    <ProductPrimitive.ModifierOptions {...props} ref={ref}>
      {props.children}
    </ProductPrimitive.ModifierOptions>
  );
});

ProductModifierOptions.displayName = 'ProductModifierOptions';

export const ProductModifierOptionRepeater =
  ProductPrimitive.ModifierOptionRepeater;

ProductModifierOptionRepeater.displayName = 'ProductModifierOptionRepeater';

// New SelectedVariant Components with DOM structure and styling
export const SelectedVariantPrice = (
  props: React.ComponentPropsWithoutRef<typeof SelectedVariantPrimitive.Price>
) => (
  <SelectedVariantPrimitive.Price {...props}>
    {({ price, compareAtPrice }) => (
      <div className="space-y-1">
        <div className="text-2xl font-bold text-content-primary">{price}</div>
        {compareAtPrice &&
          parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) > 0 && (
            <div className="text-lg text-content-muted line-through">
              {compareAtPrice}
            </div>
          )}
      </div>
    )}
  </SelectedVariantPrimitive.Price>
);

export const SelectedVariantSKU = (
  props: React.ComponentPropsWithoutRef<typeof SelectedVariantPrimitive.SKU>
) => (
  <SelectedVariantPrimitive.SKU {...props}>
    {({ sku }) =>
      sku && <div className="text-base text-content-muted">SKU: {sku}</div>
    }
  </SelectedVariantPrimitive.SKU>
);

export const SelectedVariantDetails = (
  props: React.ComponentPropsWithoutRef<typeof SelectedVariantPrimitive.Details>
) => (
  <SelectedVariantPrimitive.Details {...props}>
    {({ sku, weight }) =>
      (sku || weight) && (
        <div className="text-sm text-content-secondary">
          {sku && <div>SKU: {sku}</div>}
          {weight && <div>Weight: {weight}</div>}
        </div>
      )
    }
  </SelectedVariantPrimitive.Details>
);

// New ProductVariantSelector Components with DOM structure and styling
export const ProductVariantSelectorOptions = (
  props: Omit<
    React.ComponentPropsWithoutRef<
      typeof ProductVariantSelectorPrimitive.Options
    >,
    'children'
  >
) => (
  <ProductVariantSelectorPrimitive.Options {...props}>
    {({ options, hasOptions }) =>
      hasOptions && (
        <div className="space-y-6" data-testid="product-options">
          <h3 className="text-lg font-semibold text-content-primary">
            Product Options
          </h3>
          {options.map(option => (
            <div key={option.name} data-testid="product-option">
              <ProductVariantSelectorPrimitive.Option option={option}>
                {({ name, choices, hasChoices }) => (
                  <>
                    <h3 className="text-lg font-semibold text-content-primary mb-3">
                      {name}
                    </h3>
                    {hasChoices && (
                      <div className="flex flex-wrap gap-3">
                        {choices.map((choice, choiceIndex) => {
                          // Check if this is a color option
                          const isColorOption = String(name)
                            .toLowerCase()
                            .includes('color');
                          const hasColorCode = choice.colorCode;

                          return (
                            <ProductVariantSelectorPrimitive.Choice
                              key={choiceIndex}
                              option={option}
                              choice={choice}
                            >
                              {({
                                value,
                                isSelected,
                                isVisible,
                                isInStock,
                                isPreOrderEnabled,
                                select,
                              }) => (
                                <>
                                  {isColorOption &&
                                  isVisible &&
                                  hasColorCode ? (
                                    // Color Swatch
                                    <div className="relative">
                                      <button
                                        data-testid="product-modifier-choice-button"
                                        onClick={select}
                                        title={value}
                                        className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                          isSelected
                                            ? 'border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30'
                                            : 'border-color-swatch hover:border-color-swatch-hover hover:scale-105'
                                        }`}
                                        style={{
                                          backgroundColor:
                                            choice.colorCode ||
                                            'var(--theme-text-content-40)',
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    isVisible && (
                                      // Regular Text Button
                                      <div className="relative">
                                        <button
                                          onClick={select}
                                          className={`px-3 py-1 text-sm border rounded-md ${
                                            isSelected
                                              ? 'bg-brand-primary text-brand-primary-text border-brand-primary'
                                              : 'bg-surface-card text-content-primary border-surface-primary hover:bg-surface-secondary'
                                          } ${!isInStock && !isPreOrderEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          disabled={
                                            !isInStock && !isPreOrderEnabled
                                          }
                                        >
                                          {String(value)}
                                        </button>
                                      </div>
                                    )
                                  )}
                                </>
                              )}
                            </ProductVariantSelectorPrimitive.Choice>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </ProductVariantSelectorPrimitive.Option>
            </div>
          ))}
        </div>
      )
    }
  </ProductVariantSelectorPrimitive.Options>
);

// Enhanced styled components for complex modifiers
export const ProductModifiersComplete = (
  props: Omit<
    React.ComponentPropsWithoutRef<typeof ProductModifiersPrimitive.Modifiers>,
    'children'
  >
) => (
  <ProductModifiersPrimitive.Modifiers {...props}>
    {({ modifiers, hasModifiers }) =>
      hasModifiers && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-content-primary">
            Product Modifiers
          </h3>
          {modifiers.map(modifier => (
            <ProductModifiersPrimitive.Modifier
              key={modifier.name}
              modifier={modifier}
            >
              {({ name, type, choices, hasChoices, mandatory }) => (
                <div className="space-y-3" data-testid="product-modifiers">
                  <h4 className="text-md font-medium text-content-primary">
                    {name}{' '}
                    {mandatory && <span className="text-status-error">*</span>}
                  </h4>

                  {type === 'SWATCH_CHOICES' && hasChoices && (
                    <div className="flex flex-wrap gap-2">
                      {choices.map((choice, choiceIndex) => (
                        <ProductModifiersPrimitive.Choice
                          key={choiceIndex}
                          modifier={modifier}
                          choice={choice}
                        >
                          {({ value, isSelected, colorCode, select }) => (
                            <button
                              data-testid="product-modifier-choice-button"
                              onClick={select}
                              className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                                isSelected
                                  ? 'border-brand-primary shadow-lg scale-110 ring-2 ring-brand-primary/30'
                                  : 'border-brand-light hover:border-brand-medium hover:scale-105'
                              }`}
                              style={{
                                backgroundColor:
                                  colorCode || 'var(--theme-text-content-40)',
                              }}
                              title={value}
                            />
                          )}
                        </ProductModifiersPrimitive.Choice>
                      ))}
                    </div>
                  )}

                  {type === 'TEXT_CHOICES' && hasChoices && (
                    <div className="flex flex-wrap gap-2">
                      {choices.map((choice, choiceIndex) => (
                        <ProductModifiersPrimitive.Choice
                          key={choiceIndex}
                          modifier={modifier}
                          choice={choice}
                        >
                          {({ value, isSelected, select }) => (
                            <Button
                              data-testid="product-modifier-choice-button"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={select}
                              className={
                                isSelected
                                  ? ''
                                  : `text-content-primary border-surface-subtle hover:bg-primary/10`
                              }
                            >
                              {String(value)}
                            </Button>
                          )}
                        </ProductModifiersPrimitive.Choice>
                      ))}
                    </div>
                  )}

                  {type === 'FREE_TEXT' && (
                    <>
                      {mandatory ? (
                        <ProductModifiersFreeText modifier={modifier} />
                      ) : (
                        <ProductModifiersPrimitive.ToggleFreeText
                          modifier={modifier}
                        >
                          {({ isTextInputShown, toggle }) => (
                            <div className="space-y-3">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isTextInputShown}
                                  onChange={toggle}
                                  className="w-4 h-4 text-brand-primary rounded border-brand-light focus:ring-brand-primary"
                                />
                                <span className="text-content-primary">
                                  Enable
                                </span>
                              </label>
                              {isTextInputShown && (
                                <ProductModifiersFreeText modifier={modifier} />
                              )}
                            </div>
                          )}
                        </ProductModifiersPrimitive.ToggleFreeText>
                      )}
                    </>
                  )}
                </div>
              )}
            </ProductModifiersPrimitive.Modifier>
          ))}
        </div>
      )
    }
  </ProductModifiersPrimitive.Modifiers>
);

export const ProductModifiersFreeText = ({ modifier }: { modifier: any }) => (
  <ProductModifiersPrimitive.FreeText modifier={modifier}>
    {({
      value,
      setText,
      placeholder: freeTextPlaceholder,
      charCount,
      isOverLimit,
      maxChars,
    }) => (
      <div className="space-y-2">
        <Textarea
          data-testid="product-modifier-free-text-input"
          value={value}
          onChange={e => setText(e.target.value)}
          placeholder={freeTextPlaceholder || 'Add special instructions...'}
          maxLength={maxChars}
          className="p-3 border-brand-light bg-surface-primary text-content-primary placeholder:text-content-subtle focus-visible:border-brand-medium resize-none min-h-[100px]"
          rows={3}
        />
        {maxChars && (
          <div
            className={`text-xs text-right ${
              isOverLimit ? 'text-status-error' : 'text-content-muted'
            }`}
          >
            {charCount}/{maxChars} characters
          </div>
        )}
      </div>
    )}
  </ProductModifiersPrimitive.FreeText>
);

// Enhanced quantity selector with stock logic
export const ProductQuantitySelectorWithStock = (
  props: Omit<
    React.ComponentPropsWithoutRef<
      typeof ProductVariantSelectorPrimitive.Stock
    >,
    'children'
  >
) => (
  <ProductVariantSelectorPrimitive.Stock {...props}>
    {({
      inStock,
      isPreOrderEnabled,
      availableQuantity,
      selectedQuantity,
      incrementQuantity,
      decrementQuantity,
    }) => (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-content-primary">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-brand-light rounded-lg">
            <button
              onClick={decrementQuantity}
              disabled={
                selectedQuantity <= 1 || (!inStock && !isPreOrderEnabled)
              }
              className="px-3 py-2 text-content-primary hover:bg-surface-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 text-content-primary border-x border-brand-light min-w-[3rem] text-center">
              {selectedQuantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={
                (!!availableQuantity &&
                  selectedQuantity >= availableQuantity) ||
                (!inStock && !isPreOrderEnabled)
              }
              className="px-3 py-2 text-content-primary hover:bg-surface-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          {/* Show max quantity only when out of stock AND preorder enabled */}
          {!inStock && isPreOrderEnabled && availableQuantity && (
            <span className="text-content-muted text-sm">
              Max: {availableQuantity} Pre Order
            </span>
          )}
          {/* Show stock message when in stock but available quantity < 10 */}
          {inStock && availableQuantity && availableQuantity < 10 && (
            <span className="text-content-muted text-sm">
              Only {availableQuantity} left in stock
            </span>
          )}
        </div>
      </div>
    )}
  </ProductVariantSelectorPrimitive.Stock>
);

// Enhanced stock status display
export const ProductStockStatusDisplay = (
  props: Omit<
    React.ComponentPropsWithoutRef<
      typeof ProductVariantSelectorPrimitive.Stock
    >,
    'children'
  >
) => (
  <ProductVariantSelectorPrimitive.Stock {...props}>
    {({
      inStock,
      isPreOrderEnabled,
      availabilityStatus,
      availableQuantity,
      trackInventory,
      currentVariantId,
    }) => {
      const getStockStatusMessage = (status: any, preOrderEnabled: boolean) => {
        // Add your status message logic here
        if (preOrderEnabled) return 'Available for Pre-order';
        if (status === 'IN_STOCK') return 'In Stock';
        if (status === 'OUT_OF_STOCK') return 'Out of Stock';
        return 'Check Availability';
      };

      const displayMessage = getStockStatusMessage(
        availabilityStatus,
        isPreOrderEnabled
      );

      return (
        (!!availabilityStatus || currentVariantId) && (
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                inStock || isPreOrderEnabled
                  ? 'status-dot-success'
                  : 'status-dot-danger'
              }`}
            />
            <span
              className={`text-sm ${
                inStock || isPreOrderEnabled
                  ? 'text-status-success'
                  : 'text-status-error'
              }`}
            >
              {displayMessage}
              {trackInventory && availableQuantity !== null && (
                <span className="text-content-muted ml-1">
                  ({availableQuantity} available)
                </span>
              )}
            </span>
          </div>
        )
      );
    }}
  </ProductVariantSelectorPrimitive.Stock>
);

// Enhanced Product Details section
export const ProductDetailsSection = () => (
  <SelectedVariantPrimitive.Details>
    {({ sku, weight }) => (
      <>
        {(sku || weight) && (
          <div className="border-t border-brand-light pt-8">
            <h3 className="text-xl font-semibold text-content-primary mb-4">
              Product Details
            </h3>
            <div className="space-y-3 text-content-secondary">
              {sku && (
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span>{sku}</span>
                </div>
              )}
              {weight && (
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>{weight}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )}
  </SelectedVariantPrimitive.Details>
);

// Enhanced Product Description Section
export const ProductDescriptionDisplay = () => (
  <ProductPrimitive.Description as="html" asChild>
    {({ description }) => (
      <>
        {description && (
          <ProductDescriptionSection>
            <div
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </ProductDescriptionSection>
        )}
      </>
    )}
  </ProductPrimitive.Description>
);

// Enhanced Price and SKU section
export const ProductPriceAndSKUSection = () => (
  <div>
    <ProductPrimitive.Name asChild>
      <h2 />
    </ProductPrimitive.Name>
    <SelectedVariantPrimitive.Price>
      {({ price, compareAtPrice }) => (
        <div className="space-y-1">
          <div className="text-3xl font-bold text-content-primary font-theme-heading">
            {price}
          </div>
          {compareAtPrice &&
            parseFloat(compareAtPrice.replace(/[^\d.]/g, '')) > 0 && (
              <div className="text-lg font-medium text-content-faded line-through">
                {compareAtPrice}
              </div>
            )}
        </div>
      )}
    </SelectedVariantPrimitive.Price>
  </div>
);

// Enhanced Cart Summary (simpler version - navigation logic to be handled in parent)
export const ProductCartSummarySection = ({
  Navigation,
}: {
  Navigation?: React.ComponentType<any>;
}) => (
  <ProductCartSummary>
    <CurrentCart.Summary>
      {({ subtotal, totalItems }) => (
        <>
          {totalItems > 0 && (
            <ProductCartSummaryCard>
              <div className="flex items-center justify-between">
                <span className="text-content-secondary">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                </span>
                <span className="text-xl font-bold text-content-primary">
                  {subtotal}
                </span>
              </div>
              {Navigation && (
                <Navigation
                  data-testid="view-cart-button"
                  route="/cart"
                  className="mt-4 w-full text-content-primary font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 btn-secondary"
                >
                  View Cart
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Navigation>
              )}
            </ProductCartSummaryCard>
          )}
        </>
      )}
    </CurrentCart.Summary>
  </ProductCartSummary>
);

// Root components that wrap everything
export const ProductRoot = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProductPrimitive.Root>) => (
  <ProductPrimitive.Root {...props}>{children}</ProductPrimitive.Root>
);

export const ProductModifiersRoot = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProductModifiersPrimitive.Root>) => (
  <ProductModifiersPrimitive.Root {...props}>
    {children}
  </ProductModifiersPrimitive.Root>
);

export const ProductVariantSelectorRoot = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof ProductVariantSelectorPrimitive.Root
>) => (
  <ProductVariantSelectorPrimitive.Root {...props}>
    {children}
  </ProductVariantSelectorPrimitive.Root>
);

export const SelectedVariantRoot = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectedVariantPrimitive.Root>) => (
  <SelectedVariantPrimitive.Root {...props}>
    {children}
  </SelectedVariantPrimitive.Root>
);

// Enhanced layout components for ProductDetails
export const ProductDetailsGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn('grid grid-cols-1 lg:grid-cols-2 gap-8', props.className)}
    data-testid="product-details"
  >
    {props.children}
  </div>
));

ProductDetailsGrid.displayName = 'ProductDetailsGrid';

export const ProductImagesSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} ref={ref} className={cn('space-y-4', props.className)}>
    {props.children}
  </div>
));

ProductImagesSection.displayName = 'ProductImagesSection';

export const ProductMainImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      'aspect-square bg-surface-primary rounded-2xl overflow-hidden border border-brand-subtle relative',
      props.className
    )}
  >
    {props.children}
  </div>
));

ProductMainImage.displayName = 'ProductMainImage';

export const ProductInfoSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} ref={ref} className={cn('space-y-8 px-3', props.className)}>
    {props.children}
  </div>
));

ProductInfoSection.displayName = 'ProductInfoSection';

export const ProductOptionsSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn('space-y-6', props.className)}
    data-testid="product-options"
  >
    <h3 className="text-lg font-semibold text-content-primary">
      Product Options
    </h3>
    {props.children}
  </div>
));

ProductOptionsSection.displayName = 'ProductOptionsSection';

export const ProductModifiersSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} ref={ref} className={cn('space-y-3', props.className)}>
    <h3 className="text-lg font-semibold text-content-primary">
      Product Modifiers
    </h3>
    {props.children}
  </div>
));

ProductModifiersSection.displayName = 'ProductModifiersSection';

export const ProductDescriptionSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} ref={ref} className={cn('', props.className)}>
    <h3 className="text-xl font-semibold text-content-primary mb-3">
      Description
    </h3>
    <p className="text-content-secondary leading-relaxed">{props.children}</p>
  </div>
));

ProductDescriptionSection.displayName = 'ProductDescriptionSection';

export const ProductQuantitySelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} ref={ref} className={cn('space-y-3', props.className)}>
    <h3 className="text-lg font-semibold text-content-primary">Quantity</h3>
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-brand-light rounded-lg">
        <button className="px-3 py-2 text-content-primary hover:bg-surface-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          -
        </button>
        <span className="px-4 py-2 text-content-primary border-x border-brand-light min-w-[3rem] text-center">
          1
        </span>
        <button className="px-3 py-2 text-content-primary hover:bg-surface-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          +
        </button>
      </div>
    </div>
  </div>
));

ProductQuantitySelector.displayName = 'ProductQuantitySelector';

export const ProductStockStatus = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div {...props} ref={ref} className={cn('space-y-4', props.className)}>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-status-success"></div>
      <span className="text-sm text-status-success">In Stock</span>
    </div>
  </div>
));

ProductStockStatus.displayName = 'ProductStockStatus';

export const ProductCartSummary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn('mt-12 pt-8 border-t border-brand-subtle', props.className)}
  >
    {props.children}
  </div>
));

ProductCartSummary.displayName = 'ProductCartSummary';

export const ProductCartSummaryCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...props}
    ref={ref}
    className={cn(
      'bg-surface-primary backdrop-blur-sm rounded-xl p-6 border border-brand-subtle',
      props.className
    )}
  >
    <h3 className="text-xl font-semibold text-content-primary mb-4">
      Cart Summary
    </h3>
    {props.children}
  </div>
));

ProductCartSummaryCard.displayName = 'ProductCartSummaryCard';
