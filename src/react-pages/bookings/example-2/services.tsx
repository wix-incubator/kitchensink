import React from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { useState } from "react";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  BookingServicesService,
  BookingServicesServiceDefinition,
} from "../../../headless/bookings/services/booking-services-service";
import { BookingServices } from "../../../headless/bookings/components";
import { WixMediaImage } from "../../../headless/media/components/Image";
import { KitchensinkLayout } from "../../../layouts/KitchensinkLayout";
import { PageDocsRegistration } from "../../../components/DocsMode";

interface BookingsServicesPageProps {
  bookingServicesConfig: any;
}

const ServicesListSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="w-9 h-[2px] bg-blue-400 mb-4"></div>
        <h1 className="text-4xl font-bold text-white mb-4">Services</h1>
        <p className="text-xl text-white/80">
          Choose from our professional services and book your appointment online
        </p>
      </div>

      {/* Services Grid */}
      <BookingServices.ServicesList>
        {({
          services,
          isLoading,
          hasServices,
          error,
        }: {
          services: any[];
          isLoading: boolean;
          hasServices: boolean;
          error: string | null;
        }) => {
          if (isLoading) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 animate-pulse"
                  >
                    <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-6 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-4"></div>
                    <div className="h-10 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-12">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-red-400 mb-2">
                    Error Loading Services
                  </h3>
                  <p className="text-red-300 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            );
          }

          if (!hasServices) {
            return (
              <div className="text-center py-12">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Services Available
                  </h3>
                  <p className="text-white/70 mb-4">
                    No services found. Click{" "}
                    <a
                      href="https://manage.wix.com/account/site-selector?actionUrl=https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fbookings%2Fservices%2Ftemplates-catalog%3Forigin%3DHeadless"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      here
                    </a>{" "}
                    to go to the business dashboard to add services.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <BookingServices.ServiceListItem
                  key={service._id}
                  service={service}
                >
                  {({
                    serviceId,
                    name,
                    tagLine,
                    description,
                    price,
                    duration,
                    image,
                    canBookOnline,
                  }: {
                    serviceId: string;
                    name: string;
                    tagLine?: string;
                    description?: string;
                    price: string;
                    duration?: number;
                    image?: any;
                    canBookOnline: boolean;
                  }) => (
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 group h-full flex flex-col">
                      {/* Service Image */}
                      <div className="h-48 bg-white/10 rounded-t-xl overflow-hidden">
                        {image ? (
                          <WixMediaImage
                            media={image}
                            width={640}
                            height={320}
                            displayMode="fill"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-white/60"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Service Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Service Name */}
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {name}
                        </h3>

                        {/* Tag Line */}
                        {tagLine && (
                          <p className="text-sm text-white/80 mb-2 font-medium">
                            {tagLine}
                          </p>
                        )}

                        {/* Description */}
                        {description && (
                          <p className="text-sm text-white/70 mb-4 line-clamp-3 flex-1">
                            {description}
                          </p>
                        )}

                        {/* Service Details */}
                        <div className="space-y-2 mb-4">
                          {duration && (
                            <div className="flex items-center text-sm text-white/70">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {duration} minutes
                            </div>
                          )}

                          <div className="flex items-center text-sm font-medium text-green-400">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {price}
                          </div>
                        </div>

                        {/* Book Button */}
                        {canBookOnline ? (
                          <a
                            href={`/bookings/example-2/${serviceId}`}
                            className="w-full py-2 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105 text-center inline-block"
                          >
                            Book Now
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 px-4 rounded-lg font-medium bg-white/10 text-white/40 cursor-not-allowed"
                          >
                            Contact for Booking
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </BookingServices.ServiceListItem>
              ))}
            </div>
          );
        }}
      </BookingServices.ServicesList>
    </div>
  );
};

export default function BookingsServicesPage({
  bookingServicesConfig,
}: BookingsServicesPageProps) {
  // Create services manager
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        BookingServicesServiceDefinition,
        BookingServicesService,
        bookingServicesConfig
      )
    )
  );

  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="All Services Listing"
        description="Complete services listing page with grid layout, filtering, and detailed service information cards."
        docsUrl="/docs/examples/services-listing"
      />
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ServicesListSection />
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
