import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { BookingServiceServiceDefinition } from '../services/booking-service-service';
import { services } from '@wix/bookings';

export type ServicePropsChildren = (
  props: ServiceRenderProps
) => React.ReactNode;
/**
 * Props for Service headless component
 */
export interface ServiceProps {
  /** Render prop function that receives service data */
  children: ServicePropsChildren;
}

export type LoadService = (serviceId: string) => Promise<void>;
export type RefreshService = () => Promise<void>;
/**
 * Render props for Service component
 */
export interface ServiceRenderProps {
  /** The loaded service */
  service: services.Service | null;
  /** Whether service is currently loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Whether service is loaded */
  hasService: boolean;
  /** Function to load a service by ID */
  loadService: LoadService;
  /** Function to refresh the current service */
  refreshService: RefreshService;
}

/**
 * Service - Loads and provides a single service by ID
 * @component
 */
export const Service = (props: ServiceProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();
  const hasService = service.hasService();

  return props.children({
    service: serviceData,
    isLoading,
    error,
    hasService,
    loadService: service.loadService,
    refreshService: service.refreshService,
  });
};

export type ServiceHeaderChildren = (
  props: ServiceHeaderRenderProps
) => React.ReactNode;
/**
 * Props for ServiceHeader headless component
 */
export interface ServiceHeaderProps {
  /** Render prop function that receives service header data */
  children: ServiceHeaderChildren;
}

/**
 * Render props for ServiceHeader component
 */
export interface ServiceHeaderRenderProps {
  /** Service ID */
  serviceId: string;
  /** Service name */
  name: string;
  /** Service tag line */
  tagLine?: string;
  /** Service type (APPOINTMENT, CLASS, COURSE) */
  type: string;
  /** Service category name */
  category?: string;
}

/**
 * ServiceHeader - Renders header information for the service
 * @component
 */
export const ServiceHeader = (props: ServiceHeaderProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  return props.children({
    serviceId: serviceData._id || '',
    name: serviceData.name || 'Untitled Service',
    tagLine: serviceData.tagLine || undefined,
    type: serviceData.type || 'APPOINTMENT',
    category: serviceData.category?.name || undefined,
  });
};

export type ServiceDescriptionChildren = (
  props: ServiceDescriptionRenderProps
) => React.ReactNode;
/**
 * Props for ServiceDescription headless component
 */
export interface ServiceDescriptionProps {
  /** Render prop function that receives service description data */
  children: ServiceDescriptionChildren;
}

/**
 * Render props for ServiceDescription component
 */
export interface ServiceDescriptionRenderProps {
  /** Service description */
  description?: string;
  /** Whether service has description */
  hasDescription: boolean;
}

/**
 * ServiceDescription - Renders description information for the service
 * @component
 */
export const ServiceDescription = (
  props: ServiceDescriptionProps
): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  const description = serviceData.description || undefined;
  const hasDescription = Boolean(description);

  return props.children({
    description,
    hasDescription,
  });
};

export type ServiceMediaChildren = (
  props: ServiceMediaRenderProps
) => React.ReactNode;
/**
 * Props for ServiceMedia headless component
 */
export interface ServiceMediaProps {
  /** Render prop function that receives service media data */
  children: ServiceMediaChildren;
}

/**
 * Render props for ServiceMedia component
 */
export interface ServiceMediaRenderProps {
  /** Service main image */
  image?: services.MediaItem;
  /** Whether service has image */
  hasImage: boolean;
  /** Service cover media */
  coverImage?: services.MediaItem;
  /** Whether service has cover image */
  hasCoverImage: boolean;
}

/**
 * ServiceMedia - Renders media information for the service
 * @component
 */
export const ServiceMedia = (props: ServiceMediaProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  const image = serviceData.media?.mainMedia;
  const coverImage = serviceData.media?.coverMedia;

  return props.children({
    image,
    hasImage: Boolean(image),
    coverImage,
    hasCoverImage: Boolean(coverImage),
  });
};

export type ServiceDetailsChildren = (
  props: ServiceDetailsRenderProps
) => React.ReactNode;

/**
 * Props for ServiceDetails headless component
 */
export interface ServiceDetailsProps {
  /** Render prop function that receives service details data */
  children: ServiceDetailsChildren;
}

/**
 * Render props for ServiceDetails component
 */
