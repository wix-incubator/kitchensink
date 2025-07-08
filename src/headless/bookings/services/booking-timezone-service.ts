import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
import { auth } from '@wix/essentials';
import { siteProperties } from '@wix/business-tools';

async function getBusinessTimezone(): Promise<string> {
  try {
    if (!import.meta.env.SSR) {
      throw new Error('Not supported on client');
    }

    const elevatedGetSiteProperties = auth.elevate(
      siteProperties.getSiteProperties
    );

    const response = await elevatedGetSiteProperties({
      fields: ['timeZone'],
    });
    console.log('response timezone', response.properties?.timeZone);
    return response.properties?.timeZone || 'UTC';
  } catch (e) {
    console.error('Failed to get business timezone, falling back to UTC', e);
    return 'UTC';
  }
}

export interface BookingTimezoneServiceAPI {
  businessTimezone: Signal<string>;
  clientTimezone: Signal<string>;
  selectedTimezone: Signal<string>;
  setSelectedTimezone: (tz: string) => void;
  getTimezones: () => string[];
}

export const BookingTimezoneServiceDefinition =
  defineService<BookingTimezoneServiceAPI>('bookingTimezoneService');

export const BookingTimezoneService = implementService.withConfig<{
  businessTimezone: string;
}>()(BookingTimezoneServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // Business timezone from config
  const businessTimezone: Signal<string> = signalsService.signal(
    config.businessTimezone || 'UTC'
  );

  // Client timezone from browser
  let clientTz = 'UTC';
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }
  const clientTimezone: Signal<string> = signalsService.signal(clientTz);

  // Currently selected timezone (default to business)
  const selectedTimezone: Signal<string> = signalsService.signal(
    businessTimezone.get()
  );

  // Allow switching selected timezone
  const setSelectedTimezone = (tz: string) => {
    selectedTimezone.set(tz);
  };

  // Return both timezones as a list (unique, business first)
  const getTimezones = () => {
    const tzs = [businessTimezone.get(), clientTimezone.get()];
    return Array.from(new Set(tzs));
  };

  return {
    businessTimezone,
    clientTimezone,
    selectedTimezone,
    setSelectedTimezone,
    getTimezones,
  };
});

export async function loadBookingTimezoneServiceConfig(): Promise<
  ServiceFactoryConfig<typeof BookingTimezoneService>
> {
  const timezone = await getBusinessTimezone();
  return {
    businessTimezone: timezone,
  };
}
