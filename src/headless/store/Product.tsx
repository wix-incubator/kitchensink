import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductServiceDefinition } from "./product-service";

/**
 * Props for ProductName headless component
 */
export interface ProductNameProps {
  /** Render prop function that receives product name data */
  children: (props: ProductNameRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductName component
 */
export interface ProductNameRenderProps {
  /** Product name */
  name: string;
  /** Whether product has a name */
  hasName: boolean;
}

/**
 * Headless component for product name display
 */
export const ProductName = (props: ProductNameProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();
  const name = product?.name || "";

  return props.children({
    name,
    hasName: !!name,
  });
};

/**
 * Props for ProductDescription headless component
 */
export interface ProductDescriptionProps {
  /** Render prop function that receives product description data */
  children: (props: ProductDescriptionRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductDescription component
 */
export interface ProductDescriptionRenderProps {
  /** Product description (may contain HTML) */
  description: string;
  /** Whether product has a description */
  hasDescription: boolean;
  /** Whether description contains HTML */
  isHtml: boolean;
}

/**
 * Headless component for product description display
 */
export const ProductDescription = (props: ProductDescriptionProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();

  // Handle v3 description which can be string or RichContent
  const rawDescription = product?.description;
  const description = typeof rawDescription === "string" ? rawDescription : "";
  const hasDescription = !!description;
  const isHtml = description.includes("<") && description.includes(">");

  return props.children({
    description,
    hasDescription,
    isHtml,
  });
};

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
  /** Product dimensions (if available) */
  dimensions: string | null;
  /** Whether product has SKU */
  hasSku: boolean;
  /** Whether product has weight */
  hasWeight: boolean;
  /** Whether product has dimensions */
  hasDimensions: boolean;
}

/**
 * Headless component for product details display
 */
export const ProductDetails = (props: ProductDetailsProps) => {
  const service = useService(ProductServiceDefinition) as ServiceAPI<
    typeof ProductServiceDefinition
  >;

  const product = service.product.get();

  // Handle v3 product structure
  const sku = product?.variantsInfo?.variants?.[0]?.sku || null;
  const weight = null; // Weight not available in current v3 API structure
  const dimensions = null; // Not available in basic product data

  return props.children({
    sku,
    weight,
    dimensions,
    hasSku: !!sku,
    hasWeight: !!weight,
    hasDimensions: false,
  });
};

export const Product = {
  Name: ProductName,
  Description: ProductDescription,
  Details: ProductDetails,
} as const;
