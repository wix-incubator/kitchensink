import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import "../styles/theme-2.css";
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from "../headless/ecom/services/current-cart-service";
import { KitchensinkLayout } from "../layouts/KitchensinkLayout";
import CartContent from "./ecom/composites/Cart";

interface CartPageProps {
  data?: any;
}

export default function CartPage({ data }: CartPageProps) {
  // Create services manager with cart service
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      CurrentCartServiceDefinition,
      CurrentCartService,
      data || { initialCart: null }
    )
  );

  return (
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <CartContent />
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
