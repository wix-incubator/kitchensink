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
