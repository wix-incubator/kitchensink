import { useState, type ReactNode } from "react";
import { WixServices } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/ecom/services/current-cart-service";
import { MiniCartContent, MiniCartIcon } from "../components/ecom/MiniCart";

interface StoreLayoutProps {
  children: ReactNode;
  currentCartServiceConfig: any;
  showSuccessMessage?: boolean;
  onSuccessMessageChange?: (show: boolean) => void;
}

export function StoreLayout({
  children,
  currentCartServiceConfig,
  showSuccessMessage = false,
  onSuccessMessageChange,
}: StoreLayoutProps) {
  const [internalShowSuccess, setInternalShowSuccess] = useState(false);

  const actualShowSuccess = onSuccessMessageChange
    ? showSuccessMessage
    : internalShowSuccess;
  const setShowSuccess = onSuccessMessageChange || setInternalShowSuccess;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        currentCartServiceConfig
      )}
    >
      {/* Success Message */}
      {actualShowSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-status-success-medium backdrop-blur-sm text-content-primary px-6 py-3 rounded-xl shadow-lg border border-status-success animate-pulse">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to cart successfully!
          </div>
        </div>
      )}

      <MiniCartIcon />

      {/* Main Content */}
      {children}

      <MiniCartContent />
    </WixServices>
  );
}
