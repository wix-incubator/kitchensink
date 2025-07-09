/**
 * Enum for sort types used in the store
 * Note: Cannot use SDK SortType as it's for aggregations (COUNT/VALUE)
 * while this enum represents user-facing sort options
 */
export enum SortType {
  NEWEST = 'newest',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RECOMMENDED = 'recommended',
}

/**
 * Default sort type
 */
export const DEFAULT_SORT_TYPE = SortType.NEWEST;
