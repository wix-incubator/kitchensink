<!-- Generated by SpecStory -->

# Project Page Development for Store Products (2025-05-14 21:54:28)

_**User**_



---

_**Assistant**_



---

I'll help you build a headless components architecture for a product page using Tailwind. Let's first look at the project structure to understand what we're working with.

---

<details>
            <summary>Listed current directory • **12** results</summary>
        
| Name |
|-------|
| 📁 `.git` |
| 📄 `.gitignore` |
| 📁 `dist` |
| 📁 `.astro` |
| 📁 `node_modules` |
| 📄 `wix.config.json` |
| 📁 `src` |
| 📄 `package-lock.json` |
| 📄 `package.json` |
| 📄 `README.md` |
| 📄 `astro.config.mjs` |
| 📄 `tsconfig.json` |

</details>

---

Let's look at the structure of the `src` directory to understand the project organization:

---

<details>
            <summary>Listed directory src • **2** results</summary>
        
| Name |
|-------|
| 📁 `pages` |
| 📁 `styles` |

</details>

---

Let's see if there's any existing product-related code in the pages directory:

---

<details>
            <summary>Listed directory src/pages • **1** results</summary>
        
| Name |
|-------|
| 📄 `index.astro` |

</details>

---

Now let's check what components directory structure exists:

---

Could not resolve URI: Error: Unable to resolve nonexistent file '/Users/netanelg/Development/kitchensink/src/components'

---

We need to create a components directory structure for our headless product components. Let's first check the package.json to understand what dependencies we're working with:

---

Read file: package.json

---

Now I understand the project structure and dependencies. We're working with an Astro project with Tailwind CSS for styling and Wix integration.

Let's create the necessary folder structure and components for a headless product page. I'll first create the components directory with a product subdirectory and a headless subdirectory within:

---

```bash
mkdir -p src/components/product/headless
```

```
?➜  kitchensink git:(main) 

```

---

Now let's create the following headless components that make up a product page:

1. ProductTitle.tsx - For displaying the product title
2. ProductPrice.tsx - For displaying the product price information
3. ProductGallery.tsx - For displaying product images/gallery
4. ProductDescription.tsx - For displaying the product description
5. ProductVariantSelector.tsx - For selecting product variants (size, color, etc.)
6. ProductQuantitySelector.tsx - For selecting product quantity
7. AddToCartButton.tsx - Button for adding the product to cart
8. ProductReviews.tsx - For displaying product reviews
9. RelatedProducts.tsx - For displaying related/similar products
10. ProductBreadcrumbs.tsx - For breadcrumb navigation

Let's start by creating a base headless component interface and the first few components:

---

```diff
- 
+ export interface Product {
+   id: string;
+   title: string;
+   description: string;
+   price: number;
+   compareAtPrice?: number;
+   images: string[];
+   variants?: ProductVariant[];
+   options?: ProductOption[];
+   sku?: string;
+   quantity?: number;
+ }
+ 
+ export interface ProductVariant {
+   id: string;
+   title: string;
+   price: number;
+   compareAtPrice?: number;
+   available: boolean;
+   sku?: string;
+   options: {[key: string]: string};
+ }
+ 
+ export interface ProductOption {
+   name: string;
+   values: string[];
+ }
+ 
+ export interface HeadlessComponentProps {
+   className?: string;
+   children?: React.ReactNode;
+ } 
```

---

Let's fix the React namespace issue:

---

```diff
+ import * as React from 'react';
+ 
  export interface Product {
    id: string;
```

---

We need to install React first as it's not currently a dependency. Let's add React to the project:

---

```bash
npm install react react-dom @types/react @types/react-dom
```

```
?➜  kitchensink git:(main) npm install react react-dom @types/react @types/react-dom

added 6 packages, and audited 399 packages in 2s

156 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
➜  kitchensink git:(main)
```

---

Now let's create our first component - ProductTitle:

---

```diff
- 
+ import * as React from 'react';
+ import { HeadlessComponentProps, Product } from './types';
+ 
+ export interface ProductTitleProps extends HeadlessComponentProps {
+   product: Product;
+   as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
+ }
+ 
+ export function ProductTitle({
+   product,
+   as: Component = 'h1',
+   className = '',
+   children,
+ }: ProductTitleProps) {
+   if (children) {
+     return (
+       <Component className={className}>
+         {children}
+       </Component>
+     );
+   }
+ 
+   return (
+     <Component className={className}>
+       {product.title}
+     </Component>
+   );
+ } 
```

---

Let's fix the type imports:

