import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
//import { availabilityCalendar } from "@wix/bookings";
import { availabilityTimeSlots } from '@wix/bookings';
import { BookingTimezoneServiceDefinition } from './booking-timezone-service';

export interface BookingAvailabilityServiceAPI {
  slots: Signal<availabilityTimeSlots.TimeSlot[]>;
  selectedDate: Signal<Date>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  serviceId: Signal<string | null>;
  timezone: Signal<string>;
  hasSlots: () => boolean;
  slotsForSelectedDate: () => availabilityTimeSlots.TimeSlot[];
  availableDates: () => Date[];
  loadSlots: (startDate: Date, endDate: Date) => Promise<void>;
  selectDate: (date: Date) => void;
  setService: (serviceId: string) => void;
  refreshSlots: () => Promise<void>;
}

export const BookingAvailabilityServiceDefinition =
  defineService<BookingAvailabilityServiceAPI>('bookingAvailabilityService');

const convertToLocalISOString = (date: Date): string => {
  const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};

const getDatePartFromDateString = (dateString: string): string => {
  return dateString.split('T')[0];
};

const loadSlotsForService = async (
  startDate: Date,
  endDate: Date,
  timezone: string,
  serviceId: string
): Promise<availabilityTimeSlots.TimeSlot[]> => {
  const query = {
    fromLocalDate: convertToLocalISOString(startDate),
    toLocalDate: convertToLocalISOString(endDate),
    timeZone: timezone,
    serviceId: serviceId,
    bookable: true,
  };
  const queryResponse =
    await availabilityTimeSlots.listAvailabilityTimeSlots(query);
  return queryResponse.timeSlots || [];
};

export const BookingAvailabilityService = implementService.withConfig<{
  serviceId: string;
  timezone: string;
  initialSlots?: availabilityTimeSlots.TimeSlot[];
}>()(BookingAvailabilityServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const timezoneService = getService(BookingTimezoneServiceDefinition);

  // State signals
  const slots: Signal<availabilityTimeSlots.TimeSlot[]> = signalsService.signal(
    config.initialSlots || ([] as any)
  );
  const selectedDate: Signal<Date> = signalsService.signal(new Date() as any);
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);
  const serviceId: Signal<string | null> = signalsService.signal(
    config.serviceId || (null as any)
  );
  const timezone = timezoneService.selectedTimezone;

  // Computed functions
  const hasSlots = (): boolean => {
    return slots.get().length > 0;
  };

  const slotsForSelectedDate = (): availabilityTimeSlots.TimeSlot[] => {
    const selected = selectedDate.get();
    console.log('selected date from signal', selected);
    const selectedDateString = getDatePartFromDateString(
      convertToLocalISOString(selected)
    );

    console.log('slotsForSelectedDate', selectedDateString);

    return slots.get().filter(slot => {
      const slotDate = getDatePartFromDateString(slot.localStartDate || '');
      return slotDate === selectedDateString;
    });
  };

  const availableDates = (): Date[] => {
    const dateSet = new Set<string>();
    slots.get().forEach(slot => {
      if (slot.localStartDate) {
        const date = getDatePartFromDateString(slot.localStartDate);
        dateSet.add(date);
      }
    });
    return Array.from(dateSet)
      .map(date => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());
  };

  // Actions
  const loadSlots = async (startDate: Date, endDate: Date): Promise<void> => {
    const currentServiceId = serviceId.get();
    if (!currentServiceId) {
      error.set('No service selected');
      return;
    }

    try {
      isLoading.set(true);
      error.set(null);

      const currentTimezone = timezone.get();
      slots.set(
        await loadSlotsForService(
          startDate,
          endDate,
          currentTimezone,
          currentServiceId
        )
      );
    } catch (err) {
      console.error('Failed to load availability:', err);
      error.set('Failed to load availability');
    } finally {
      isLoading.set(false);
    }
  };

  const selectDate = (date: Date): void => {
    console.log('selectDate', date);
    selectedDate.set(date);
  };

  const setService = (newServiceId: string): void => {
    serviceId.set(newServiceId);
    // Clear existing slots when service changes
    slots.set([]);
  };

  const refreshSlots = async (): Promise<void> => {
    const selected = selectedDate.get();
    const startDate = new Date(selected);
    startDate.setDate(startDate.getDate() - 1); // Start from yesterday

    const endDate = new Date(selected);
    endDate.setDate(endDate.getDate() + 30); // Look ahead 30 days

    await loadSlots(startDate, endDate);
  };

  timezone.subscribe(() => {
    refreshSlots();
  });

  return {
    slots,
    selectedDate,
    isLoading,
    error,
    serviceId,
    timezone,
    hasSlots,
    slotsForSelectedDate,
    availableDates,
    loadSlots,
    selectDate,
    setService,
    refreshSlots,
  };
});

export async function loadBookingAvailabilityServiceConfig(
  serviceId: string,
  requestedTimezone?: string
): Promise<ServiceFactoryConfig<typeof BookingAvailabilityService>> {
  const timezone = requestedTimezone || 'UTC';
  try {
    if (serviceId) {
      // Load initial slots for the next 30 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const initialSlots = await loadSlotsForService(
        startDate,
        endDate,
        timezone,
        serviceId
      );
      return {
        serviceId,
        timezone,
        initialSlots,
      };
    }

    return {
      serviceId,
      timezone,
      initialSlots: [],
    };
  } catch (error) {
    console.error('Failed to load initial availability:', error);
    return {
      serviceId,
      timezone,
      initialSlots: [],
    };
  }
}