export interface ServiceDetailsRenderProps {
  /** Service duration if available */
  duration?: number;
  /** Whether service has duration */
  hasDuration: boolean;
  /** Formatted price string */
  price: string;
  /** Whether service has online booking enabled */
  canBookOnline: boolean;
  /** Whether service is hidden */
  isHidden: boolean;
  /** Raw payment information */
  payment?: services.Service['payment'];
}

/**
 * ServiceDetails - Renders detail information for the service
 * @component
 */
export const ServiceDetails = (props: ServiceDetailsProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  // Format price
  let price = 'Contact for pricing';
  if (
    serviceData.payment?.rateType === 'FIXED' &&
    serviceData.payment.fixed?.price
  ) {
    const fixedPrice = serviceData.payment.fixed.price;
    price = `${fixedPrice.currency} ${
      fixedPrice.formattedValue || fixedPrice.value
    }`;
  } else if (
    serviceData.payment?.rateType === 'VARIED' &&
    serviceData.payment.varied?.defaultPrice
  ) {
    const variedPrice = serviceData.payment.varied.defaultPrice;
    price = `${variedPrice.currency} ${
      variedPrice.formattedValue || variedPrice.value
    }`;
  } else if (serviceData.payment?.rateType === 'NO_FEE') {
    price = 'Free';
  } else if (
    serviceData.payment?.rateType === 'CUSTOM' &&
    serviceData.payment.custom?.description
  ) {
    price = serviceData.payment.custom.description;
  }

  // Get duration from availability constraints
  const duration =
    serviceData.schedule?.availabilityConstraints?.sessionDurations?.[0];

  return props.children({
    duration,
    hasDuration: Boolean(duration),
    price,
    canBookOnline: serviceData.onlineBooking?.enabled === true,
    isHidden: serviceData.hidden === true,
    payment: serviceData.payment,
  });
};

export type ServiceLocationsChildren = (
  props: ServiceLocationsRenderProps
) => React.ReactNode;
/**
 * Props for ServiceLocations headless component
 */
export interface ServiceLocationsProps {
  /** Render prop function that receives service locations data */
  children: ServiceLocationsChildren;
}

/**
 * Render props for ServiceLocations component
 */
export interface ServiceLocationsRenderProps {
  /** Service location names */
  locations: string[];
  /** Whether service has locations */
  hasLocations: boolean;
  /** Raw location data */
  rawLocations?: services.Service['locations'];
}

/**
 * ServiceLocations - Renders location information for the service
 * @component
 */
export const ServiceLocations = (
  props: ServiceLocationsProps
): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  // Get locations
  const locations =
    serviceData.locations?.map(
      loc =>
        loc.business?.name ||
        loc.custom?.address?.formatted ||
        loc.calculatedAddress?.formatted ||
        'Location TBD'
    ) || [];

  return props.children({
    locations,
    hasLocations: locations.length > 0,
    rawLocations: serviceData.locations,
  });
};

export type ServiceActionsChildren = (
  props: ServiceActionsRenderProps
) => React.ReactNode;
/**
 * Props for ServiceActions headless component
 */
export interface ServiceActionsProps {
  /** Render prop function that receives service actions data */
  children: ServiceActionsChildren;
}

/**
 * Render props for ServiceActions component
 */
export interface ServiceActionsRenderProps {
  /** Service ID for booking */
  serviceId: string;
  /** Whether service can be booked online */
  canBookOnline: boolean;
  /** Whether service is available for booking */
  isAvailable: boolean;
  /** Booking URL if available */
  bookingUrl?: string;
}

/**
 * ServiceActions - Renders action information for the service
 * @component
 */
export const ServiceActions = (props: ServiceActionsProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  const serviceId = serviceData._id || '';
  const canBookOnline = serviceData.onlineBooking?.enabled === true;
  const isAvailable = canBookOnline && !serviceData.hidden;

  return props.children({
    serviceId,
    canBookOnline,
    isAvailable,
    bookingUrl: isAvailable
      ? `/bookings/example-2/book/${serviceId}`
      : undefined,
  });
};

export type ServiceDetailChildren = (
  props: ServiceDetailRenderProps
) => React.ReactNode;

/**
 * Props for ServiceDetail headless component
 */
export interface ServiceDetailProps {
  /** Render prop function that receives service detail data */
  children: ServiceDetailChildren;
}

/**
 * Render props for ServiceDetail component
 */
