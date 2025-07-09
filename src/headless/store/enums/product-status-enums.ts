import { productsV3 } from '@wix/stores';

// Re-export SDK enums for product availability status
export const InventoryAvailabilityStatus =
  productsV3.InventoryAvailabilityStatus;
export const AvailabilityStatus = productsV3.AvailabilityStatus;

// Type aliases for commonly used SDK types
export type WixProductAvailabilityStatus =
  productsV3.InventoryAvailabilityStatus;
export type WixAvailabilityStatus = productsV3.AvailabilityStatus;

/**
 * Enum for display stock status messages
 */
export enum StockStatusMessage {
  IN_STOCK = 'In Stock',
  AVAILABLE_FOR_PREORDER = 'Available for Pre-Order',
  OUT_OF_STOCK = 'Out of Stock',
}

/**
 * Helper function to map Wix availability status to display message
 */
export function getStockStatusMessage(
  availabilityStatus:
    | WixProductAvailabilityStatus
    | WixAvailabilityStatus
    | string
    | undefined,
  isPreOrderEnabled: boolean = false
): StockStatusMessage {
  if (isPreOrderEnabled) {
    return StockStatusMessage.AVAILABLE_FOR_PREORDER;
  }

  switch (availabilityStatus) {
    case InventoryAvailabilityStatus.IN_STOCK:
    case InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK:
    case AvailabilityStatus.IN_STOCK:
      return StockStatusMessage.IN_STOCK;
    case InventoryAvailabilityStatus.OUT_OF_STOCK:
    case AvailabilityStatus.OUT_OF_STOCK:
      return StockStatusMessage.OUT_OF_STOCK;
    case AvailabilityStatus.PREORDER:
      return StockStatusMessage.AVAILABLE_FOR_PREORDER;
    default:
      return StockStatusMessage.OUT_OF_STOCK;
  }
}

/**
 * Helper function to determine if product is in stock
 */
export function isProductInStock(
  availabilityStatus:
    | WixProductAvailabilityStatus
    | WixAvailabilityStatus
    | string
    | undefined
): boolean {
  return (
    availabilityStatus === InventoryAvailabilityStatus.IN_STOCK ||
    availabilityStatus === InventoryAvailabilityStatus.PARTIALLY_OUT_OF_STOCK ||
    availabilityStatus === AvailabilityStatus.IN_STOCK
  );
}
