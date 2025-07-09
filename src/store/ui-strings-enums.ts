/**
 * Enum for store-related UI action button labels
 */
export enum StoreActionLabels {
  ADD_TO_CART = 'Add to Cart',
  PRE_ORDER = 'Pre Order',
  BUY_NOW = 'Buy Now',
  QUICK_VIEW = 'Quick View',
  LOAD_MORE_PRODUCTS = 'Load More Products',
}

/**
 * Enum for store-related status messages
 */
export enum StoreStatusMessages {
  ADDED_TO_CART = 'Added to Cart!',
  PROCESSING = 'Processing...',
  IN_STOCK = 'In Stock',
  OUT_OF_STOCK = 'Out of Stock',
  OUT_OF_STOCK_SUFFIX = ' (Out of Stock)',
  LOW_STOCK_PREFIX = 'Only ',
  LOW_STOCK_SUFFIX = ' left in stock',
}

/**
 * Enum for store sorting options display labels
 */
export enum StoreSortLabels {
  SORT_BY = 'Sort by',
  LATEST_ARRIVALS = 'Latest Arrivals',
  RECOMMENDED = 'Recommended',
  NAME_ASC = 'Name (A-Z)',
  NAME_DESC = 'Name (Z-A)',
  PRICE_ASC = 'Price (Low to High)',
  PRICE_DESC = 'Price (High to Low)',
}

/**
 * Enum for store form labels and placeholders
 */
export enum StoreFormLabels {
  CHARACTERS = 'characters',
  ENTER_CUSTOM_PREFIX = 'Enter custom ',
  ENTER_CUSTOM_SUFFIX = '...',
}

/**
 * Helper function to create low stock message
 */
export function createLowStockMessage(quantity: number): string {
  return `${StoreStatusMessages.LOW_STOCK_PREFIX}${quantity}${StoreStatusMessages.LOW_STOCK_SUFFIX}`;
}

/**
 * Helper function to create custom placeholder text
 */
export function createCustomPlaceholder(fieldName: string): string {
  return `${StoreFormLabels.ENTER_CUSTOM_PREFIX}${fieldName.toLowerCase()}${StoreFormLabels.ENTER_CUSTOM_SUFFIX}`;
}

/**
 * Helper function to create character count text
 */
export function createCharacterCountText(
  currentCount: number,
  maxCount: number
): string {
  return `${currentCount}/${maxCount} ${StoreFormLabels.CHARACTERS}`;
}
