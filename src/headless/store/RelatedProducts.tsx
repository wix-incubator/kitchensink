import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { RelatedProductsServiceDefinition } from "./related-products-service";
import { productsV3 } from "@wix/stores";

/**
 * Props for RelatedProductsList headless component
 */
export interface RelatedProductsListProps {
  /** Render prop function that receives related products data */
  children: (props: RelatedProductsListRenderProps) => React.ReactNode;
}

/**
 * Render props for RelatedProductsList component
 */
export interface RelatedProductsListRenderProps {
  /** Array of related products */
  relatedProducts: productsV3.V3Product[];
  /** Whether products are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there are related products available */
  hasRelatedProducts: boolean;
  /** Function to refresh related products */
  refreshRelatedProducts: () => Promise<void>;
}

/**
 * Headless component for displaying related products list
 */
export const RelatedProductsList = (props: RelatedProductsListProps) => {
  const service = useService(RelatedProductsServiceDefinition) as ServiceAPI<
    typeof RelatedProductsServiceDefinition
  >;

  const [relatedProducts, setRelatedProducts] = React.useState<
    productsV3.V3Product[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasRelatedProducts, setHasRelatedProducts] = React.useState(false);

  React.useEffect(() => {
    const unsubscribes = [
      service.relatedProducts.subscribe(setRelatedProducts),
      service.isLoading.subscribe(setIsLoading),
      service.error.subscribe(setError),
      service.hasRelatedProducts.subscribe(setHasRelatedProducts),
    ];

    return () => unsubscribes.forEach((fn) => fn());
  }, [service]);

  return props.children({
    relatedProducts,
    isLoading,
    error,
    hasRelatedProducts,
    refreshRelatedProducts: service.refreshRelatedProducts,
  });
};

/**
 * Props for RelatedProductCard headless component
 */
export interface RelatedProductCardProps {
  /** Product data */
  product: productsV3.V3Product;
  /** Render prop function that receives product card data */
  children: (props: RelatedProductCardRenderProps) => React.ReactNode;
}

/**
 * Render props for RelatedProductCard component
 */
export interface RelatedProductCardRenderProps {
  /** Product name */
  name: string;
  /** Product image URL */
  imageUrl: string | null;
  /** Formatted price */
  price: string;
  /** Whether product is in stock */
  inStock: boolean;
  /** Product page URL */
  productUrl: string;
  /** Product description */
  description: string;
  /** Function to add product to cart quickly */
  onQuickAdd: () => void;
}

/**
 * Headless component for individual related product card
 */
export const RelatedProductCard = (props: RelatedProductCardProps) => {
  const { product } = props;

  const name = product.name || "Unknown Product";
  // Use actual v3 media structure - image is directly a string URL
  const imageUrl = product.media?.main?.image || null;
  // Create formatted price from raw amount since formattedAmount may not be available
  const rawPrice = product.actualPriceRange?.minValue?.amount;
  const price = rawPrice ? `$${rawPrice}` : "Price unavailable";
  const inStock = product.inventory?.availabilityStatus === "IN_STOCK";
  const productUrl = `/store/example-2/products/${product.slug}`;
  const description =
    typeof product.description === "string" ? product.description : "";

  const handleQuickAdd = () => {
    // This would typically add the product to cart
    // For now, we'll just log it
    console.log("Quick add:", product.name);
  };

  return props.children({
    name,
    imageUrl,
    price,
    inStock,
    productUrl,
    description,
    onQuickAdd: handleQuickAdd,
  });
};

// Namespace export for clean API
export const RelatedProducts = {
  List: RelatedProductsList,
  ProductCard: RelatedProductCard,
} as const;
