/**
 * Enum for sort types used in the store
 */
export enum SortType {
  NONE = '',
  NAME_ASC = 'name-asc',
  NAME_DESC = 'name-desc',
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
  RECOMMENDED = 'recommended',
}

/**
 * Enum for sort direction
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Enum for URL sort parameters
 */
export enum SortParam {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  RECOMMENDED = 'recommended',
  NEWEST = 'newest',
}

/**
 * Mapping between sort types and URL parameters
 */
export const SORT_TYPE_TO_PARAM: Record<SortType, SortParam> = {
  [SortType.NAME_ASC]: SortParam.NAME_ASC,
  [SortType.NAME_DESC]: SortParam.NAME_DESC,
  [SortType.PRICE_ASC]: SortParam.PRICE_ASC,
  [SortType.PRICE_DESC]: SortParam.PRICE_DESC,
  [SortType.RECOMMENDED]: SortParam.RECOMMENDED,
  [SortType.NONE]: SortParam.NEWEST,
};

/**
 * Default sort type
 */
export const DEFAULT_SORT_TYPE = SortType.NONE;
