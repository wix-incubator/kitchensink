import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
import { URLParamsUtils } from '../utils/url-params';

export type SortBy =
  | ''
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'recommended';

export interface SortServiceAPI {
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;
}

export const SortServiceDefinition = defineService<SortServiceAPI>('sort');

export const defaultSort: SortBy = '';

export const SortService = implementService.withConfig<{
  initialSort?: SortBy;
}>()(SortServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const currentSort: Signal<SortBy> = signalsService.signal(
    (config.initialSort || defaultSort) as any
  );

  const setSortBy = async (sortBy: SortBy) => {
    currentSort.set(sortBy);

    // Update URL with sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    const sortMap: Record<SortBy, string> = {
      'name-asc': 'name_asc',
      'name-desc': 'name_desc',
      'price-asc': 'price_asc',
      'price-desc': 'price_desc',
      recommended: 'recommended',
      '': 'newest',
    };

    const sortParam = sortMap[sortBy] || 'newest';
    const urlParams = { ...currentParams };

    if (sortParam !== 'newest') {
      urlParams.sort = sortParam;
    } else {
      delete urlParams.sort;
    }

    URLParamsUtils.updateURL(urlParams);
  };

  return {
    currentSort,
    setSortBy,
  };
});
