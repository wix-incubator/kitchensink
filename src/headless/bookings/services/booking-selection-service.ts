import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { availabilityCalendar, services } from "@wix/bookings";
import { redirects } from "@wix/redirects";

export interface BookingSelectionServiceAPI {
  selectedService: Signal<services.Service | null>;
  selectedSlot: Signal<availabilityCalendar.SlotAvailability | null>;
  isBooking: Signal<boolean>;
  error: Signal<string | null>;
  hasSelection: () => boolean;
  canBook: () => boolean;
  getBookingSummary: () => BookingSummary | null;
  selectService: (service: services.Service) => void;
  selectSlot: (slot: availabilityCalendar.SlotAvailability) => void;
  clearSelection: () => void;
  proceedToCheckout: () => Promise<void>;
}

export interface BookingSummary {
  serviceName: string;
  serviceDescription?: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number;
  price?: string;
  location?: string;
}

export const BookingSelectionServiceDefinition =
  defineService<BookingSelectionServiceAPI>("bookingSelectionService");

export const BookingSelectionService = implementService.withConfig<{
  timezone?: string;
  returnUrl?: string;
  redirectToCheckout?: (url: string) => void;
}>()(BookingSelectionServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const selectedService: Signal<services.Service | null> =
    signalsService.signal(null as any);
  const selectedSlot: Signal<availabilityCalendar.SlotAvailability | null> =
    signalsService.signal(null as any);
  const isBooking: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Computed functions
  const hasSelection = (): boolean => {
    return selectedService.get() !== null && selectedSlot.get() !== null;
  };

  const canBook = (): boolean => {
    const slot = selectedSlot.get();
    const service = selectedService.get();
    return (
      hasSelection() &&
      slot?.bookable === true &&
      service?.onlineBooking?.enabled === true &&
      !isBooking.get()
    );
  };

  const getBookingSummary = (): BookingSummary | null => {
    const service = selectedService.get();
    const slot = selectedSlot.get();

    if (!service || !slot) {
      return null;
    }

    const startTime = new Date(slot.slot?.startDate || "");
    const endTime = new Date(slot.slot?.endDate || "");
    const duration = Math.round(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    ); // duration in minutes

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

    // Format location
    let location = "Location TBD";
    if (slot.slot?.location?.formattedAddress) {
      location = slot.slot.location.formattedAddress;
    } else if (slot.slot?.location?.name) {
      location = slot.slot.location.name;
    }

    return {
      serviceName: service.name || "Service",
      serviceDescription: service.description || undefined,
      startTime: startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: startTime.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      duration,
      price,
      location,
    };
  };

  // Actions
  const selectService = (service: services.Service): void => {
    selectedService.set(service);
    // Clear slot when service changes
    selectedSlot.set(null);
    error.set(null);
  };

  const selectSlot = (slot: availabilityCalendar.SlotAvailability): void => {
    selectedSlot.set(slot);
    error.set(null);
  };

  const clearSelection = (): void => {
    selectedService.set(null);
    selectedSlot.set(null);
    error.set(null);
  };

  const proceedToCheckout = async (): Promise<void> => {
    if (!canBook()) {
      error.set("Cannot proceed to checkout");
      return;
    }

    const slot = selectedSlot.get();
    if (!slot) {
      error.set("No slot selected");
      return;
    }

    try {
      isBooking.set(true);
      error.set(null);

      const timezone = config.timezone || "UTC";

      // Ensure we have a full URL for the callback
      let returnUrl = config.returnUrl || "/bookings";
      if (!returnUrl.startsWith("http")) {
        // If it's a relative path, make it a full URL
        returnUrl = `${window.location.origin}${
          returnUrl.startsWith("/") ? "" : "/"
        }${returnUrl}`;
      }

      const response = await redirects.createRedirectSession({
        bookingsCheckout: {
          slotAvailability: slot,
          timezone: timezone,
        },
        preferences: { useGenericWixPages: false },
        callbacks: {
          postFlowUrl: returnUrl,
          cartPageUrl: window.location.origin + "/cart",
        },
      });

      // Redirect to checkout
      if (response.redirectSession?.fullUrl) {
        if (config.redirectToCheckout) {
          config.redirectToCheckout(response.redirectSession.fullUrl);
        } else {
          window.location.href = response.redirectSession.fullUrl;
        }
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (err) {
      console.error("Failed to create checkout session:", err);
      error.set("Failed to start checkout process");
    } finally {
      isBooking.set(false);
    }
  };

  return {
    selectedService,
    selectedSlot,
    isBooking,
    error,
    hasSelection,
    canBook,
    getBookingSummary,
    selectService,
    selectSlot,
    clearSelection,
    proceedToCheckout,
  };
});

export async function loadBookingSelectionServiceConfig(
  timezone?: string,
  returnUrl?: string
): Promise<ServiceFactoryConfig<typeof BookingSelectionService>> {
  return {
    timezone: timezone || "UTC",
    returnUrl: returnUrl || "/bookings",
  };
}
