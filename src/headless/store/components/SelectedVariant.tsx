import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "../services/product-service";
import { SelectedVariantServiceDefinition } from "../services/selected-variant-service";
import type { productsV3 } from "@wix/stores";

/**
 * Props for ProductDetails headless component
 */
export interface ProductDetailsProps {
  /** Render prop function that receives product details data */
  children: (props: ProductDetailsRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductDetails component
 */
export interface ProductDetailsRenderProps {
  /** Product SKU */
  sku: string | null;
  /** Product weight */
  weight: string | null;
}

/**
 * Headless component for selected variant details display
 */
export const Details = (props: ProductDetailsProps) => {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();

  let sku: string | null = selectedVariant?.sku || null;
  let weight: string | null =
    selectedVariant?.physicalProperties?.weight?.toString() || null;

  return props.children({
    sku,
    weight,
  });
};

/**
 * Props for Price headless component
 */
export interface PriceProps {
  /** Render prop function that receives price data */
  children: (props: PriceRenderProps) => React.ReactNode;
}

/**
 * Render props for Price component
 */
export interface PriceRenderProps {
  /** Current price (formatted) */
  price: string;
  /** Compare at price (formatted) - null if no compare price */
  compareAtPrice: string | null;
  /** Currency code */
  currency: string;
}

/**
 * Headless component for product price display
 */
export const Price = (props: PriceProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const price = variantService.currentPrice.get();
  const compareAtPrice = variantService.currentCompareAtPrice.get();
  const currency = variantService.currency.get();

  return props.children({
    price,
    compareAtPrice,
    currency,
  });
};

/**
 * Props for SKU headless component
 */
export interface SKUProps {
  /** Render prop function that receives SKU data */
  children: (props: SKURenderProps) => React.ReactNode;
}

/**
 * Render props for SKU component
 */
export interface SKURenderProps {
  /** Product SKU */
  sku: string | null;
}

/**
 * Headless component for product SKU display
 */
export const SKU = (props: SKUProps) => {
  const selectedVariantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;

  const selectedVariant = selectedVariantService.currentVariant?.get();
  const sku: string | null = selectedVariant?.sku || null;

  return props.children({
    sku,
  });
};

/**
 * Props for Stock headless component
 */
export interface StockProps {
  /** Render prop function that receives stock data */
  children: (props: StockRenderProps) => React.ReactNode;
}

/**
 * Render props for Stock component
 */
export interface StockRenderProps {
  /** Whether variant is in stock */
  inStock: boolean;
  /** Whether pre-order is enabled */
  isPreOrderEnabled: boolean;
  /** Stock status message */
  status: string;
  /** Available quantity */
  availableQuantity: number | null;
  /** Current variant id */
  currentVariantId: string | null;
}

/**
 * Headless component for product stock status
 */
export const Stock = (props: StockProps) => {
  const variantService = useService(
    SelectedVariantServiceDefinition
  ) as ServiceAPI<typeof SelectedVariantServiceDefinition>;
  const productService = useService(
    ProductServiceDefinition
  ) as ServiceAPI<typeof ProductServiceDefinition>;

  const selectedChoices = variantService.selectedChoices.get();
  const hasSelections = Object.keys(selectedChoices).length > 0;

  // Get variant-specific availability
  const variantInStock = variantService.isInStock.get();
  const variantPreOrderEnabled = variantService.isPreOrderEnabled.get();
  const currentVariantId = variantService.selectedVariantId.get();
  const availableQuantity = variantService.quantityAvailable.get();

  // Get general product availability
  const product = productService.product.get();
  const productAvailabilityStatus = product?.inventory?.availabilityStatus;
  const generalPreOrderEnabled = product?.inventory?.preorderStatus === "ENABLED";

  // Determine status based on whether selections are made
  let inStock: boolean;
  let isPreOrderEnabled: boolean;
  let status: string;

  if (hasSelections) {
    // Use variant-specific availability
    inStock = variantInStock;
    isPreOrderEnabled = variantPreOrderEnabled;
    
    if (inStock) {
      status = "In Stock";
    } else if (isPreOrderEnabled) {
      status = "Available for Pre-Order";
    } else {
      status = "Out of Stock";
    }
  } else {
    // Use general product availability
    isPreOrderEnabled = generalPreOrderEnabled;
    
         if (productAvailabilityStatus === "IN_STOCK") {
       inStock = true;
       status = "In Stock";
     } else if (productAvailabilityStatus === "PARTIALLY_OUT_OF_STOCK") {
       inStock = false;
       isPreOrderEnabled = true; // Force orange styling for partially out of stock
       status = "Partially out of stock";
     } else if (isPreOrderEnabled) {
       inStock = false;
       status = "Available for Pre-Order";
     } else {
       inStock = false;
       status = "Out of Stock";
     }
  }

  return props.children({
    inStock,
    availableQuantity: hasSelections ? availableQuantity : null, // Only show quantity for specific variants
    isPreOrderEnabled,
    currentVariantId: hasSelections ? currentVariantId : null,
    status,
  });
};
