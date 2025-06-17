import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { RelatedProductsServiceDefinition } from "./related-products-service";
import { productsV3 } from "@wix/stores";

/**
 * Props for List headless component
 */
export interface ListProps {
  /** Render prop function that receives list data */
  children: (props: ListRenderProps) => React.ReactNode;
}

/**
 * Render props for List component
 */
export interface ListRenderProps {
  /** Array of related products */
  products: productsV3.V3Product[];
  /** Whether products are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there are products available */
  hasProducts: boolean;
  /** Function to refresh products */
  refresh: () => Promise<void>;
}

/**
 * Headless component for displaying related products list
 */
export const List = (props: ListProps) => {
  const service = useService(RelatedProductsServiceDefinition) as ServiceAPI<
    typeof RelatedProductsServiceDefinition
  >;

  const [products, setProducts] = React.useState<productsV3.V3Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasProducts, setHasProducts] = React.useState(false);

  React.useEffect(() => {
    const unsubscribes = [
      service.relatedProducts.subscribe(setProducts),
      service.isLoading.subscribe(setIsLoading),
      service.error.subscribe(setError),
      service.hasRelatedProducts.subscribe(setHasProducts),
    ];

    return () => unsubscribes.forEach((fn) => fn());
  }, [service]);

  return props.children({
    products,
    isLoading,
    error,
    hasProducts,
    refresh: service.refreshRelatedProducts,
  });
};

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Product data */
  product: productsV3.V3Product;
  /** Render prop function that receives item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Product title */
  title: string;
  /** Product image URL */
  image: string | null;
  /** Formatted price */
  price: string;
  /** Whether product is available */
  available: boolean;
  /** Product page URL */
  href: string;
  /** Product description */
  description: string;
  /** Function to add product to cart quickly */
  onQuickAdd: () => void;
}

/**
 * Headless component for individual related product item
 */
export const Item = (props: ItemProps) => {
  const { product } = props;

  const title = product.name || "Unknown Product";
  // Use actual v3 media structure - image is directly a string URL
  const image = product.media?.main?.image || null;
  // Create formatted price from raw amount since formattedAmount may not be available
  const rawPrice = product.actualPriceRange?.minValue?.amount;
  const price = rawPrice ? `$${rawPrice}` : "Price unavailable";
  const available = product.inventory?.availabilityStatus === "IN_STOCK";
  const href = `/store/example-2/${product.slug}`;
  const description =
    typeof product.description === "string" ? product.description : "";

  const handleQuickAdd = () => {
    // This would typically add the product to cart
    // For now, we'll just log it
    console.log("Quick add:", product.name);
  };

  return props.children({
    title,
    image,
    price,
    available,
    href,
    description,
    onQuickAdd: handleQuickAdd,
  });
};

export const RelatedProducts = {
  List,
  Item,
} as const;