export interface ServiceDetailRenderProps {
  /** Service ID */
  serviceId: string;
  /** Service name */
  name: string;
  /** Service description */
  description?: string;
  /** Service tag line */
  tagLine?: string;
  /** Service type (APPOINTMENT, CLASS, COURSE) */
  type: string;
  /** Whether service has online booking enabled */
  canBookOnline: boolean;
  /** Service duration if available */
  duration?: number;
  /** Formatted price string */
  price: string;
  /** Service category name */
  category?: string;
  /** Service image */
  image?: services.MediaItem;
  /** Whether service is hidden */
  isHidden: boolean;
  /** Service location names */
  locations: string[];
}

/**
 * ServiceDetail - Renders detailed data for the loaded service (comprehensive component)
 * @component
 */
export const ServiceDetail = (props: ServiceDetailProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const serviceData = service.service.get();

  if (!serviceData) {
    return null;
  }

  // Format price
  let price = 'Contact for pricing';
  if (
    serviceData.payment?.rateType === 'FIXED' &&
    serviceData.payment.fixed?.price
  ) {
    const fixedPrice = serviceData.payment.fixed.price;
    price = `${fixedPrice.currency} ${
      fixedPrice.formattedValue || fixedPrice.value
    }`;
  } else if (
    serviceData.payment?.rateType === 'VARIED' &&
    serviceData.payment.varied?.defaultPrice
  ) {
    const variedPrice = serviceData.payment.varied.defaultPrice;
    price = `${variedPrice.currency} ${
      variedPrice.formattedValue || variedPrice.value
    }`;
  } else if (serviceData.payment?.rateType === 'NO_FEE') {
    price = 'Free';
  } else if (
    serviceData.payment?.rateType === 'CUSTOM' &&
    serviceData.payment.custom?.description
  ) {
    price = serviceData.payment.custom.description;
  }

  // Get duration from availability constraints
  const duration =
    serviceData.schedule?.availabilityConstraints?.sessionDurations?.[0];

  // Get image
  const image = serviceData.media?.mainMedia || serviceData.media?.coverMedia;

  // Get locations
  const locations =
    serviceData.locations?.map(
      loc =>
        loc.business?.name ||
        loc.custom?.address?.formatted ||
        loc.calculatedAddress?.formatted ||
        'Location TBD'
    ) || [];

  return props.children({
    serviceId: serviceData._id || '',
    name: serviceData.name || 'Untitled Service',
    description: serviceData.description || undefined,
    tagLine: serviceData.tagLine || undefined,
    type: serviceData.type || 'APPOINTMENT',
    canBookOnline: serviceData.onlineBooking?.enabled === true,
    duration,
    price,
    category: serviceData.category?.name || undefined,
    image,
    isHidden: serviceData.hidden === true,
    locations,
  });
};

export type ServiceStatusChildren = (
  props: ServiceStatusRenderProps
) => React.ReactNode;
/**
 * Props for ServiceStatus headless component
 */
export interface ServiceStatusProps {
  /** Render prop function that receives service status data */
  children: ServiceStatusChildren;
}

/**
 * Render props for ServiceStatus component
 */
export interface ServiceStatusRenderProps {
  /** Whether service is currently loading */
  isLoading: boolean;
  /** Whether service is loaded */
  hasService: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether there is an error */
  hasError: boolean;
  /** Whether the service was not found */
  notFound: boolean;
}

/**
 * A headless component that provides service status functionality using the render props pattern.
 *
 * This component manages the state and actions for service status checking, allowing consumers
 * to render their own UI while accessing the underlying service status functionality.
 * @example
 * ```tsx
 * <ServiceStatus>
 *   {({ isLoading, hasService, error, hasError, notFound }) => (
 *     <div>
 *       {isLoading && <div>Loading service...</div>}
 *       {hasError && <div className="error">{error}</div>}
 *       {notFound && <div>Service not found</div>}
 *       {hasService && <div>Service is available</div>}
 *     </div>
 *   )}
 * </ServiceStatus>
 * ```
 * @component
 */
export const ServiceStatus = (props: ServiceStatusProps): React.ReactNode => {
  const service = useService(BookingServiceServiceDefinition) as ServiceAPI<
    typeof BookingServiceServiceDefinition
  >;

  const isLoading = service.isLoading.get();
  const hasService = service.hasService();
  const error = service.error.get();
  const hasError = error !== null;

  // Service is considered not found if we're not loading, there's no error, but also no service
  const notFound = !isLoading && !hasError && !hasService;

  return props.children({
    isLoading,
    hasService,
    error,
    hasError,
    notFound,
  });
};
