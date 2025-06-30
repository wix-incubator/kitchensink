import { ServicesManagerProvider } from "@wix/services-manager-react";
import { createServicesManager, createServicesMap } from "@wix/services-manager";
import { SEOTagsService, SEOTagsServiceDefinition, type SEOTagsServiceConfig } from "../headless/seo/services/seo-tags-service";

export function SEOProvider({
  children,
  seoTagsServiceConfig,
}: {
  children: React.ReactNode;
  seoTagsServiceConfig: SEOTagsServiceConfig;
}) {
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      SEOTagsServiceDefinition,
      SEOTagsService,
      seoTagsServiceConfig
    )
  );
  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      {children}
    </ServicesManagerProvider>
  );
}