---

```diff
  import * as React from 'react';
- import { HeadlessComponentProps, Product } from './types';
+ import type { HeadlessComponentProps, Product } from './types';
  
  export interface ProductTitleProps extends HeadlessComponentProps {
```

---

Now let's create the ProductPrice component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface ProductPriceProps extends HeadlessComponentProps {
+   product: Product;
+   currencyCode?: string;
+   showCompareAt?: boolean;
+   priceClassName?: string;
+   compareAtClassName?: string;
+ }
+ 
+ export function ProductPrice({
+   product,
+   currencyCode = 'USD',
+   showCompareAt = true,
+   className = '',
+   priceClassName = '',
+   compareAtClassName = '',
+   children,
+ }: ProductPriceProps) {
+   const { price, compareAtPrice } = product;
+   const hasDiscount = showCompareAt && compareAtPrice && compareAtPrice > price;
+   
+   const formatPrice = (amount: number) => {
+     return new Intl.NumberFormat('en-US', {
+       style: 'currency',
+       currency: currencyCode,
+     }).format(amount);
+   };
+ 
+   if (children) {
+     return <div className={className}>{children}</div>;
+   }
+ 
+   return (
+     <div className={className}>
+       <span className={priceClassName}>
+         {formatPrice(price)}
+       </span>
+       {hasDiscount && (
+         <span className={compareAtClassName}>
+           {formatPrice(compareAtPrice)}
+         </span>
+       )}
+     </div>
+   );
+ } 
```

---

Let's create the ProductGallery component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface ProductGalleryProps extends HeadlessComponentProps {
+   product: Product;
+   imageClassName?: string;
+   thumbnailClassName?: string;
+   thumbnailContainerClassName?: string;
+   showThumbnails?: boolean;
+ }
+ 
+ export function ProductGallery({
+   product,
+   className = '',
+   imageClassName = '',
+   thumbnailClassName = '',
+   thumbnailContainerClassName = '',
+   showThumbnails = true,
+   children,
+ }: ProductGalleryProps) {
+   const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
+   const { images } = product;
+ 
+   if (children) {
+     return <div className={className}>{children}</div>;
+   }
+ 
+   if (!images || images.length === 0) {
+     return (
+       <div className={className}>
+         <div className={imageClassName}>No image available</div>
+       </div>
+     );
+   }
+ 
+   return (
+     <div className={className}>
+       <div className={imageClassName}>
+         <img 
+           src={images[currentImageIndex]} 
+           alt={`${product.title} - Image ${currentImageIndex + 1}`} 
+           className="w-full h-full object-contain"
+         />
+       </div>
+       
+       {showThumbnails && images.length > 1 && (
+         <div className={thumbnailContainerClassName}>
+           {images.map((image, index) => (
+             <button
+               key={index}
+               className={thumbnailClassName}
+               onClick={() => setCurrentImageIndex(index)}
+               aria-label={`View image ${index + 1}`}
+               aria-current={index === currentImageIndex}
+             >
+               <img 
+                 src={image} 
+                 alt={`Thumbnail ${index + 1}`} 
+                 className="w-full h-full object-cover"
+               />
+             </button>
+           ))}
+         </div>
+       )}
+     </div>
+   );
+ } 
```

---

