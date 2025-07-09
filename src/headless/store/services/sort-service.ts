import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';
import { URLParamsUtils } from '../utils/url-params';
import {
  SortType,
  SORT_TYPE_TO_PARAM,
  DEFAULT_SORT_TYPE,
} from '../enums/sort-enums';

export type SortBy = SortType;

export interface SortServiceAPI {
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;
}

export const SortServiceDefinition = defineService<SortServiceAPI>('sort');

export const defaultSort: SortBy = DEFAULT_SORT_TYPE;

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
    const sortParam = SORT_TYPE_TO_PARAM[sortBy];
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
