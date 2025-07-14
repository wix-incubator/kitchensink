import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { useState } from 'react';
import '../styles/theme-1.css';
import {
  CurrentCartServiceDefinition,
  CurrentCartService,
} from '@wix/headless-ecom/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import CartContent from '../components/ecom/Cart';

interface CartPageProps {
  data?: any;
}

export default function CartPage({ data }: CartPageProps) {
  // Create services manager with cart service
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        CurrentCartServiceDefinition,
        CurrentCartService,
        data || { initialCart: null }
      )
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
