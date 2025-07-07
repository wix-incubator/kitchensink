import { useEffect } from 'react';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { useState } from 'react';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import {
  BookingServiceService,
  BookingServiceServiceDefinition,
} from '../../../headless/bookings/services/booking-service-service';
import {
  BookingAvailabilityService,
  BookingAvailabilityServiceDefinition,
} from '../../../headless/bookings/services/booking-availability-service';
import {
  BookingSelectionService,
  BookingSelectionServiceDefinition,
} from '../../../headless/bookings/services/booking-selection-service';
import {
  BookingService,
  BookingAvailability,
  BookingSelection,
} from '../../../headless/bookings/components';
import { KitchensinkLayout } from '../../../layouts/KitchensinkLayout';
import { PageDocsRegistration } from '../../../components/DocsMode';

interface ServiceBookingPageProps {
  serviceId: string;
  bookingServiceConfig: any;
  bookingAvailabilityConfig: any;
  bookingSelectionConfig: any;
}

// Component to automatically select the service when the page loads
const ServiceAutoSelector = ({ serviceId }: { serviceId: string }) => {
  return (
    <BookingService.Service>
      {({ service, loadService: _loadService }) => {
        const currentService = service;

        return (
          <BookingSelection.ServiceSelector
            services={currentService ? [currentService] : []}
          >
            {({ selectService, selectedService }) => {
              // Auto-select service if it's loaded and not already selected
              useEffect(() => {
                if (
                  currentService &&
                  (!selectedService || selectedService._id !== serviceId)
                ) {
                  selectService(currentService);
                }
              }, [currentService, selectedService, selectService]);

              return null; // This component doesn't render anything
            }}
          </BookingSelection.ServiceSelector>
        );
      }}
    </BookingService.Service>
  );
};

const CalendarSection = () => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <BookingAvailability.AvailabilityHeader>
        {({ selectedDateFormatted, summaryText }) => (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Select Date
            </h3>
            <p className="text-white/70">{selectedDateFormatted}</p>
            {summaryText && (
              <p className="text-sm text-blue-300 mt-1">{summaryText}</p>
            )}
          </div>
        )}
      </BookingAvailability.AvailabilityHeader>

      <BookingAvailability.Calendar>
        {({
          selectedDate,
          availableDates: _availableDates,
          isLoading,
          selectDate,
          hasAvailableSlots,
          loadSlots,
        }) => {
          const today = new Date();
          const currentMonth = selectedDate.getMonth();
          const currentYear = selectedDate.getFullYear();

          // Generate calendar days for the current month
          const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
          const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
          const firstDayOfWeek = firstDayOfMonth.getDay();
          const daysInMonth = lastDayOfMonth.getDate();

          const calendarDays = [];

          // Add empty cells for days before the first day of the month
          for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDays.push(null);
          }

          // Add days of the month
          for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(new Date(currentYear, currentMonth, day));
          }

          const goToPreviousMonth = () => {
            const prevMonth = new Date(currentYear, currentMonth - 1, 1);
            selectDate(prevMonth);
            const startDate = new Date(prevMonth);
            startDate.setDate(1);
            const endDate = new Date(prevMonth);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0);
            loadSlots(startDate, endDate);
          };

          const goToNextMonth = () => {
            const nextMonth = new Date(currentYear, currentMonth + 1, 1);
            selectDate(nextMonth);
            const startDate = new Date(nextMonth);
            startDate.setDate(1);
            const endDate = new Date(nextMonth);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0);
            loadSlots(startDate, endDate);
          };

          return (
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <h4 className="text-lg font-medium text-white">
                  {selectedDate.toLocaleDateString([], {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h4>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-white/70"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="p-2"></div>;
                  }

                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();
                  const hasSlots = hasAvailableSlots(date);
                  const isPast = date < today;

                  return (
                    <button
                      key={index}
                      onClick={() => !isPast && selectDate(date)}
                      disabled={isPast || !hasSlots}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        isPast
                          ? 'text-white/30 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-500 text-white'
                            : hasSlots
                              ? 'hover:bg-white/10 text-white'
                              : 'text-white/40 cursor-not-allowed'
                      } ${isToday ? 'font-bold' : ''}`}
                    >
                      {date.getDate()}
                      {hasSlots && !isSelected && (
                        <div className="w-1 h-1 bg-blue-400 rounded-full mx-auto mt-1"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                </div>
              )}
            </div>
          );
        }}
      </BookingAvailability.Calendar>
    </div>
  );
};

const TimeSlotsSection = () => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Available Times</h3>

      <BookingAvailability.TimeSlots>
        {({ slots, isLoading, isEmpty, error }) => {
          if (isLoading) {
            return (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-white/10 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-8">
                <p className="text-red-400">{error}</p>
              </div>
            );
          }

          if (isEmpty) {
            return (
              <div className="text-center py-8">
                <p className="text-white/70">
                  No available times for this date
                </p>
              </div>
            );
          }

          return (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {slots.map((slot, index) => (
                <BookingAvailability.TimeSlot key={index} slot={slot}>
                  {({ timeRange, isBookable, availabilityText }) => (
                    <BookingSelection.SlotSelector slots={[slot]}>
                      {({ selectSlot }) => (
                        <button
                          onClick={() => {
                            if (isBookable) {
                              selectSlot(slot);
                            }
                          }}
                          disabled={!isBookable}
                          className={`w-full p-3 rounded-lg border text-left transition-colors ${
                            isBookable
                              ? 'border-white/20 hover:border-blue-400 hover:bg-white/10 text-white'
                              : 'border-white/10 bg-white/5 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{timeRange}</span>
                            <span className="text-sm">{availabilityText}</span>
                          </div>
                        </button>
                      )}
                    </BookingSelection.SlotSelector>
                  )}
                </BookingAvailability.TimeSlot>
              ))}
            </div>
          );
        }}
      </BookingAvailability.TimeSlots>
    </div>
  );
};

