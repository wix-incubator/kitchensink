import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import {
  BookingSelectionServiceDefinition,
  type BookingSummary as BookingSummaryData,
} from "../services/booking-selection-service";
import { services, availabilityCalendar } from "@wix/bookings";

/**
 * Props for BookingSummary headless component
 */
export interface BookingSummaryProps {
  /** Render prop function that receives booking summary data */
  children: (props: BookingSummaryRenderProps) => React.ReactNode;
}

/**
 * Render props for BookingSummary component
 */
export interface BookingSummaryRenderProps {
  /** Booking summary data */
  summary: BookingSummaryData | null;
  /** Whether user has made a selection */
  hasSelection: boolean;
  /** Whether booking can proceed */
  canBook: boolean;
  /** Whether booking is in progress */
  isBooking: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to proceed to checkout */
  proceedToCheckout: () => Promise<void>;
  /** Function to clear selection */
  clearSelection: () => void;
}

/**
 * BookingSummary - Displays booking summary and checkout controls
 */
export const BookingSummary = (props: BookingSummaryProps) => {
  const service = useService(BookingSelectionServiceDefinition) as ServiceAPI<
    typeof BookingSelectionServiceDefinition
  >;

  const summary = service.getBookingSummary();
  const hasSelection = service.hasSelection();
  const canBook = service.canBook();
  const isBooking = service.isBooking.get();
  const error = service.error.get();

  return props.children({
    summary,
    hasSelection,
    canBook,
    isBooking,
    error,
    proceedToCheckout: service.proceedToCheckout,
    clearSelection: service.clearSelection,
  });
};

/**
 * Props for ServiceSelector headless component
 */
export interface ServiceSelectorProps {
  /** Available services to select from */
  services: services.Service[];
  /** Render prop function that receives service selector data */
  children: (props: ServiceSelectorRenderProps) => React.ReactNode;
}

/**
 * Render props for ServiceSelector component
 */
export interface ServiceSelectorRenderProps {
  /** Currently selected service */
  selectedService: services.Service | null;
  /** Available services */
  services: services.Service[];
  /** Whether a service is selected */
  hasSelectedService: boolean;
  /** Function to select a service */
  selectService: (service: services.Service) => void;
  /** Function to check if a service is selected */
  isServiceSelected: (serviceId: string) => boolean;
}

/**
 * ServiceSelector - Handles service selection for booking
 */
export const ServiceSelector = (props: ServiceSelectorProps) => {
  const service = useService(BookingSelectionServiceDefinition) as ServiceAPI<
    typeof BookingSelectionServiceDefinition
  >;

  const selectedService = service.selectedService.get();
  const hasSelectedService = selectedService !== null;

  const isServiceSelected = (serviceId: string): boolean => {
    return selectedService?._id === serviceId;
  };

  return props.children({
    selectedService,
    services: props.services,
    hasSelectedService,
    selectService: service.selectService,
    isServiceSelected,
  });
};

/**
 * Props for SlotSelector headless component
 */
export interface SlotSelectorProps {
  /** Available slots to select from */
  slots: availabilityCalendar.SlotAvailability[];
  /** Render prop function that receives slot selector data */
  children: (props: SlotSelectorRenderProps) => React.ReactNode;
}

/**
 * Render props for SlotSelector component
 */
export interface SlotSelectorRenderProps {
  /** Currently selected slot */
  selectedSlot: availabilityCalendar.SlotAvailability | null;
  /** Available slots */
  slots: availabilityCalendar.SlotAvailability[];
  /** Whether a slot is selected */
  hasSelectedSlot: boolean;
  /** Function to select a slot */
  selectSlot: (slot: availabilityCalendar.SlotAvailability) => void;
  /** Function to check if a slot is selected */
  isSlotSelected: (slot: availabilityCalendar.SlotAvailability) => boolean;
}

/**
 * SlotSelector - Handles time slot selection for booking
 */
export const SlotSelector = (props: SlotSelectorProps) => {
  const service = useService(BookingSelectionServiceDefinition) as ServiceAPI<
    typeof BookingSelectionServiceDefinition
  >;

  const selectedSlot = service.selectedSlot.get();
  const hasSelectedSlot = selectedSlot !== null;

  const isSlotSelected = (
    slot: availabilityCalendar.SlotAvailability
  ): boolean => {
    return (
      selectedSlot?.slot?.startDate === slot.slot?.startDate &&
      selectedSlot?.slot?.endDate === slot.slot?.endDate
    );
  };

  return props.children({
    selectedSlot,
    slots: props.slots,
    hasSelectedSlot,
    selectSlot: service.selectSlot,
    isSlotSelected,
  });
};

/**
 * Props for BookingProgress headless component
 */
export interface BookingProgressProps {
  /** Render prop function that receives booking progress data */
  children: (props: BookingProgressRenderProps) => React.ReactNode;
}

/**
 * Render props for BookingProgress component
 */
export interface BookingProgressRenderProps {
  /** Current step in the booking process */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Whether service is selected */
  hasService: boolean;
  /** Whether slot is selected */
  hasSlot: boolean;
  /** Whether booking can proceed */
  canProceed: boolean;
  /** Step labels */
  steps: string[];
  /** Progress percentage */
  progressPercentage: number;
}

/**
 * BookingProgress - Displays booking progress and steps
 */
export const BookingProgress = (props: BookingProgressProps) => {
  const service = useService(BookingSelectionServiceDefinition) as ServiceAPI<
    typeof BookingSelectionServiceDefinition
  >;

  const selectedService = service.selectedService.get();
  const selectedSlot = service.selectedSlot.get();
  const canBook = service.canBook();

  const hasService = selectedService !== null;
  const hasSlot = selectedSlot !== null;

  const steps = ["Select Service", "Choose Time", "Confirm & Book"];
  const totalSteps = steps.length;

  let currentStep = 0;
  if (hasService) currentStep = 1;
  if (hasSlot) currentStep = 2;
  if (canBook) currentStep = 3;

  const progressPercentage = (currentStep / totalSteps) * 100;

  return props.children({
    currentStep,
    totalSteps,
    hasService,
    hasSlot,
    canProceed: canBook,
    steps,
    progressPercentage,
  });
};

/**
 * Props for BookingError headless component
 */
export interface BookingErrorProps {
  /** Render prop function that receives error data */
  children: (props: BookingErrorRenderProps) => React.ReactNode;
}

/**
 * Render props for BookingError component
 */
export interface BookingErrorRenderProps {
  /** Error message */
  error: string | null;
  /** Whether there is an error */
  hasError: boolean;
  /** Function to clear error */
  clearError: () => void;
}

/**
 * BookingError - Displays booking errors
 */
export const BookingError = (props: BookingErrorProps) => {
  const service = useService(BookingSelectionServiceDefinition) as ServiceAPI<
    typeof BookingSelectionServiceDefinition
  >;

  const error = service.error.get();
  const hasError = error !== null;

  const clearError = () => {
    service.error.set(null);
  };

  return props.children({
    error,
    hasError,
    clearError,
  });
};

