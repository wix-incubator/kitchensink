import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { MediaGalleryServiceDefinition } from "../services/media-gallery-service";

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
  /** Media URL */
  src: string | null;
  /** Alt text for media */
  alt: string;
}

/**
 * Headless component for displaying the main viewport media
 */
export const Viewport = (props: ViewportProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const mediaToDisplay = mediaService.mediaToDisplay.get();

  if (mediaToDisplay.length === 0) {
    return null;
  }

  // Get the current media from the relevant media array
  const src = mediaToDisplay[currentIndex].image!;
  const alt = mediaToDisplay[currentIndex].altText!;

  return props.children({
    src,
    alt,
  });
};

/**
 * Props for ThumbnailList headless component
 */
export interface ThumbnailListProps {
  /** Render prop function that receives thumbnail list data */
  children: (props: ThumbnailListRenderProps) => React.ReactNode;
}

/**
 * Render props for ThumbnailList component
 */
export interface ThumbnailListRenderProps {
  /** Array of media items */
  items: any[];
}

/**
 * Headless component for managing a list of thumbnails
 */
export const ThumbnailList = (props: ThumbnailListProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const mediaToDisplay = mediaService.mediaToDisplay.get();

  if (mediaToDisplay.length <= 1) {
    return null;
  }

  return props.children({
    items: mediaToDisplay,
  });
};

/**
 * Props for ThumbnailItem headless component
 */
export interface ThumbnailItemProps {
  /** Index of the media item */
  index: number;
  /** Render prop function that receives thumbnail data */
  children: (props: ThumbnailItemRenderProps) => React.ReactNode;
}

/**
 * Render props for ThumbnailItem component
 */
export interface ThumbnailItemRenderProps {
  /** Media item data */
  item: any | null; // V3 media item structure
  /** Thumbnail image URL */
  src: string | null;
  /** Whether this thumbnail is currently active */
  isActive: boolean;
  /** Function to select this media */
  onSelect: () => void;
  /** Index of this thumbnail */
  index: number;
  /** Alt text for thumbnail */
  alt: string;
}

/**
 * Headless component for individual media thumbnail
 */
export const ThumbnailItem = (props: ThumbnailItemProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const mediaToDisplay = mediaService.mediaToDisplay.get();

  if (mediaToDisplay.length === 0) {
    return null;
  }

  // Get the image source from the centralized relevant images
  const src = mediaToDisplay[props.index].image!;
  const alt = mediaToDisplay[props.index].altText!;

  const isActive = currentIndex === props.index;

  const onSelect = () => {
    mediaService.setSelectedMediaIndex(props.index);
  };

  return props.children({
    item: mediaToDisplay[props.index],
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
  /** Function to go to next media */
  onNext: () => void;
  /** Whether there is a next media available */
  canGoNext: boolean;
}

/**
 * Headless component for next media navigation
 */
export const Next = (props: NextProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const totalMedia = mediaService.totalMedia.get();
  const canGoNext = currentIndex < totalMedia - 1;

  if (totalMedia <= 1) {
    return null;
  }

  return props.children({
    onNext: mediaService.nextMedia,
    canGoNext,
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
  /** Function to go to previous media */
  onPrevious: () => void;
  /** Whether there is a previous media available */
  canGoPrevious: boolean;
}

/**
 * Headless component for previous media navigation
 */
export const Previous = (props: PreviousProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const totalMedia = mediaService.totalMedia.get();
  const canGoPrevious = currentIndex > 0;

  if (totalMedia <= 1) {
    return null;
  }

  return props.children({
    onPrevious: mediaService.previousMedia,
    canGoPrevious,
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
  /** Current media index (1-based for display) */
  current: number;
  /** Total number of media */
  total: number;
}

/**
 * Headless component for media gallery indicator/counter
 */
export const Indicator = (props: IndicatorProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const totalMedia = mediaService.totalMedia.get();

  if (totalMedia <= 1) {
    return null;
  }

  return props.children({
    current: currentIndex + 1,
    total: totalMedia,
  });
};
