import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { ProductMediaGalleryServiceDefinition } from "./product-media-gallery-service";

/**
 * Props for SelectedImage headless component
 */
export interface SelectedImageProps {
  /** Render prop function that receives selected image data */
  children: (props: SelectedImageRenderProps) => React.ReactNode;
}

/**
 * Render props for SelectedImage component
 */
export interface SelectedImageRenderProps {
  /** Current selected image */
  image: any | null; // V3 media item structure
  /** Image URL */
  imageUrl: string | null;
  /** Alt text for image */
  altText: string;
  /** Whether image is loading */
  isLoading: boolean;
  /** Current image index */
  currentIndex: number;
  /** Total number of images */
  totalImages: number;
}

/**
 * Headless component for displaying the currently selected product image
 */
export const SelectedImage = (props: SelectedImageProps) => {
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
  const imageUrl = product?.media?.main?.image || null;
  const altText = productName || "Product image";

  return props.children({
    image: selectedImage,
    imageUrl,
    altText,
    isLoading,
    currentIndex,
    totalImages,
  });
};

/**
 * Props for MediaItemThumbnail headless component
 */
export interface MediaItemThumbnailProps {
  /** Index of the media item */
  index: number;
  /** Render prop function that receives thumbnail data */
  children: (props: MediaItemThumbnailRenderProps) => React.ReactNode;
}

/**
 * Render props for MediaItemThumbnail component
 */
export interface MediaItemThumbnailRenderProps {
  /** Media item data */
  mediaItem: any | null; // V3 media item structure
  /** Thumbnail image URL */
  imageUrl: string | null;
  /** Whether this thumbnail is currently selected */
  isActive: boolean;
  /** Function to select this image */
  selectImage: () => void;
  /** Index of this thumbnail */
  index: number;
  /** Alt text for thumbnail */
  altText: string;
}

/**
 * Headless component for individual media item thumbnail
 */
export const MediaItemThumbnail = (props: MediaItemThumbnailProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const product = mediaService.product.get();
  const currentIndex = mediaService.selectedImageIndex.get();
  const productName = mediaService.productName.get();

  // Use actual v3 media structure - for now, only show main image
  // Most v3 products seem to have only media.main, not itemsInfo.items
  const imageUrl =
    props.index === 0 ? product?.media?.main?.image || null : null;
  const isActive = currentIndex === props.index;
  const altText = `${productName || "Product"} image ${props.index + 1}`;

  const selectImage = () => {
    mediaService.setSelectedImageIndex(props.index);
  };

  // Only show thumbnail for index 0 (main image)
  if (props.index > 0) {
    return null;
  }

  return props.children({
    mediaItem: product?.media?.main || null,
    imageUrl,
    isActive,
    selectImage,
    index: props.index,
    altText,
  });
};

/**
 * Props for NextImageButton headless component
 */
export interface NextImageButtonProps {
  /** Render prop function that receives next image action */
  children: (props: NextImageButtonRenderProps) => React.ReactNode;
}

/**
 * Render props for NextImageButton component
 */
export interface NextImageButtonRenderProps {
  /** Function to go to next image */
  nextImage: () => void;
  /** Whether there is a next image available */
  hasNext: boolean;
  /** Current image index */
  currentIndex: number;
  /** Total number of images */
  totalImages: number;
}

/**
 * Headless component for next image navigation button
 */
export const NextImageButton = (props: NextImageButtonProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const currentIndex = mediaService.selectedImageIndex.get();
  const totalImages = mediaService.totalImages.get();
  const hasNext = currentIndex < totalImages - 1;

  return props.children({
    nextImage: mediaService.nextImage,
    hasNext,
    currentIndex,
    totalImages,
  });
};

/**
 * Props for PrevImageButton headless component
 */
export interface PrevImageButtonProps {
  /** Render prop function that receives previous image action */
  children: (props: PrevImageButtonRenderProps) => React.ReactNode;
}

/**
 * Render props for PrevImageButton component
 */
export interface PrevImageButtonRenderProps {
  /** Function to go to previous image */
  prevImage: () => void;
  /** Whether there is a previous image available */
  hasPrev: boolean;
  /** Current image index */
  currentIndex: number;
  /** Total number of images */
  totalImages: number;
}

/**
 * Headless component for previous image navigation button
 */
export const PrevImageButton = (props: PrevImageButtonProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const currentIndex = mediaService.selectedImageIndex.get();
  const totalImages = mediaService.totalImages.get();
  const hasPrev = currentIndex > 0;

  return props.children({
    prevImage: mediaService.previousImage,
    hasPrev,
    currentIndex,
    totalImages,
  });
};

/**
 * Props for MediaGalleryInfo headless component
 */
export interface MediaGalleryInfoProps {
  /** Render prop function that receives gallery info */
  children: (props: MediaGalleryInfoRenderProps) => React.ReactNode;
}

/**
 * Render props for MediaGalleryInfo component
 */
export interface MediaGalleryInfoRenderProps {
  /** Current image index (1-based for display) */
  currentImage: number;
  /** Total number of images */
  totalImages: number;
  /** Whether gallery has images */
  hasImages: boolean;
}

/**
 * Headless component for media gallery information
 */
export const MediaGalleryInfo = (props: MediaGalleryInfoProps) => {
  const mediaService = useService(
    ProductMediaGalleryServiceDefinition
  ) as ServiceAPI<typeof ProductMediaGalleryServiceDefinition>;

  const currentIndex = mediaService.selectedImageIndex.get();
  const totalImages = mediaService.totalImages.get();

  return props.children({
    currentImage: currentIndex + 1,
    totalImages,
    hasImages: totalImages > 0,
  });
};

// Namespace export for clean API
export const ProductMediaGallery = {
  SelectedImage,
  MediaItemThumbnail,
  NextImageButton,
  PrevImageButton,
  MediaGalleryInfo,
} as const;
