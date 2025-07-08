import { createServicesMap } from "@wix/services-manager";
import { WixServices } from "@wix/services-manager-react";
import CartContent from "../components/ecom/Cart";
import {
  CurrentCartService,
  CurrentCartServiceDefinition,
} from "../headless/ecom/services/current-cart-service";
import { KitchensinkLayout } from "../layouts/KitchensinkLayout";
import "../styles/theme-1.css";

interface CartPageProps {
  data?: any;
}

export default function CartPage({ data }: CartPageProps) {
  // Create services manager with cart service
  const servicesMap = createServicesMap().addService(
    CurrentCartServiceDefinition,
    CurrentCartService,
    data || { initialCart: null }
  );

  return (
    <KitchensinkLayout>
      <WixServices servicesMap={servicesMap}>
        <CartContent />
      </WixServices>
    </KitchensinkLayout>
  );
}
