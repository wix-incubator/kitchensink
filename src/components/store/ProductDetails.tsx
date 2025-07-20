// Auto-generated type bundle
// Generated from: src/components/store/ProductDetails.tsx
// This file contains all types needed to understand the source file

// Import from: @wix/headless-media/react
// Named imports: MediaGallery

// Import from: ../../headless/media/components
// Named imports: WixMediaImage

// Import from: @wix/headless-stores/react
// Named imports: Product, ProductModifiers, ProductVariantSelector, SelectedVariant, ProductActions

// Import from: ./ProductActionButtons
// Named imports: ProductActionButtons

// Import from: @wix/headless-ecom/react
// Named imports: CurrentCart

// Import from: ../social/SocialSharingButtons
// Named imports: SocialSharingButtons

// Import from: ../NavigationContext
// Named imports: useNavigation

// Import from: ./enums/product-status-enums
// Named imports: getStockStatusMessage
// getStockStatusMessage from ./enums/product-status-enums:
declare function getStockStatusMessage(availabilityStatus: string, isPreOrderEnabled: boolean): StockStatusMessage;


// Variable: FreeTextInput
declare const FreeTextInput: ({ modifier, name }: { modifier: any; name: string; }) => Element;

// Function: ProductDetails
declare function ProductDetails(__0: { isQuickView?: boolean; }): Element;

// Variable: Navigation
declare const Navigation: any;

// Variable: isColorOption
declare const isColorOption: boolean;

// Variable: hasColorCode
declare const hasColorCode: any;

// Variable: displayMessage
declare const displayMessage: StockStatusMessage;