Let's create the ProductDescription component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface ProductDescriptionProps extends HeadlessComponentProps {
+   product: Product;
+   as?: 'div' | 'p' | 'span';
+   truncate?: boolean;
+   maxLength?: number;
+ }
+ 
+ export function ProductDescription({
+   product,
+   as: Component = 'div',
+   className = '',
+   truncate = false,
+   maxLength = 200,
+   children,
+ }: ProductDescriptionProps) {
+   const [isExpanded, setIsExpanded] = React.useState(!truncate);
+   const { description } = product;
+ 
+   if (children) {
+     return <Component className={className}>{children}</Component>;
+   }
+ 
+   const getDisplayText = () => {
+     if (!truncate || isExpanded || description.length <= maxLength) {
+       return description;
+     }
+     return `${description.substring(0, maxLength)}...`;
+   };
+ 
+   return (
+     <Component className={className}>
+       {getDisplayText()}
+       
+       {truncate && description.length > maxLength && (
+         <button 
+           onClick={() => setIsExpanded(!isExpanded)}
+           className="text-blue-600 hover:text-blue-800 ml-1"
+         >
+           {isExpanded ? 'Show less' : 'Read more'}
+         </button>
+       )}
+     </Component>
+   );
+ } 
```

---

Let's create the ProductVariantSelector component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product, ProductOption } from './types';
+ 
+ export interface ProductVariantSelectorProps extends HeadlessComponentProps {
+   product: Product;
+   onVariantChange?: (selectedOptions: Record<string, string>) => void;
+   optionLabelClassName?: string;
+   optionValueClassName?: string;
+   activeOptionValueClassName?: string;
+   optionContainerClassName?: string;
+ }
+ 
+ export function ProductVariantSelector({
+   product,
+   className = '',
+   optionLabelClassName = '',
+   optionValueClassName = '',
+   activeOptionValueClassName = '',
+   optionContainerClassName = '',
+   onVariantChange,
+   children,
+ }: ProductVariantSelectorProps) {
+   const { options } = product;
+   const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
+ 
+   React.useEffect(() => {
+     if (options && options.length > 0) {
+       const initialOptions: Record<string, string> = {};
+       options.forEach(option => {
+         if (option.values && option.values.length > 0) {
+           initialOptions[option.name] = option.values[0];
+         }
+       });
+       setSelectedOptions(initialOptions);
+       onVariantChange?.(initialOptions);
+     }
+   }, [options]);
+ 
+   if (children) {
+     return <div className={className}>{children}</div>;
+   }
+ 
+   if (!options || options.length === 0) {
+     return null;
+   }
+ 
+   const handleOptionChange = (optionName: string, value: string) => {
+     const newOptions = { ...selectedOptions, [optionName]: value };
+     setSelectedOptions(newOptions);
+     onVariantChange?.(newOptions);
+   };
+   
+   return (
+     <div className={className}>
+       {options.map((option: ProductOption) => (
+         <div key={option.name} className={optionContainerClassName}>
+           <label className={optionLabelClassName}>
+             {option.name}
+           </label>
+           <div className="flex flex-wrap gap-2 mt-1">
+             {option.values.map(value => {
+               const isActive = selectedOptions[option.name] === value;
+               return (
+                 <button
+                   key={value}
+                   className={`${optionValueClassName} ${isActive ? activeOptionValueClassName : ''}`}
+                   onClick={() => handleOptionChange(option.name, value)}
+                   aria-pressed={isActive}
+                 >
+                   {value}
+                 </button>
+               );
+             })}
+           </div>
+         </div>
+       ))}
+     </div>
+   );
+ } 
```

---

Let's create the ProductQuantitySelector component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps } from './types';
+ 
+ export interface ProductQuantitySelectorProps extends HeadlessComponentProps {
+   initialQuantity?: number;
+   min?: number;
+   max?: number;
+   step?: number;
+   onQuantityChange?: (quantity: number) => void;
+   decrementButtonClassName?: string;
+   incrementButtonClassName?: string;
+   inputClassName?: string;
+ }
+ 
+ export function ProductQuantitySelector({
+   initialQuantity = 1,
+   min = 1,
+   max = 999,
+   step = 1,
+   className = '',
+   decrementButtonClassName = '',
+   incrementButtonClassName = '',
+   inputClassName = '',
+   onQuantityChange,
+   children,
+ }: ProductQuantitySelectorProps) {
+   const [quantity, setQuantity] = React.useState(initialQuantity);
+ 
+   React.useEffect(() => {
+     setQuantity(initialQuantity);
+   }, [initialQuantity]);
+ 
+   React.useEffect(() => {
+     onQuantityChange?.(quantity);
+   }, [quantity, onQuantityChange]);
+ 
+   if (children) {
+     return <div className={className}>{children}</div>;
+   }
+ 
+   const handleIncrement = () => {
+     if (quantity < max) {
+       setQuantity(prev => Math.min(prev + step, max));
+     }
+   };
+ 
+   const handleDecrement = () => {
+     if (quantity > min) {
+       setQuantity(prev => Math.max(prev - step, min));
+     }
+   };
+ 
+   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
+     const value = parseInt(e.target.value, 10);
+     if (!isNaN(value)) {
+       setQuantity(Math.min(Math.max(value, min), max));
+     }
+   };
+ 
+   return (
+     <div className={className}>
+       <button
+         type="button"
+         onClick={handleDecrement}
+         disabled={quantity <= min}
+         className={decrementButtonClassName}
+         aria-label="Decrease quantity"
+       >
+         -
+       </button>
+       <input
+         type="number"
+         value={quantity}
+         onChange={handleChange}
+         min={min}
+         max={max}
+         step={step}
+         className={inputClassName}
+         aria-label="Quantity"
+       />
+       <button
+         type="button"
+         onClick={handleIncrement}
+         disabled={quantity >= max}
+         className={incrementButtonClassName}
+         aria-label="Increase quantity"
+       >
+         +
+       </button>
+     </div>
+   );
+ } 
```

---

Let's create the AddToCartButton component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface AddToCartButtonProps extends HeadlessComponentProps {
+   product: Product;
+   quantity?: number;
+   selectedVariantId?: string;
+   onAddToCart?: (product: Product, quantity: number, variantId?: string) => void;
+   disabled?: boolean;
+   loading?: boolean;
+   loadingText?: string;
+ }
+ 
+ export function AddToCartButton({
+   product,
+   quantity = 1,
+   selectedVariantId,
+   className = '',
+   onAddToCart,
+   disabled = false,
+   loading = false,
+   loadingText = 'Adding...',
+   children,
+ }: AddToCartButtonProps) {
+   const handleClick = () => {
+     if (!disabled && !loading && onAddToCart) {
+       onAddToCart(product, quantity, selectedVariantId);
+     }
+   };
+ 
+   if (children) {
+     return (
+       <button 
+         className={className}
+         onClick={handleClick}
+         disabled={disabled || loading}
+       >
+         {children}
+       </button>
+     );
+   }
+ 
+   return (
+     <button
+       type="button"
+       className={className}
+       onClick={handleClick}
+       disabled={disabled || loading}
+       aria-busy={loading}
+     >
+       {loading ? loadingText : 'Add to Cart'}
+     </button>
+   );
+ } 
```

