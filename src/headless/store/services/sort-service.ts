import {
  defineService,
  implementService,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";

export type SortBy = '' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface SortServiceAPI {
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;
}

export const SortServiceDefinition =
  defineService<SortServiceAPI>("sort");

export const defaultSort: SortBy = '';

export const SortService = implementService.withConfig<{}>()(SortServiceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const currentSort: Signal<SortBy> = signalsService.signal(defaultSort as any);

  const setSortBy = async (sortBy: SortBy) => {
    currentSort.set(sortBy);
  };

  return {
    currentSort,
    setSortBy,
  };
}); 