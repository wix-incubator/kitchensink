import React from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  BookingServicesService,
  BookingServicesServiceDefinition,
} from "../../../headless/bookings/booking-services-service";
import { BookingServices } from "../../../headless/bookings/BookingServices";
import WixMediaImage from "../../../headless/media/Image";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../../components/DocsMode";

interface ServiceDetailPageProps {
  serviceId: string;
  bookingServicesConfig: any;
}

const ServiceNotFound = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Service Not Found
        </h1>
        <p className="text-white/70 mb-8">
          The service you're looking for doesn't exist.
        </p>
        <a
          href="/bookings/example-2/services"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
        >
          View All Services
        </a>
      </div>
    </div>
  </div>
);

const ServiceDetailSection = ({ serviceId }: { serviceId: string }) => {
  return (
    <BookingServices.ServiceGrid>
      {withDocsWrapper(
        ({ services, isLoading, error }) => {
          if (isLoading) {
            return (
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 animate-pulse">
                  <div className="mb-8 pb-8 border-b border-white/20">
                    <div className="h-10 bg-white/10 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="h-6 bg-white/10 rounded w-1/4"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-48 bg-white/10 rounded-lg"
                      ></div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="h-12 bg-white/10 rounded w-32 mx-auto"></div>
                  </div>
                </div>
              </div>
            );
          }

          if (error) {
            return (
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                  <div className="text-center">
                    <p className="text-red-400 mb-4">
                      Failed to load service: {error}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          const service = services.find((s) => s._id === serviceId);
          if (!service) {
            return <ServiceNotFound />;
          }

          return (
            <BookingServices.ServiceCard service={service}>
              {withDocsWrapper(
                ({
                  name,
                  tagLine,
                  description,
                  price,
                  duration,
                  image,
                  canBookOnline,
                  locations,
                }) => (
                  <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
                      {/* Header */}
                      <div className="mb-8 pb-8 border-b border-white/20">
                        <h1 className="font-bold text-4xl mb-2 text-white">
                          {name}
                        </h1>
                        {tagLine && (
                          <p className="text-lg text-white/80 pt-4">
                            {tagLine}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {description && (
                        <div className="mb-8">
                          <h2 className="font-bold text-2xl mb-4 text-white">
                            Service Description
                          </h2>
                          <p className="text-white/80 leading-7">
                            {description}
                          </p>
                        </div>
                      )}

                      {/* Image Gallery */}
                      {image && (
                        <section className="mb-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                              <WixMediaImage
                                media={image}
                                width={640}
                                height={480}
                                className="w-full h-64 object-cover"
                              />
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Service Details Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {duration && (
                          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <svg
                                className="w-5 h-5 text-blue-400 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-white">
                                Duration
                              </span>
                            </div>
                            <p className="text-white/80">{duration} minutes</p>
                          </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <svg
                              className="w-5 h-5 text-green-400 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-medium text-white">
                              Price
                            </span>
                          </div>
                          <p className="text-white/80">{price}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <svg
                              className="w-5 h-5 text-purple-400 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-medium text-white">
                              Booking
                            </span>
                          </div>
                          <p className="text-white/80">
                            {canBookOnline
                              ? "Online Available"
                              : "Contact Required"}
                          </p>
                        </div>
                      </div>

                      {/* Locations */}
                      {locations && locations.length > 0 && (
                        <div className="mb-10">
                          <h3 className="font-semibold mb-4 text-white flex items-center">
                            <svg
                              className="w-5 h-5 mr-2 text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Available Locations
                          </h3>
                          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
                            <p className="text-white/80">
                              {locations.join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Book Now Button */}
                      <div className="text-center">
                        {canBookOnline ? (
                          <a
                            href={`/bookings/example-2/book/${serviceId}`}
                            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                          >
                            Book Now
                          </a>
                        ) : (
                          <div>
                            <span className="inline-block bg-white/10 text-white/60 px-8 py-3 rounded-lg font-medium cursor-not-allowed mb-2">
                              Online Booking Not Available
                            </span>
                            <p className="text-white/70 text-sm">
                              Please contact us to book this service
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ),
                "Service Detail",
                "/docs/components/bookings-services#service-detail"
              )}
            </BookingServices.ServiceCard>
          );
        },
        "Service Detail Section",
        "/docs/components/bookings-services#service-detail-section"
      )}
    </BookingServices.ServiceGrid>
  );
};

export default function ServiceDetailPage({
  serviceId,
  bookingServicesConfig,
}: ServiceDetailPageProps) {
  // Create services manager
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      BookingServicesServiceDefinition,
      BookingServicesService,
      bookingServicesConfig
    )
  );

  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Service Detail View"
        description="Detailed service information page with comprehensive service details, images, and booking options."
        docsUrl="/docs/examples/service-detail"
      />
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ServiceDetailSection serviceId={serviceId} />
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
