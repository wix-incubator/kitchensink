import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { BookingAvailabilityServiceDefinition } from '../services/booking-availability-service';
import { availabilityCalendar } from '@wix/bookings';

/**
 * Props for Calendar headless component
 */
export interface CalendarProps {
  /** Render prop function that receives calendar data */
  children: (props: CalendarRenderProps) => React.ReactNode;
}

/**
 * Render props for Calendar component
 */
export interface CalendarRenderProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Available dates with bookings */
  availableDates: Date[];
  /** Whether availability is loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Function to select a date */
  selectDate: (date: Date) => void;
  /** Function to check if a date has available slots */
  hasAvailableSlots: (date: Date) => boolean;
  /** Function to load slots for a date range */
  loadSlots: (startDate: Date, endDate: Date) => Promise<void>;
}

/**
 * Calendar - Displays available dates for booking
 */
export const Calendar = (props: CalendarProps) => {
  const service = useService(
    BookingAvailabilityServiceDefinition
  ) as ServiceAPI<typeof BookingAvailabilityServiceDefinition>;

  const selectedDate = service.selectedDate.get();
  const availableDates = service.availableDates();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  const hasAvailableSlots = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return availableDates.some(
      availableDate => availableDate.toISOString().split('T')[0] === dateString
    );
  };

  return props.children({
    selectedDate,
    availableDates,
    isLoading,
    error,
    selectDate: service.selectDate,
    hasAvailableSlots,
    loadSlots: service.loadSlots,
  });
};

/**
 * Props for TimeSlots headless component
 */
export interface TimeSlotsProps {
  /** Render prop function that receives time slots data */
  children: (props: TimeSlotsRenderProps) => React.ReactNode;
}

/**
 * Render props for TimeSlots component
 */
export interface TimeSlotsRenderProps {
  /** Time slots for the selected date */
  slots: availabilityCalendar.SlotAvailability[];
  /** Currently selected date */
  selectedDate: Date;
  /** Whether slots are loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Whether there are slots for the selected date */
  hasSlots: boolean;
  /** Whether the selected date has no slots */
  isEmpty: boolean;
  /** Function to select a time slot */
  selectSlot: (slot: availabilityCalendar.SlotAvailability) => void;
  /** Function to refresh time slots */
  refreshSlots: () => Promise<void>;
}

/**
 * TimeSlots - Displays available time slots for the selected date
 */
export const TimeSlots = (props: TimeSlotsProps) => {
  const service = useService(
    BookingAvailabilityServiceDefinition
  ) as ServiceAPI<typeof BookingAvailabilityServiceDefinition>;

  const slotsForSelectedDate = service.slotsForSelectedDate();
  const selectedDate = service.selectedDate.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();
  const hasSlots = slotsForSelectedDate.length > 0;

  // For now, we'll just return the slots - slot selection will be handled by BookingSelection service
  const selectSlot = (slot: availabilityCalendar.SlotAvailability) => {
    // This will be handled by the BookingSelection service
    console.log('Slot selected:', slot);
  };

  return props.children({
    slots: slotsForSelectedDate,
    selectedDate,
    isLoading,
    error,
    hasSlots,
    isEmpty: !isLoading && !hasSlots,
    selectSlot,
    refreshSlots: service.refreshSlots,
  });
};

/**
 * Props for TimeSlot headless component
 */
export interface TimeSlotProps {
  /** The time slot to render */
  slot: availabilityCalendar.SlotAvailability;
  /** Render prop function that receives slot data */
  children: (props: TimeSlotRenderProps) => React.ReactNode;
}

/**
 * Render props for TimeSlot component
 */
export interface TimeSlotRenderProps {
  /** Slot start time */
  startTime: string;
  /** Slot end time */
  endTime: string;
  /** Formatted time range (e.g., "2:00 PM - 3:00 PM") */
  timeRange: string;
  /** Whether the slot is bookable */
  isBookable: boolean;
  /** Whether the slot is locked (waitlist exists) */
  isLocked: boolean;
  /** Number of open spots */
  openSpots: number;
  /** Total number of spots */
  totalSpots: number;
  /** Availability text (e.g., "3 spots available") */
  availabilityText: string;
  /** Location information if available */
  location?: string;
  /** Duration in minutes */
  duration: number;
  /** Function to select this slot */
  selectSlot: () => void;
}

/**
 * TimeSlot - Renders data for a single time slot
 */
export const TimeSlot = (props: TimeSlotProps) => {
  const { slot } = props;

  const startTime = new Date(slot.slot?.startDate || '');
  const endTime = new Date(slot.slot?.endDate || '');
  const duration = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  );

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const startTimeFormatted = formatTime(startTime);
  const endTimeFormatted = formatTime(endTime);
  const timeRange = `${startTimeFormatted} - ${endTimeFormatted}`;

  const openSpots = slot.openSpots || 0;
  const totalSpots = slot.totalSpots || 0;

  let availabilityText = '';
  if (totalSpots > 1) {
    availabilityText = `${openSpots} of ${totalSpots} spots available`;
  } else if (slot.bookable) {
    availabilityText = 'Available';
  } else {
    availabilityText = 'Unavailable';
  }

  const location =
    slot.slot?.location?.formattedAddress ||
    slot.slot?.location?.name ||
    undefined;

  const selectSlot = () => {
    // This will be connected to the BookingSelection service
    console.log('Selecting slot:', slot);
  };

  return props.children({
    startTime: startTimeFormatted,
    endTime: endTimeFormatted,
    timeRange,
    isBookable: slot.bookable || false,
    isLocked: slot.locked || false,
    openSpots,
    totalSpots,
    availabilityText,
    location,
    duration,
    selectSlot,
  });
};

/**
 * Props for AvailabilityHeader headless component
 */
export interface AvailabilityHeaderProps {
  /** Render prop function that receives header data */
  children: (props: AvailabilityHeaderRenderProps) => React.ReactNode;
}

/**
 * Render props for AvailabilityHeader component
 */
export interface AvailabilityHeaderRenderProps {
  /** Currently selected date formatted */
  selectedDateFormatted: string;
  /** Number of available slots for selected date */
  availableSlotsCount: number;
  /** Whether there are slots for the selected date */
  hasSlots: boolean;
  /** Whether availability is loading */
  isLoading: boolean;
  /** Summary text for the selected date */
  summaryText: string;
}

/**
 * AvailabilityHeader - Displays header information for availability
 */
export const AvailabilityHeader = (props: AvailabilityHeaderProps) => {
  const service = useService(
    BookingAvailabilityServiceDefinition
  ) as ServiceAPI<typeof BookingAvailabilityServiceDefinition>;

  const selectedDate = service.selectedDate.get();
  const slotsForSelectedDate = service.slotsForSelectedDate();
  const isLoading = service.isLoading.get();
  const hasSlots = slotsForSelectedDate.length > 0;

  const selectedDateFormatted = selectedDate.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const availableSlotsCount = slotsForSelectedDate.filter(
    slot => slot.bookable
  ).length;

  const summaryText = !isLoading
    ? hasSlots
      ? `${availableSlotsCount} available slot${
          availableSlotsCount !== 1 ? 's' : ''
        }`
      : 'No available slots'
    : '';

  return props.children({
    selectedDateFormatted,
    availableSlotsCount,
    hasSlots,
    isLoading,
    summaryText,
  });
};
