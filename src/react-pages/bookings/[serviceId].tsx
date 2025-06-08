import React, { useEffect } from "react";
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
  BookingAvailabilityService,
  BookingAvailabilityServiceDefinition,
} from "../../headless/bookings/booking-availability-service";
import {
  BookingSelectionService,
  BookingSelectionServiceDefinition,
} from "../../headless/bookings/booking-selection-service";
import { BookingServices } from "../../headless/bookings/BookingServices";
import { BookingAvailability } from "../../headless/bookings/BookingAvailability";
import { BookingSelection } from "../../headless/bookings/BookingSelection";
import { KitchensinkLayout } from "../../layouts/KitchensinkLayout";

interface ServiceBookingPageProps {
  serviceId: string;
  bookingServicesConfig: any;
  bookingAvailabilityConfig: any;
  bookingSelectionConfig: any;
}

const CalendarSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <BookingAvailability.AvailabilityHeader>
        {({ selectedDateFormatted, summaryText }) => (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select Date
            </h3>
            <p className="text-gray-600">{selectedDateFormatted}</p>
            {summaryText && (
              <p className="text-sm text-blue-600 mt-1">{summaryText}</p>
            )}
          </div>
        )}
      </BookingAvailability.AvailabilityHeader>

      <BookingAvailability.Calendar>
        {({
          selectedDate,
          availableDates,
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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

                <h4 className="text-lg font-medium text-gray-900">
                  {selectedDate.toLocaleDateString([], {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  )
                )}
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
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : hasSlots
                          ? "hover:bg-blue-50 text-gray-900"
                          : "text-gray-400 cursor-not-allowed"
                      } ${isToday ? "font-bold" : ""}`}
                    >
                      {date.getDate()}
                      {hasSlots && !isSelected && (
                        <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Times
      </h3>

      <BookingAvailability.TimeSlots>
        {({ slots, isLoading, isEmpty, error }) => {
          if (isLoading) {
            return (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            );
          }

          if (error) {
            return (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            );
          }

          if (isEmpty) {
            return (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No available times for this date
                </p>
              </div>
            );
          }

          return (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {slots.map((slot, index) => (
                <BookingAvailability.TimeSlot key={index} slot={slot}>
                  {({
                    timeRange,
                    isBookable,
                    availabilityText,
                    selectSlot,
                  }) => (
                    <BookingSelection.SlotSelector slots={[slot]}>
                      {({
                        selectSlot: selectSlotForBooking,
                        isSlotSelected,
                      }) => (
                        <button
                          onClick={() => {
                            if (isBookable) {
                              selectSlotForBooking(slot);
                            }
                          }}
                          disabled={!isBookable}
                          className={`w-full p-3 rounded-lg border text-left transition-colors ${
                            isSlotSelected(slot)
                              ? "border-blue-600 bg-blue-50 text-blue-900"
                              : isBookable
                              ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                              : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Summary
      </h3>

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
                <p className="text-gray-500 mb-4">
                  Select a service and time slot to see your booking summary
                </p>
              </div>
            );
          }

          if (!summary) {
            return (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading summary...</p>
              </div>
            );
          }

          return (
            <div>
              {/* Service Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {summary.serviceName}
                  </h4>
                  {summary.serviceDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      {summary.serviceDescription}
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
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

                  <div className="flex items-center text-sm text-gray-600 mb-2">
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
                    {summary.startTime} - {summary.endTime} ({summary.duration}{" "}
                    min)
                  </div>

                  {summary.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
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

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-green-600">
                      {summary.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={proceedToCheckout}
                  disabled={!canBook || isBooking}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    canBook && !isBooking
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                    "Book Now"
                  )}
                </button>

                <button
                  onClick={clearSelection}
                  className="w-full py-2 px-4 rounded-lg font-medium text-gray-600 hover:text-gray-800 transition-colors"
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
  bookingServicesConfig,
  bookingAvailabilityConfig,
  bookingSelectionConfig,
}: ServiceBookingPageProps) {
  // Create services manager
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        BookingServicesServiceDefinition,
        BookingServicesService,
        bookingServicesConfig
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
  );

  return (
    <KitchensinkLayout>
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <a href="/bookings" className="hover:text-gray-700">
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

                  <BookingServices.ServiceGrid>
                    {({ services }) => {
                      const currentService = services.find(
                        (s) => s._id === serviceId
                      );
                      return currentService ? (
                        <BookingServices.ServiceCard service={currentService}>
                          {({ name, tagLine }) => (
                            <div>
                              <h1 className="text-3xl font-bold text-gray-900">
                                {name}
                              </h1>
                              {tagLine && (
                                <p className="text-xl text-gray-600 mt-2">
                                  {tagLine}
                                </p>
                              )}
                            </div>
                          )}
                        </BookingServices.ServiceCard>
                      ) : (
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900">
                            Book Service
                          </h1>
                          <p className="text-xl text-gray-600 mt-2">
                            Select your preferred date and time
                          </p>
                        </div>
                      );
                    }}
                  </BookingServices.ServiceGrid>
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
                                  ? "bg-blue-600 text-white"
                                  : index === currentStep
                                  ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span
                              className={`ml-2 text-sm font-medium ${
                                index <= currentStep
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step}
                            </span>
                            {index < steps.length - 1 && (
                              <svg
                                className="w-4 h-4 ml-4 text-gray-300"
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
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
