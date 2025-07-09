/**
 * Enum for store-related status messages (multi-use only)
 */
export enum StoreStatusMessages {
  IN_STOCK = 'In Stock',
  OUT_OF_STOCK = 'Out of Stock',
  AVAILABLE_FOR_PREORDER = 'Available for Pre-Order',
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
 * Helper function to create low stock message (reusable pattern)
 */
export function createLowStockMessage(quantity: number): string {
  return `${StoreStatusMessages.LOW_STOCK_PREFIX}${quantity}${StoreStatusMessages.LOW_STOCK_SUFFIX}`;
}

/**
 * Helper function to map Wix availability status to display message
 * Uses proper enum constants from headless store
 */
export function getStockStatusMessage(
  availabilityStatus: string | undefined,
  isPreOrderEnabled: boolean = false
): StoreStatusMessages {
  if (isPreOrderEnabled) {
    return StoreStatusMessages.AVAILABLE_FOR_PREORDER;
  }

  // Use string constants that match the Wix API enum values
  switch (availabilityStatus) {
    case 'IN_STOCK':
    case 'PARTIALLY_OUT_OF_STOCK':
      return StoreStatusMessages.IN_STOCK;
    case 'OUT_OF_STOCK':
      return StoreStatusMessages.OUT_OF_STOCK;
    default:
      return StoreStatusMessages.OUT_OF_STOCK;
  }
}