---

Let's create the ProductReviews component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface Review {
+   id: string;
+   author: string;
+   rating: number;
+   date: string;
+   title?: string;
+   content: string;
+ }
+ 
+ export interface ProductReviewsProps extends HeadlessComponentProps {
+   product: Product;
+   reviews?: Review[];
+   isLoading?: boolean;
+   reviewTitleClassName?: string;
+   reviewAuthorClassName?: string;
+   reviewDateClassName?: string;
+   reviewContentClassName?: string;
+   reviewItemClassName?: string;
+   loadingText?: string;
+   emptyText?: string;
+   showRating?: boolean;
+   maxStars?: number;
+   starFilledClassName?: string;
+   starEmptyClassName?: string;
+ }
+ 
+ export function ProductReviews({
+   product,
+   reviews = [],
+   isLoading = false,
+   className = '',
+   reviewTitleClassName = '',
+   reviewAuthorClassName = '',
+   reviewDateClassName = '',
+   reviewContentClassName = '',
+   reviewItemClassName = '',
+   loadingText = 'Loading reviews...',
+   emptyText = 'No reviews yet',
+   showRating = true,
+   maxStars = 5,
+   starFilledClassName = '',
+   starEmptyClassName = '',
+   children,
+ }: ProductReviewsProps) {
+   if (children) {
+     return <div className={className}>{children}</div>;
+   }
+ 
+   if (isLoading) {
+     return <div className={className}>{loadingText}</div>;
+   }
+ 
+   if (reviews.length === 0) {
+     return <div className={className}>{emptyText}</div>;
+   }
+ 
+   const renderStars = (rating: number) => {
+     if (!showRating) return null;
+ 
+     return (
+       <div className="flex">
+         {Array.from({ length: maxStars }).map((_, i) => (
+           <span
+             key={i}
+             className={i < rating ? starFilledClassName : starEmptyClassName}
+             aria-hidden="true"
+           >
+             ★
+           </span>
+         ))}
+         <span className="sr-only">{rating} out of {maxStars} stars</span>
+       </div>
+     );
+   };
+ 
+   return (
+     <div className={className}>
+       <h3>Customer Reviews</h3>
+       <ul>
+         {reviews.map((review) => (
+           <li key={review.id} className={reviewItemClassName}>
+             {showRating && renderStars(review.rating)}
+             
+             {review.title && (
+               <h4 className={reviewTitleClassName}>{review.title}</h4>
+             )}
+             
+             <div className={reviewContentClassName}>{review.content}</div>
+             
+             <div className="mt-2">
+               <span className={reviewAuthorClassName}>{review.author}</span>
+               <span className={reviewDateClassName}>{review.date}</span>
+             </div>
+           </li>
+         ))}
+       </ul>
+     </div>
+   );
+ } 
```

---

Let's create the RelatedProducts component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface RelatedProductsProps extends HeadlessComponentProps {
+   currentProduct: Product;
+   relatedProducts?: Product[];
+   isLoading?: boolean;
+   productItemClassName?: string;
+   productImageClassName?: string;
+   productTitleClassName?: string;
+   productPriceClassName?: string;
+   linkComponent?: React.ComponentType<any>;
+   onProductClick?: (product: Product) => void;
+   loadingText?: string;
+   emptyText?: string;
+   title?: string;
+   maxProducts?: number;
+ }
+ 
+ export function RelatedProducts({
+   currentProduct,
+   relatedProducts = [],
+   isLoading = false,
+   className = '',
+   productItemClassName = '',
+   productImageClassName = '',
+   productTitleClassName = '',
+   productPriceClassName = '',
+   linkComponent: LinkComponent,
+   onProductClick,
+   loadingText = 'Loading related products...',
+   emptyText = 'No related products found',
+   title = 'You may also like',
+   maxProducts = 4,
+   children,
+ }: RelatedProductsProps) {
+   const displayProducts = React.useMemo(() => {
+     return relatedProducts.slice(0, maxProducts);
+   }, [relatedProducts, maxProducts]);
+ 
+   if (children) {
+     return <div className={className}>{children}</div>;
+   }
+ 
+   if (isLoading) {
+     return <div className={className}>{loadingText}</div>;
+   }
+ 
+   if (displayProducts.length === 0) {
+     return <div className={className}>{emptyText}</div>;
+   }
+ 
+   const handleProductClick = (product: Product) => {
+     if (onProductClick) {
+       onProductClick(product);
+     }
+   };
+ 
+   const formatPrice = (price: number) => {
+     return new Intl.NumberFormat('en-US', {
+       style: 'currency',
+       currency: 'USD',
+     }).format(price);
+   };
+ 
+   const renderProductItem = (product: Product) => {
+     const productContent = (
+       <>
+         <div className={productImageClassName}>
+           {product.images && product.images.length > 0 ? (
+             <img
+               src={product.images[0]}
+               alt={product.title}
+               className="w-full h-full object-cover"
+             />
+           ) : (
+             <div className="w-full h-full bg-gray-200 flex items-center justify-center">
+               No image
+             </div>
+           )}
+         </div>
+         <h3 className={productTitleClassName}>{product.title}</h3>
+         <div className={productPriceClassName}>{formatPrice(product.price)}</div>
+       </>
+     );
+ 
+     if (LinkComponent) {
+       return (
+         <LinkComponent
+           href={`/products/${product.id}`}
+           className={productItemClassName}
+           onClick={() => handleProductClick(product)}
+         >
+           {productContent}
+         </LinkComponent>
+       );
+     }
+ 
+     return (
+       <div
+         className={productItemClassName}
+         onClick={() => handleProductClick(product)}
+         role="button"
+         tabIndex={0}
+       >
+         {productContent}
+       </div>
+     );
+   };
+ 
+   return (
+     <div className={className}>
+       <h2>{title}</h2>
+       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
+         {displayProducts.map((product) => (
+           <div key={product.id}>
+             {renderProductItem(product)}
+           </div>
+         ))}
+       </div>
+     </div>
+   );
+ } 
```

