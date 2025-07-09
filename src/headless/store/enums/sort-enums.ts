import { productsV3 } from '@wix/stores';

export enum SortType {
  NEWEST = 'newest',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RECOMMENDED = 'recommended',
}

export const DEFAULT_SORT_TYPE = SortType.NEWEST;
