/**
 * Enum for Wix store product availability status (from API)
 */
export enum WixProductAvailabilityStatus {
  IN_STOCK = 'IN_STOCK',
  PARTIALLY_OUT_OF_STOCK = 'PARTIALLY_OUT_OF_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PREORDER = 'PREORDER',
}

/**
 * Enum for display stock status messages
 */
export enum StockStatusMessage {
  IN_STOCK = 'In Stock',
  AVAILABLE_FOR_PREORDER = 'Available for Pre-Order',
  OUT_OF_STOCK = 'Out of Stock',
}

/**
 * Enum for stock tracking types
 */
export enum InventoryTrackingType {
  TRACK_INVENTORY = 'TRACK_INVENTORY',
  DONT_TRACK_INVENTORY = 'DONT_TRACK_INVENTORY',
}

/**
 * Enum for product availability states
 */
export enum ProductAvailabilityState {
  AVAILABLE = 'AVAILABLE',
  PREORDER = 'PREORDER',
  UNAVAILABLE = 'UNAVAILABLE',
}

/**
 * Helper function to map Wix availability status to display message
 */
export function getStockStatusMessage(
  availabilityStatus: WixProductAvailabilityStatus | string | undefined,
  isPreOrderEnabled: boolean = false
): StockStatusMessage {
  if (isPreOrderEnabled) {
    return StockStatusMessage.AVAILABLE_FOR_PREORDER;
  }

  switch (availabilityStatus) {
    case WixProductAvailabilityStatus.IN_STOCK:
    case WixProductAvailabilityStatus.PARTIALLY_OUT_OF_STOCK:
      return StockStatusMessage.IN_STOCK;
    case WixProductAvailabilityStatus.OUT_OF_STOCK:
      return StockStatusMessage.OUT_OF_STOCK;
    default:
      return StockStatusMessage.OUT_OF_STOCK;
  }
}

/**
 * Helper function to determine if product is in stock
 */
export function isProductInStock(
  availabilityStatus: WixProductAvailabilityStatus | string | undefined
): boolean {
  return (
    availabilityStatus === WixProductAvailabilityStatus.IN_STOCK ||
    availabilityStatus === WixProductAvailabilityStatus.PARTIALLY_OUT_OF_STOCK
  );
}