---

Finally, let's create the ProductBreadcrumbs component:

---

```diff
- 
+ import * as React from 'react';
+ import type { HeadlessComponentProps, Product } from './types';
+ 
+ export interface Breadcrumb {
+   text: string;
+   href?: string;
+ }
+ 
+ export interface ProductBreadcrumbsProps extends HeadlessComponentProps {
+   product: Product;
+   breadcrumbs?: Breadcrumb[];
+   separator?: React.ReactNode;
+   itemClassName?: string;
+   separatorClassName?: string;
+   activeItemClassName?: string;
+   linkComponent?: React.ComponentType<any>;
+ }
+ 
+ export function ProductBreadcrumbs({
+   product,
+   breadcrumbs = [],
+   separator = '/',
+   className = '',
+   itemClassName = '',
+   separatorClassName = '',
+   activeItemClassName = '',
+   linkComponent: LinkComponent,
+   children,
+ }: ProductBreadcrumbsProps) {
+   // Default breadcrumbs if none provided
+   const defaultBreadcrumbs: Breadcrumb[] = React.useMemo(() => [
+     { text: 'Home', href: '/' },
+     { text: 'Products', href: '/products' },
+     { text: product.title },
+   ], [product]);
+ 
+   const items = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;
+ 
+   if (children) {
+     return <nav aria-label="Breadcrumb" className={className}>{children}</nav>;
+   }
+ 
+   return (
+     <nav aria-label="Breadcrumb" className={className}>
+       <ol className="flex flex-wrap">
+         {items.map((item, index) => {
+           const isLast = index === items.length - 1;
+           const itemClasses = `${itemClassName} ${isLast ? activeItemClassName : ''}`;
+ 
+           return (
+             <li key={index} className="flex items-center">
+               {index > 0 && (
+                 <span className={separatorClassName} aria-hidden="true">
+                   {separator}
+                 </span>
+               )}
+               
+               {!isLast && item.href && LinkComponent ? (
+                 <LinkComponent href={item.href} className={itemClasses}>
+                   {item.text}
+                 </LinkComponent>
+               ) : (
+                 <span className={itemClasses} aria-current={isLast ? 'page' : undefined}>
+                   {item.text}
+                 </span>
+               )}
+             </li>
+           );
+         })}
+       </ol>
+     </nav>
+   );
+ } 
```

