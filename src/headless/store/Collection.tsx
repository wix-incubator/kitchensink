import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CollectionServiceDefinition } from "./collection-service";
import { products, productsV3 } from "@wix/stores";

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
}

/**
 * Headless component for product grid
 */
export const ProductGrid = (props: ProductGridProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  const productList = service.products.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  return props.children({
    products: productList,
    isLoading,
    error,
    isEmpty: productList.length === 0 && !isLoading,
    totalProducts: productList.length,
  });
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
  /** Whether there are more products to load */
  hasMore: boolean;
  /** Whether load more is currently loading */
  isLoading: boolean;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Headless component for load more products functionality
 */
export const LoadMoreProducts = (props: LoadMoreProductsProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  const hasMore = service.hasMore.get();
  const isLoading = service.isLoading.get();
  const currentPage = service.currentPage.get();
  const totalPages = service.totalPages.get();

  return props.children({
    loadMore: service.loadMore,
    hasMore,
    isLoading,
    currentPage,
    totalPages,
  });
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

  const productList = service.products.get();
  const isLoading = service.isLoading.get();

  return props.children({
    totalProducts: productList.length,
    isLoading,
    hasProducts: productList.length > 0,
  });
};

/**
 * Props for CollectionPagination headless component
 */
export interface CollectionPaginationProps {
  /** Render prop function that receives pagination data */
  children: (props: CollectionPaginationRenderProps) => React.ReactNode;
}

/**
 * Render props for CollectionPagination component
 */
export interface CollectionPaginationRenderProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there's a previous page */
  hasPrevious: boolean;
  /** Whether there's a next page */
  hasNext: boolean;
  /** Function to go to specific page */
  goToPage: (page: number) => Promise<void>;
  /** Whether pagination is loading */
  isLoading: boolean;
}

/**
 * Headless component for collection pagination
 */
export const CollectionPagination = (props: CollectionPaginationProps) => {
  const service = useService(CollectionServiceDefinition) as ServiceAPI<
    typeof CollectionServiceDefinition
  >;

  const currentPage = service.currentPage.get();
  const totalPages = service.totalPages.get();
  const isLoading = service.isLoading.get();

  return props.children({
    currentPage,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
    goToPage: service.goToPage,
    isLoading,
  });
};

// Namespace export for clean API
export const Collection = {
  ProductGrid,
  ProductCard,
  LoadMoreProducts,
  CollectionHeader,
  CollectionPagination,
} as const;
