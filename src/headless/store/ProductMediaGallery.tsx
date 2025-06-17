import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductMediaGalleryServiceDefinition } from "./product-media-gallery-service";

/**
 * Props for Viewport headless component
 */
export interface ViewportProps {
  /** Render prop function that receives viewport data */
  children: (props: ViewportRenderProps) => React.ReactNode;
}

/**
 * Render props for Viewport component
 */
export interface ViewportRenderProps {
  /** Current selected image */
  image: any | null; // V3 media item structure
  /** Image URL */
  src: string | null;
  /** Alt text for image */
  alt: string;
  /** Whether image is loading */
  isLoading: boolean;
  /** Current image index */
  currentIndex: number;
  /** Total number of images */
  totalImages: number;
}

/**
 * Headless component for displaying the main viewport image
 */
export const Viewport = (props: ViewportProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const selectedImage = mediaService.selectedImage.get();
  const currentIndex = mediaService.selectedImageIndex.get();
  const isLoading = mediaService.isLoading.get();
  const totalImages = mediaService.totalImages.get();
  const productName = mediaService.productName.get();

  // Use actual v3 media structure - images are in media.main.image
  const product = mediaService.product.get();
  const src = product?.media?.main?.image || null;
  const alt = productName || "Product image";

  return props.children({
    image: selectedImage,
    src,
    alt,
    isLoading,
    currentIndex,
    totalImages,
  });
};

/**
 * Props for Thumbnail headless component
 */
export interface ThumbnailProps {
  /** Index of the media item */
  index: number;
  /** Render prop function that receives thumbnail data */
  children: (props: ThumbnailRenderProps) => React.ReactNode;
}

/**
 * Render props for Thumbnail component
 */
export interface ThumbnailRenderProps {
  /** Media item data */
  item: any | null; // V3 media item structure
  /** Thumbnail image URL */
  src: string | null;
  /** Whether this thumbnail is currently active */
  isActive: boolean;
  /** Function to select this image */
  onSelect: () => void;
  /** Index of this thumbnail */
  index: number;
  /** Alt text for thumbnail */
  alt: string;
}

/**
 * Headless component for individual media thumbnail
 */
export const Thumbnail = (props: ThumbnailProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const product = mediaService.product.get();
  const currentIndex = mediaService.selectedImageIndex.get();
  const productName = mediaService.productName.get();

  // Use actual v3 media structure - for now, only show main image
  // Most v3 products seem to have only media.main, not itemsInfo.items
  const src = props.index === 0 ? product?.media?.main?.image || null : null;
  const isActive = currentIndex === props.index;
  const alt = `${productName || "Product"} image ${props.index + 1}`;

  const onSelect = () => {
    mediaService.setSelectedImageIndex(props.index);
  };

  // Only show thumbnail for index 0 (main image)
  if (props.index > 0) {
    return null;
  }

  return props.children({
    item: product?.media?.main || null,
    src,
    isActive,
    onSelect,
    index: props.index,
    alt,
  });
};

/**
 * Props for Next headless component
 */
export interface NextProps {
  /** Render prop function that receives next navigation data */
  children: (props: NextRenderProps) => React.ReactNode;
}

/**
 * Render props for Next component
 */
export interface NextRenderProps {
  /** Function to go to next image */
  onNext: () => void;
  /** Whether there is a next image available */
  canGoNext: boolean;
  /** Current image index */
  currentIndex: number;
  /** Total number of images */
  totalImages: number;
}

/**
 * Headless component for next image navigation
 */
export const Next = (props: NextProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const currentIndex = mediaService.selectedImageIndex.get();
  const totalImages = mediaService.totalImages.get();
  const canGoNext = currentIndex < totalImages - 1;

  return props.children({
    onNext: mediaService.nextImage,
    canGoNext,
    currentIndex,
    totalImages,
  });
};

/**
 * Props for Previous headless component
 */
export interface PreviousProps {
  /** Render prop function that receives previous navigation data */
  children: (props: PreviousRenderProps) => React.ReactNode;
}

/**
 * Render props for Previous component
 */
export interface PreviousRenderProps {
  /** Function to go to previous image */
  onPrevious: () => void;
  /** Whether there is a previous image available */
  canGoPrevious: boolean;
  /** Current image index */
  currentIndex: number;
  /** Total number of images */
  totalImages: number;
}

/**
 * Headless component for previous image navigation
 */
export const Previous = (props: PreviousProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const currentIndex = mediaService.selectedImageIndex.get();
  const totalImages = mediaService.totalImages.get();
  const canGoPrevious = currentIndex > 0;

  return props.children({
    onPrevious: mediaService.previousImage,
    canGoPrevious,
    currentIndex,
    totalImages,
  });
};

/**
 * Props for Indicator headless component
 */
export interface IndicatorProps {
  /** Render prop function that receives indicator data */
  children: (props: IndicatorRenderProps) => React.ReactNode;
}

/**
 * Render props for Indicator component
 */
export interface IndicatorRenderProps {
  /** Current image index (1-based for display) */
  current: number;
  /** Total number of images */
  total: number;
  /** Whether gallery has images */
  hasImages: boolean;
}

/**
 * Headless component for media gallery indicator/counter
 */
export const Indicator = (props: IndicatorProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const currentIndex = mediaService.selectedImageIndex.get();
  const totalImages = mediaService.totalImages.get();

  return props.children({
    current: currentIndex + 1,
    total: totalImages,
    hasImages: totalImages > 0,
  });
};

export const ProductMediaGallery = {
  Viewport,
  Thumbnail,
  Next,
  Previous,
  Indicator,
} as const;