---

Let's create an index file to export all our headless components for easy imports:

---

```diff
- 
+ export * from './types';
+ export * from './ProductTitle';
+ export * from './ProductPrice';
+ export * from './ProductGallery';
+ export * from './ProductDescription';
+ export * from './ProductVariantSelector';
+ export * from './ProductQuantitySelector';
+ export * from './AddToCartButton';
+ export * from './ProductReviews';
+ export * from './RelatedProducts';
+ export * from './ProductBreadcrumbs'; 
```

---

Now, let's create a sample ProductPage component that demonstrates how to compose these headless components together:

---

```diff
- 
+ import * as React from 'react';
+ import {
+   ProductTitle,
+   ProductPrice,
+   ProductGallery,
+   ProductDescription,
+   ProductVariantSelector,
+   ProductQuantitySelector,
+   AddToCartButton,
+   ProductReviews,
+   RelatedProducts,
+   ProductBreadcrumbs,
+   type Product
+ } from './headless';
+ 
+ export interface ProductPageProps {
+   product: Product;
+   relatedProducts?: Product[];
+   reviews?: any[];
+   onAddToCart?: (product: Product, quantity: number, variantId?: string) => void;
+   onVariantChange?: (selectedOptions: Record<string, string>) => void;
+ }
+ 
+ export function ProductPage({
+   product,
+   relatedProducts = [],
+   reviews = [],
+   onAddToCart,
+   onVariantChange,
+ }: ProductPageProps) {
+   const [quantity, setQuantity] = React.useState(1);
+   const [selectedVariantId, setSelectedVariantId] = React.useState<string | undefined>(
+     product.variants?.[0]?.id
+   );
+ 
+   const handleQuantityChange = (qty: number) => {
+     setQuantity(qty);
+   };
+ 
+   const handleVariantChange = (selectedOptions: Record<string, string>) => {
+     // Find the variant that matches the selected options
+     if (product.variants) {
+       const variant = product.variants.find(v => {
+         return Object.entries(selectedOptions).every(
+           ([key, value]) => v.options[key] === value
+         );
+       });
+ 
+       if (variant) {
+         setSelectedVariantId(variant.id);
+       }
+ 
+       if (onVariantChange) {
+         onVariantChange(selectedOptions);
+       }
+     }
+   };
+ 
+   const handleAddToCart = () => {
+     if (onAddToCart) {
+       onAddToCart(product, quantity, selectedVariantId);
+     }
+   };
+ 
+   return (
+     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
+       {/* Breadcrumbs */}
+       <ProductBreadcrumbs
+         product={product}
+         className="mb-6 text-sm"
+         itemClassName="text-gray-500 hover:text-gray-700"
+         separatorClassName="mx-2 text-gray-400"
+         activeItemClassName="text-gray-900 font-medium"
+       />
+       
+       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
+         {/* Product Gallery */}
+         <ProductGallery
+           product={product}
+           className="sticky top-24"
+           imageClassName="aspect-square rounded-lg overflow-hidden bg-gray-100"
+           thumbnailContainerClassName="mt-4 grid grid-cols-6 gap-2"
+           thumbnailClassName="aspect-square rounded border hover:border-black cursor-pointer"
+         />
+         
+         <div>
+           {/* Product Title */}
+           <ProductTitle
+             product={product}
+             className="text-3xl font-bold text-gray-900"
+           />
+           
+           {/* Product Price */}
+           <div className="mt-4">
+             <ProductPrice
+               product={product}
+               className="flex items-center"
+               priceClassName="text-2xl font-semibold text-gray-900"
+               compareAtClassName="ml-3 text-lg text-gray-500 line-through"
+             />
+           </div>
+           
+           {/* Product Description */}
+           <div className="mt-6">
+             <ProductDescription
+               product={product}
+               className="text-gray-700 prose"
+               truncate={true}
+               maxLength={300}
+             />
+           </div>
+           
+           {/* Product Variant Selector */}
+           {product.options && product.options.length > 0 && (
+             <div className="mt-8">
+               <ProductVariantSelector
+                 product={product}
+                 onVariantChange={handleVariantChange}
+                 className="space-y-6"
+                 optionContainerClassName="mb-4"
+                 optionLabelClassName="block text-sm font-medium text-gray-700 mb-1"
+                 optionValueClassName="border rounded-md px-3 py-2 mr-2 text-sm cursor-pointer"
+                 activeOptionValueClassName="border-black bg-gray-100"
+               />
+             </div>
+           )}
+           
+           {/* Quantity Selector and Add to Cart */}
+           <div className="mt-8 flex items-end space-x-4">
+             <div>
+               <ProductQuantitySelector
+                 initialQuantity={1}
+                 onQuantityChange={handleQuantityChange}
+                 className="flex border border-gray-300 rounded-md"
+                 decrementButtonClassName="px-3 py-2 text-gray-700 hover:bg-gray-100"
+                 incrementButtonClassName="px-3 py-2 text-gray-700 hover:bg-gray-100"
+                 inputClassName="w-12 text-center border-x border-gray-300"
+               />
+             </div>
+             
+             <AddToCartButton
+               product={product}
+               quantity={quantity}
+               selectedVariantId={selectedVariantId}
+               onAddToCart={handleAddToCart}
+               className="flex-1 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
+             />
+           </div>
+         </div>
+       </div>
+       
+       {/* Reviews Section */}
+       <div className="mt-16 border-t border-gray-200 pt-12">
+         <ProductReviews
+           product={product}
+           reviews={reviews}
+           className="max-w-2xl mx-auto"
+           reviewItemClassName="border-b border-gray-200 py-6 last:border-b-0"
+           reviewTitleClassName="font-medium text-lg"
+           reviewContentClassName="mt-2 text-gray-700"
+           reviewAuthorClassName="text-sm text-gray-600"
+           reviewDateClassName="text-sm text-gray-500 ml-2"
+           starFilledClassName="text-yellow-400"
+           starEmptyClassName="text-gray-300"
+         />
+       </div>
+       
+       {/* Related Products */}
+       <div className="mt-16 border-t border-gray-200 pt-12">
+         <RelatedProducts
+           currentProduct={product}
+           relatedProducts={relatedProducts}
+           className="max-w-7xl mx-auto"
+           productItemClassName="cursor-pointer hover:opacity-90"
+           productImageClassName="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3"
+           productTitleClassName="font-medium text-gray-900 mt-1"
+           productPriceClassName="text-gray-600 mt-1"
+         />
+       </div>
+     </div>
+   );
+ } 
```