const BookingSummarySection = () => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>

      <BookingSelection.BookingSummary>
        {({
          summary,
          hasSelection,
          canBook,
          isBooking,
          error,
          proceedToCheckout,
          clearSelection,
        }) => {
          if (!hasSelection) {
            return (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">
                  Select a service and time slot to see your booking summary
                </p>
              </div>
            );
          }

          if (!summary) {
            return (
              <div className="text-center py-8">
                <p className="text-white/70">Loading summary...</p>
              </div>
            );
          }

          return (
            <div>
              {/* Service Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-medium text-white">
                    {summary.serviceName}
                  </h4>
                  {summary.serviceDescription && (
                    <p className="text-sm text-white/70 mt-1">
                      {summary.serviceDescription}
                    </p>
                  )}
                </div>

                <div className="border-t border-white/20 pt-3">
                  <div className="flex items-center text-sm text-white/70 mb-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {summary.date}
                  </div>

                  <div className="flex items-center text-sm text-white/70 mb-2">
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
                    {summary.startTime} - {summary.endTime} ({summary.duration}{' '}
                    min)
                  </div>

                  {summary.location && (
                    <div className="flex items-center text-sm text-white/70 mb-2">
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
                      {summary.location}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="font-medium text-white">Total:</span>
                    <span className="font-bold text-lg text-green-400">
                      {summary.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={proceedToCheckout}
                  disabled={!canBook || isBooking}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    canBook && !isBooking
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {isBooking ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Book Now'
                  )}
                </button>

                <button
                  onClick={clearSelection}
                  className="w-full py-2 px-4 rounded-lg font-medium text-white/70 hover:text-white transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          );
        }}
      </BookingSelection.BookingSummary>
    </div>
  );
};

export default function ServiceBookingPage({
  serviceId,
  bookingServiceConfig,
  bookingAvailabilityConfig,
  bookingSelectionConfig,
}: ServiceBookingPageProps) {
  // Create services manager
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap()
        .addService(
          BookingServiceServiceDefinition,
          BookingServiceService,
          bookingServiceConfig
        )
        .addService(
          BookingAvailabilityServiceDefinition,
          BookingAvailabilityService,
          bookingAvailabilityConfig
        )
        .addService(
          BookingSelectionServiceDefinition,
          BookingSelectionService,
          bookingSelectionConfig
        )
    )
  );

  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Service Booking Flow"
        description="Complete booking flow with calendar, time slots, and booking summary for a specific service."
        docsUrl="/docs/examples/service-booking-flow"
      />
      <ServicesManagerProvider servicesManager={servicesManager}>
        {/* Auto-select the service on page load */}
        <ServiceAutoSelector serviceId={serviceId} />

        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Header */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <nav className="flex items-center space-x-2 text-sm text-white/70 mb-4">
                    <a href="/bookings/example-1" className="hover:text-white">
                      Services
                    </a>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Book Service</span>
                  </nav>

                  <BookingService.ServiceDetail>
                    {({ name, tagLine }) => (
                      <div>
                        <h1 className="text-4xl font-bold text-white">
                          {name}
                        </h1>
                        {tagLine && (
                          <p className="text-xl text-white/80 mt-2">
                            {tagLine}
                          </p>
                        )}
                      </div>
                    )}
                  </BookingService.ServiceDetail>
                </div>

                <BookingSelection.BookingProgress>
                  {({ currentStep, steps, progressPercentage }) => (
                    <div className="hidden md:block">
                      <div className="flex items-center space-x-4">
                        {steps.map((step, index) => (
                          <div key={step} className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                index < currentStep
                                  ? 'bg-blue-500 text-white'
                                  : index === currentStep
                                    ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-400'
                                    : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span
                              className={`ml-2 text-sm font-medium ${
                                index <= currentStep
                                  ? 'text-white'
                                  : 'text-white/40'
                              }`}
                            >
                              {step}
                            </span>
                            {index < steps.length - 1 && (
                              <svg
                                className="w-4 h-4 ml-4 text-white/30"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </BookingSelection.BookingProgress>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <CalendarSection />
              </div>

              {/* Time Slots */}
              <div className="lg:col-span-1">
                <TimeSlotsSection />
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <BookingSummarySection />
              </div>
            </div>
          </div>
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
