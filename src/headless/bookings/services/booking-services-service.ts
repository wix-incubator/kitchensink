import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
import { services } from '@wix/bookings';

export interface BookingServicesServiceAPI {
  services: Signal<services.Service[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasServices: () => boolean;
  totalServices: () => number;
  loadServices: () => Promise<void>;
  refreshServices: () => Promise<void>;
}

export const BookingServicesServiceDefinition =
  defineService<BookingServicesServiceAPI>('bookingServicesService');

export const BookingServicesService = implementService.withConfig<{
  initialServices?: services.Service[];
  serviceType?: 'APPOINTMENT' | 'CLASS' | 'COURSE';
}>()(BookingServicesServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // State signals
  const servicesSignal: Signal<services.Service[]> = signalsService.signal(
    config.initialServices || ([] as any)
  );
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Computed functions
  const hasServices = (): boolean => {
    return servicesSignal.get().length > 0;
  };

  const totalServices = (): number => {
    return servicesSignal.get().length;
  };

  // Actions
  const loadServices = async (): Promise<void> => {
    try {
      isLoading.set(true);
      error.set(null);

      let query = services.queryServices();

      // Filter by service type if specified
      if (config.serviceType) {
        query = query.eq('type', config.serviceType);
      }

      // Only show services with online booking enabled
      query = query.eq('onlineBooking.enabled', true);

      // Hide hidden services
      query = query.eq('hidden', false);

      const result = await query.find();
      servicesSignal.set(result.items || []);
    } catch (err) {
      console.error('Failed to load services:', err);
      error.set('Failed to load services');
    } finally {
      isLoading.set(false);
    }
  };

  const refreshServices = async (): Promise<void> => {
    await loadServices();
  };

  return {
    services: servicesSignal,
    isLoading,
    error,
    hasServices,
    totalServices,
    loadServices,
    refreshServices,
  };
});

export async function loadBookingServicesServiceConfig(
  serviceType?: 'APPOINTMENT' | 'CLASS' | 'COURSE'
): Promise<ServiceFactoryConfig<typeof BookingServicesService>> {
  try {
    // Load initial services on the server
    let query = services.queryServices();

    if (serviceType) {
      query = query.eq('type', serviceType);
    }

    query = query.eq('onlineBooking.enabled', true).eq('hidden', false);

    const result = await query.find();

    return {
      initialServices: result.items || [],
      serviceType,
    };
  } catch (error) {
    console.error('Failed to load initial services:', error);
    return {
      initialServices: [],
      serviceType,
    };
  }
}