---

Now let's create a sample product page in Astro to demonstrate using these components:

---

```diff
- 
+ import { ProductPage } from '../../components/product/ProductPage';
+ 
+ // This would typically come from a data fetching function
+ const mockProduct = {
+   id: "1",
+   title: "Premium Leather Jacket",
+   description: "A luxurious leather jacket made from the finest materials. This jacket features a stylish design, multiple pockets, and a comfortable fit. Perfect for casual outings or a night on the town. The premium quality ensures durability and long-lasting wear.",
+   price: 299.99,
+   compareAtPrice: 349.99,
+   images: [
+     "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
+     "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=992&q=80",
+     "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
+   ],
+   options: [
+     {
+       name: "Size",
+       values: ["XS", "S", "M", "L", "XL"]
+     },
+     {
+       name: "Color",
+       values: ["Black", "Brown", "Tan"]
+     }
+   ],
+   variants: [
+     {
+       id: "v1",
+       title: "XS / Black",
+       price: 299.99,
+       compareAtPrice: 349.99,
+       available: true,
+       options: { Size: "XS", Color: "Black" }
+     },
+     {
+       id: "v2",
+       title: "S / Black",
+       price: 299.99,
+       compareAtPrice: 349.99,
+       available: true,
+       options: { Size: "S", Color: "Black" }
+     },
+     // More variants would be here
+   ]
+ };
+ 
+ const mockRelatedProducts = [
+   {
+     id: "2",
+     title: "Denim Jacket",
+     description: "Classic denim jacket with a modern twist.",
+     price: 89.99,
+     images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"]
+   },
+   {
+     id: "3",
+     title: "Wool Peacoat",
+     description: "Elegant wool peacoat for colder weather.",
+     price: 199.99,
+     images: ["https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"]
+   },
+   {
+     id: "4",
+     title: "Bomber Jacket",
+     description: "Stylish bomber jacket for casual wear.",
+     price: 149.99,
+     images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80"]
+   },
+   {
+     id: "5",
+     title: "Trench Coat",
+     description: "Classic trench coat for a sophisticated look.",
+     price: 229.99,
+     images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"]
+   }
+ ];
+ 
+ const mockReviews = [
+   {
+     id: "r1",
+     author: "Jane Smith",
+     rating: 5,
+     date: "2023-02-15",
+     title: "Amazing quality!",
+     content: "This jacket exceeded all my expectations. The leather is so soft and the craftsmanship is impeccable."
+   },
+   {
+     id: "r2",
+     author: "Mark Johnson",
+     rating: 4,
+     date: "2023-01-20",
+     content: "Great jacket, runs a bit small so I recommend sizing up. Otherwise perfect!"
+   },
+   {
+     id: "r3",
+     author: "Sarah Williams",
+     rating: 5,
+     date: "2022-12-05",
+     title: "Worth every penny",
+     content: "I've had many leather jackets before but this one is by far the best. The attention to detail is amazing."
+   }
+ ];
+ 
+ // In a real application, you would fetch the product based on the id parameter
+ const { id } = Astro.params;
+ const product = mockProduct;
+ const relatedProducts = mockRelatedProducts;
+ const reviews = mockReviews;
+ 
+ // For client-side interactivity, you would handle these functions in a client script
+ const handleAddToCart = () => {
+   console.log('Add to cart function would be implemented here');
+ };
+ 
+ const handleVariantChange = () => {
+   console.log('Variant change function would be implemented here');
+ };
+ 
+ <html lang="en">
+ <head>
+   <meta charset="UTF-8">
+   <meta name="viewport" content="width=device-width, initial-scale=1.0">
+   <title>{product.title} | Your Store</title>
+   <script src="https://cdn.tailwindcss.com"></script>
+ </head>
+ <body>
+   <header class="bg-white shadow-sm">
+     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
+       <div class="flex justify-between h-16 items-center">
+         <div class="flex-shrink-0">
+           <a href="/" class="font-bold text-xl">Your Store</a>
+         </div>
+         <nav class="flex space-x-8">
+           <a href="/" class="text-gray-500 hover:text-gray-900">Home</a>
+           <a href="/products" class="text-gray-900 font-medium">Products</a>
+           <a href="/about" class="text-gray-500 hover:text-gray-900">About</a>
+           <a href="/contact" class="text-gray-500 hover:text-gray-900">Contact</a>
+         </nav>
+       </div>
+     </div>
+   </header>
+ 
+   <main>
+     <ProductPage 
+       product={product} 
+       relatedProducts={relatedProducts} 
+       reviews={reviews} 
+       client:load
+     />
+   </main>
+ 
+   <footer class="bg-gray-50 mt-24">
+     <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
+       <p class="text-center text-gray-500">&copy; 2023 Your Store. All rights reserved.</p>
+     </div>
+   </footer>
+ </body>
+ </html> 
```

