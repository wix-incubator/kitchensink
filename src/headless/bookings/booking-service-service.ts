import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";
import { services } from "@wix/bookings";

export interface BookingServiceServiceAPI {
  service: Signal<services.Service | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasService: () => boolean;
  loadService: (serviceId: string) => Promise<void>;
  refreshService: () => Promise<void>;
}

export const BookingServiceServiceDefinition =
  defineService<BookingServiceServiceAPI>("bookingServiceService");

export const BookingServiceService = implementService.withConfig<{
  initialService?: services.Service;
  serviceId?: string;
}>()(BookingServiceServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const serviceSignal: Signal<services.Service | null> = signalsService.signal(
    config.initialService || (null as any)
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Store the current service ID for refresh
  let currentServiceId: string | undefined = config.serviceId;

  // Computed functions
  const hasService = (): boolean => {
    return serviceSignal.get() !== null;
  };

  // Actions
  const loadService = async (serviceId: string): Promise<void> => {
    try {
      isLoading.set(true);
      error.set(null);
      currentServiceId = serviceId;

      const result = await services.getService(serviceId);
      serviceSignal.set(result || null);
    } catch (err) {
      console.error("Failed to load service:", err);
      error.set("Failed to load service");
      serviceSignal.set(null);
    } finally {
      isLoading.set(false);
    }
  };

  const refreshService = async (): Promise<void> => {
    if (currentServiceId) {
      await loadService(currentServiceId);
    }
  };

  return {
    service: serviceSignal,
    isLoading,
    error,
    hasService,
    loadService,
    refreshService,
  };
});

export type BookingServiceServiceConfigResult =
  | {
      type: "success";
      config: ServiceFactoryConfig<typeof BookingServiceService>;
    }
  | { type: "notFound" };

export async function loadBookingServiceServiceConfig(
  serviceId?: string
): Promise<BookingServiceServiceConfigResult> {
  try {
    if (serviceId) {
      // Load the specific service on the server
      const result = await services.getService(serviceId);

      if (!result || result._id !== serviceId) {
        return { type: "notFound" };
      }

      return {
        type: "success",
        config: {
          initialService: result,
          serviceId,
        },
      };
    }

    // For cases without serviceId, always return success
    return {
      type: "success",
      config: {
        serviceId,
      },
    };
  } catch (error) {
    console.error("Failed to load initial service:", error);
    return { type: "notFound" };
  }
}
