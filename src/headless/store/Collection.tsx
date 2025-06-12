import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CollectionServiceDefinition } from "./collection-service";
import { productsV3 } from "@wix/stores";

/**
 * Props for ProductGrid headless component
 */
export interface ProductGridProps {
  /** Render prop function that receives product grid data */
  children: (props: ProductGridRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductGrid component
 */
export interface ProductGridRenderProps {
  /** Array of products */
  products: productsV3.V3Product[];
  /** Whether products are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there are no products */
  isEmpty: boolean;
  /** Total number of products */
  totalProducts: number;
  /** Whether collection has products */
  hasProducts: boolean;
}

/**
 * Headless component for product grid
 */
export const ProductGrid = (props: ProductGridProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Debug logging to help identify service issues
  if (!service) {
    console.error("CollectionService is undefined");
    return props.children({
      products: [],
      isLoading: false,
      error: "Service not available",
      isEmpty: true,
      totalProducts: 0,
      hasProducts: false,
    });
  }

  // Safely access service properties with error handling
  try {
    const productList = service.products?.get() || [];
    const isLoading = service.isLoading?.get() || false;
    const error = service.error?.get() || null;
    const totalProducts = service.totalProducts?.get() || 0;
    const hasProducts = service.hasProducts?.get() || false;

    return props.children({
      products: productList,
      isLoading,
      error,
      isEmpty: !hasProducts && !isLoading,
      totalProducts,
      hasProducts,
    });
  } catch (err) {
    console.error("Error accessing service properties:", err);
    return props.children({
      products: [],
      isLoading: false,
      error: "Failed to load products",
      isEmpty: true,
      totalProducts: 0,
      hasProducts: false,
    });
  }
};

/**
 * Props for ProductCard headless component
 */
export interface ProductCardProps {
  /** Product data */
  product: productsV3.V3Product;
  /** Render prop function that receives product card data */
  children: (props: ProductCardRenderProps) => React.ReactNode;
}

/**
 * Render props for ProductCard component
 */
export interface ProductCardRenderProps {
  /** Product ID */
  productId: string;
  /** Product name */
  name: string;
  /** Product slug for URL */
  slug: string;
  /** Main product image URL */
  imageUrl: string | null;
  /** Product price */
  price: string;
  /** Product description */
  description: string;
  /** Whether product is in stock */
  inStock: boolean;
  /** Product URL */
  productUrl: string;
}

/**
 * Headless component for individual product card
 */
export const ProductCard = (props: ProductCardProps) => {
  const { product } = props;

  // Use actual v3 API structure based on real data
  // Images are in media.main.image, not media.itemsInfo.items
  const imageUrl = product?.media?.main?.image || null;

  // Create formatted price since formattedAmount is not available
  const rawAmount = product.actualPriceRange?.minValue?.amount;
  const price = rawAmount ? `$${rawAmount}` : "$0.00";

  const inStock = product.inventory?.availabilityStatus === "IN_STOCK";
  const description =
    typeof product.description === "string" ? product.description : "";

  return props.children({
    productId: product._id || "",
    name: product.name || "",
    slug: product.slug || "",
    imageUrl,
    price,
    description,
    inStock,
    productUrl: `/store/products/${product.slug}`,
  });
};

/**
 * Props for LoadMoreProducts headless component
 */
export interface LoadMoreProductsProps {
  /** Render prop function that receives load more data */
  children: (props: LoadMoreProductsRenderProps) => React.ReactNode;
}

/**
 * Render props for LoadMoreProducts component
 */
export interface LoadMoreProductsRenderProps {
  /** Function to load more products */
  loadMore: () => Promise<void>;
  /** Function to refresh products */
  refresh: () => Promise<void>;
  /** Whether load more is currently loading */
  isLoading: boolean;
  /** Whether there are products */
  hasProducts: boolean;
  /** Total number of products currently loaded */
  totalProducts: number;
}

/**
 * Headless component for load more products functionality
 * Note: V3 API uses simplified loading without traditional pagination
 */
export const LoadMoreProducts = (props: LoadMoreProductsProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Error handling for undefined service
  if (!service) {
    console.error("CollectionService is undefined in LoadMoreProducts");
    return props.children({
      loadMore: async () => {},
      refresh: async () => {},
      isLoading: false,
      hasProducts: false,
      totalProducts: 0,
    });
  }

  try {
    const isLoading = service.isLoading?.get() || false;
    const hasProducts = service.hasProducts?.get() || false;
    const totalProducts = service.totalProducts?.get() || 0;

    return props.children({
      loadMore: service.loadMore || (async () => {}),
      refresh: service.refresh || (async () => {}),
      isLoading,
      hasProducts,
      totalProducts,
    });
  } catch (err) {
    console.error("Error in LoadMoreProducts:", err);
    return props.children({
      loadMore: async () => {},
      refresh: async () => {},
      isLoading: false,
      hasProducts: false,
      totalProducts: 0,
    });
  }
};

/**
 * Props for CollectionHeader headless component
 */
export interface CollectionHeaderProps {
  /** Render prop function that receives collection header data */
  children: (props: CollectionHeaderRenderProps) => React.ReactNode;
}

/**
 * Render props for CollectionHeader component
 */
export interface CollectionHeaderRenderProps {
  /** Total number of products */
  totalProducts: number;
  /** Whether collection is loading */
  isLoading: boolean;
  /** Whether collection has products */
  hasProducts: boolean;
}

/**
 * Headless component for collection header with product count
 */
export const CollectionHeader = (props: CollectionHeaderProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Error handling for undefined service
  if (!service) {
    console.error("CollectionService is undefined in CollectionHeader");
    return props.children({
      totalProducts: 0,
      isLoading: false,
      hasProducts: false,
    });
  }

  try {
    const totalProducts = service.totalProducts?.get() || 0;
    const isLoading = service.isLoading?.get() || false;
    const hasProducts = service.hasProducts?.get() || false;

    return props.children({
      totalProducts,
      isLoading,
      hasProducts,
    });
  } catch (err) {
    console.error("Error in CollectionHeader:", err);
    return props.children({
      totalProducts: 0,
      isLoading: false,
      hasProducts: false,
    });
  }
};

/**
 * Props for CollectionActions headless component
 */
export interface CollectionActionsProps {
  /** Render prop function that receives collection actions data */
  children: (props: CollectionActionsRenderProps) => React.ReactNode;
}

/**
 * Render props for CollectionActions component
 */
export interface CollectionActionsRenderProps {
  /** Function to refresh the collection */
  refresh: () => Promise<void>;
  /** Function to load more products */
  loadMore: () => Promise<void>;
  /** Whether actions are loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Headless component for collection actions (refresh, load more)
 * Replaces traditional pagination for V3 API
 */
export const CollectionActions = (props: CollectionActionsProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  // Error handling for undefined service
  if (!service) {
    console.error("CollectionService is undefined in CollectionActions");
    return props.children({
      refresh: async () => {},
      loadMore: async () => {},
      isLoading: false,
      error: "Service not available",
    });
  }

  try {
    const isLoading = service.isLoading?.get() || false;
    const error = service.error?.get() || null;

    return props.children({
      refresh: service.refresh || (async () => {}),
      loadMore: service.loadMore || (async () => {}),
      isLoading,
      error,
    });
  } catch (err) {
    console.error("Error in CollectionActions:", err);
    return props.children({
      refresh: async () => {},
      loadMore: async () => {},
      isLoading: false,
      error: "Failed to load actions",
    });
  }
};

// Namespace export for clean API
export const Collection = {
  ProductGrid,
  ProductCard,
  LoadMoreProducts,
  CollectionHeader,
  CollectionActions,
} as const;