---

I've created a set of headless components for a product page using React and Tailwind CSS. Here's what I've built:

1. **Core Components:**
   - ProductTitle - For displaying the product title
   - ProductPrice - For displaying product price information
   - ProductGallery - For displaying product images with thumbnails
   - ProductDescription - For displaying product description with optional truncation
   - ProductVariantSelector - For selecting product variants (size, color, etc.)
   - ProductQuantitySelector - For selecting product quantity
   - AddToCartButton - Button for adding the product to cart
   - ProductReviews - For displaying product reviews
   - RelatedProducts - For displaying related/similar products
   - ProductBreadcrumbs - For breadcrumb navigation

2. **Type Definitions:**
   - Created comprehensive type definitions in `types.ts`
   - Components accept className props for Tailwind styling

3. **Composition Example:**
   - Created a ProductPage component that demonstrates how to compose these headless components with Tailwind styling
   - Created a sample Astro page to demonstrate implementation

Each component follows the headless pattern:
- Accepts className props for styling with Tailwind
- Provides functionality without enforcing specific styles
- Supports custom rendering via children prop
- Handles common use cases with sensible defaults

The components are designed to be flexible and reusable, allowing for easy customization of styles while maintaining consistent functionality. You can modify the styling through the className props to match your specific design requirements.

---

