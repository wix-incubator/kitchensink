import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { BookingServicesServiceDefinition } from "./booking-services-service";
import { services } from "@wix/bookings";

/**
 * Props for ServiceGrid headless component
 */
export interface ServiceGridProps {
  /** Render prop function that receives services data */
  children: (props: ServiceGridRenderProps) => React.ReactNode;
}

/**
 * Render props for ServiceGrid component
 */
export interface ServiceGridRenderProps {
  /** Array of booking services */
  services: services.Service[];
  /** Whether services are currently loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Whether there are any services */
  hasServices: boolean;
  /** Total number of services */
  totalServices: number;
  /** Whether the grid is empty */
  isEmpty: boolean;
  /** Function to refresh services */
  refreshServices: () => Promise<void>;
}

/**
 * ServiceGrid - Displays all available booking services
 */
export const ServiceGrid = (props: ServiceGridProps) => {
  const service = useService(BookingServicesServiceDefinition) as ServiceAPI<
    typeof BookingServicesServiceDefinition
  >;

  const services = service.services.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();
  const hasServices = service.hasServices();
  const totalServices = service.totalServices();

  return props.children({
    services,
    isLoading,
    error,
    hasServices,
    totalServices,
    isEmpty: !isLoading && !hasServices,
    refreshServices: service.refreshServices,
  });
};

/**
 * Props for ServiceCard headless component
 */
export interface ServiceCardProps {
  /** The service to render */
  service: services.Service;
  /** Render prop function that receives service data */
  children: (props: ServiceCardRenderProps) => React.ReactNode;
}

/**
 * Render props for ServiceCard component
 */
export interface ServiceCardRenderProps {
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
  /** Service booking URL */
  bookingUrl: string;
  /** Whether service is hidden */
  isHidden: boolean;
  /** Service location names */
  locations: string[];
}

/**
 * ServiceCard - Renders data for a single booking service
 */
export const ServiceCard = (props: ServiceCardProps) => {
  const { service } = props;

  // Format price
  let price = "Contact for pricing";
  if (service.payment?.rateType === "FIXED" && service.payment.fixed?.price) {
    const fixedPrice = service.payment.fixed.price;
    price = `${fixedPrice.currency} ${
      fixedPrice.formattedValue || fixedPrice.value
    }`;
  } else if (
    service.payment?.rateType === "VARIED" &&
    service.payment.varied?.defaultPrice
  ) {
    const variedPrice = service.payment.varied.defaultPrice;
    price = `${variedPrice.currency} ${
      variedPrice.formattedValue || variedPrice.value
    }`;
  } else if (service.payment?.rateType === "NO_FEE") {
    price = "Free";
  } else if (
    service.payment?.rateType === "CUSTOM" &&
    service.payment.custom?.description
  ) {
    price = service.payment.custom.description;
  }

  // Get duration from availability constraints
  const duration =
    service.schedule?.availabilityConstraints?.sessionDurations?.[0];

  // Get image
  const image =
    service.media?.mainMedia || service.media?.coverMedia;

  // Get booking URL
  const bookingUrl = `/bookings/${service._id}`;

  // Get locations
  const locations =
    service.locations?.map(
      (loc) =>
        loc.business?.name ||
        loc.custom?.address?.formatted ||
        loc.calculatedAddress?.formatted ||
        "Location TBD"
    ) || [];

  return props.children({
    serviceId: service._id || "",
    name: service.name || "Untitled Service",
    description: service.description || undefined,
    tagLine: service.tagLine || undefined,
    type: service.type || "APPOINTMENT",
    canBookOnline: service.onlineBooking?.enabled === true,
    duration,
    price,
    category: service.category?.name || undefined,
    image,
    bookingUrl,
    isHidden: service.hidden === true,
    locations,
  });
};

/**
 * Props for ServicesHeader headless component
 */
export interface ServicesHeaderProps {
  /** Render prop function that receives header data */
  children: (props: ServicesHeaderRenderProps) => React.ReactNode;
}

/**
 * Render props for ServicesHeader component
 */
export interface ServicesHeaderRenderProps {
  /** Total number of services */
  totalServices: number;
  /** Whether services are loading */
  isLoading: boolean;
  /** Whether there are any services */
  hasServices: boolean;
  /** Services summary text */
  summaryText: string;
}

/**
 * ServicesHeader - Displays summary information about services
 */
export const ServicesHeader = (props: ServicesHeaderProps) => {
  const service = useService(BookingServicesServiceDefinition) as ServiceAPI<
    typeof BookingServicesServiceDefinition
  >;

  const totalServices = service.totalServices();
  const isLoading = service.isLoading.get();
  const hasServices = service.hasServices();

  const summaryText =
    !isLoading && hasServices
      ? `${totalServices} service${totalServices !== 1 ? "s" : ""} available`
      : "";

  return props.children({
    totalServices,
    isLoading,
    hasServices,
    summaryText,
  });
};

/**
 * BookingServices namespace containing all booking service headless components
 */
export const BookingServices = {
  ServiceGrid,
  ServiceCard,
  ServicesHeader,
} as const;
