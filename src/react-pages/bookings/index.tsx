import React from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  BookingServicesService,
  BookingServicesServiceDefinition,
} from "../../headless/bookings/booking-services-service";
import {
  BookingSelectionService,
  BookingSelectionServiceDefinition,
} from "../../headless/bookings/booking-selection-service";
import { BookingServices } from "../../headless/bookings/BookingServices";
import { BookingSelection } from "../../headless/bookings/BookingSelection";
import { KitchensinkLayout } from "../../layouts/KitchensinkLayout";

interface BookingsPageProps {
  bookingServicesConfig: any;
  bookingSelectionConfig: any;
}

export default function BookingsPage({
  bookingServicesConfig,
  bookingSelectionConfig,
}: BookingsPageProps) {
  // Create services manager with both booking services
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        BookingServicesServiceDefinition,
        BookingServicesService,
        bookingServicesConfig
      )
      .addService(
        BookingSelectionServiceDefinition,
        BookingSelectionService,
        bookingSelectionConfig
      )
  );

  return (
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Hero Section */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4">
                  Book a Service
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Choose from our professional services and book your
                  appointment online. We offer consultations, sessions, and
                  specialized services to meet your needs.
                </p>
              </div>
            </div>
          </div>

          {/* Services Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BookingServices.ServicesHeader>
              {({ summaryText, isLoading, hasServices }) => (
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      Available Services
                    </h2>
                    {summaryText && (
                      <p className="text-white/70 mt-2">{summaryText}</p>
                    )}
                  </div>
                  {isLoading && (
                    <div className="flex items-center text-white/70">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-2"></div>
                      Loading services...
                    </div>
                  )}
                </div>
              )}
            </BookingServices.ServicesHeader>

            {/* Services Grid */}
            <BookingServices.ServiceGrid>
              {({ services, isLoading, error, isEmpty, refreshServices }) => {
                if (isLoading) {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                        >
                          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                          <div className="h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (error) {
                  return (
                    <div className="text-center py-12">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-red-800 mb-2">
                          Error Loading Services
                        </h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                          onClick={refreshServices}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  );
                }

                if (isEmpty) {
                  return (
                    <div className="text-center py-12">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Services Available
                        </h3>
                        <p className="text-gray-600 mb-4">
                          There are currently no services available for booking.
                        </p>
                        <button
                          onClick={refreshServices}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <BookingServices.ServiceCard
                        key={service._id}
                        service={service}
                      >
                        {({
                          serviceId,
                          name,
                          description,
                          tagLine,
                          type,
                          canBookOnline,
                          duration,
                          price,
                          category,
                          imageUrl,
                          bookingUrl,
                          locations,
                        }) => (
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            {/* Service Image */}
                            <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg
                                    className="w-16 h-16"
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
                            <div className="p-6">
                              {/* Category & Type */}
                              <div className="flex items-center gap-2 mb-2">
                                {category && (
                                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {category}
                                  </span>
                                )}
                                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  {type.toLowerCase()}
                                </span>
                              </div>

                              {/* Service Name */}
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {name}
                              </h3>

                              {/* Tag Line */}
                              {tagLine && (
                                <p className="text-sm text-gray-600 mb-2 font-medium">
                                  {tagLine}
                                </p>
                              )}

                              {/* Description */}
                              {description && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                  {description}
                                </p>
                              )}

                              {/* Service Details */}
                              <div className="space-y-2 mb-4">
                                {duration && (
                                  <div className="flex items-center text-sm text-gray-600">
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

                                {locations.length > 0 && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {locations[0]}
                                  </div>
                                )}

                                <div className="flex items-center text-sm font-medium text-green-600">
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
                              <BookingSelection.ServiceSelector
                                services={[service]}
                              >
                                {({ selectService }) => (
                                  <button
                                    onClick={() => {
                                      selectService(service);
                                      window.location.href = `/bookings/${serviceId}`;
                                    }}
                                    disabled={!canBookOnline}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                      canBookOnline
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    {canBookOnline
                                      ? "Book Now"
                                      : "Booking Unavailable"}
                                  </button>
                                )}
                              </BookingSelection.ServiceSelector>
                            </div>
                          </div>
                        )}
                      </BookingServices.ServiceCard>
                    ))}
                  </div>
                );
              }}
            </BookingServices.ServiceGrid>
          </div>
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
