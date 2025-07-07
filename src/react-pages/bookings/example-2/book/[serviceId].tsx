import React, { useState } from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  BookingServicesService,
  BookingServicesServiceDefinition,
} from "../../../../headless/bookings/services/booking-services-service";
import { BookingAvailabilityService } from "../../../../headless/bookings/services/booking-availability-service";
import { BookingSelectionService } from "../../../../headless/bookings/services/booking-selection-service";
import { BookingServices, BookingAvailability, BookingSelection } from "../../../../headless/bookings/components";
import { WixMediaImage } from "../../../../headless/media/components";
import { KitchensinkLayout } from "../../../../layouts/KitchensinkLayout";
import { PageDocsRegistration } from "../../../../components/DocsMode";
import { BookingAvailabilityServiceDefinition } from "../../../../headless/bookings/services/booking-availability-service";
import { BookingSelectionServiceDefinition } from "../../../../headless/bookings/services/booking-selection-service";
import { BookingTimezoneService, BookingTimezoneServiceDefinition } from "../../../../headless/bookings/services/booking-timezone-service";

interface BookNowPageProps {
  serviceId: string;
  bookingServicesConfig: any;
  bookingAvailabilityConfig: any;
  bookingSelectionConfig: any;
  bookingTimezoneConfig: any;
}

const ServiceNotFound = () => (
  <div className="max-w-4xl mx-auto px-6 py-12">
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

const BookingSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    {
      id: 1,
      name: "Select Date",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      name: "Select Time",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      name: "Confirm Booking",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
  ];

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.id}
              className={stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""}
            >
              <div className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step.completed
                      ? "bg-blue-500 text-white"
                      : step.current
                      ? "border-2 border-blue-400 bg-white/10 text-blue-300"
                      : "border-2 border-white/30 bg-white/5 text-white/40"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step.current
                      ? "text-blue-300"
                      : step.completed
                      ? "text-white"
                      : "text-white/50"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

const CalendarView = ({
  onDateSelect,
}: {
  onDateSelect: (date: Date) => void;
}) => {
  return (
    <BookingAvailability.Calendar>
      {({
        selectedDate,
        availableDates,
        isLoading,
        error,
        selectDate,
        hasAvailableSlots,
        loadSlots,
      }) => {
        React.useEffect(() => {
          // Load initial slots for current month
          const now = new Date();
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          loadSlots(now, endOfMonth);
        }, []);

        if (isLoading) {
          return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 animate-pulse">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array(35)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-10 bg-white/10 rounded"></div>
                  ))}
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">
                  Failed to load available dates: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          );
        }

        // Generate calendar grid
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

        const calendar = [];
        const current = new Date(startDate);

        for (let week = 0; week < 6; week++) {
          const weekDays = [];
          for (let day = 0; day < 7; day++) {
            const date = new Date(current);
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;
            const isAvailable = hasAvailableSlots(date);
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();

            weekDays.push(
              <button
                key={date.toISOString()}
                onClick={() => {
                  if (isAvailable && !isPast) {
                    selectDate(date);
                    onDateSelect(date);
                  }
                }}
                disabled={!isAvailable || isPast || !isCurrentMonth}
                className={`h-10 w-10 text-sm font-medium rounded-full transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : isAvailable && !isPast && isCurrentMonth
                    ? "hover:bg-white/10 text-white"
                    : "text-white/40 cursor-not-allowed"
                } ${isToday ? "ring-2 ring-blue-400" : ""}`}
              >
                {date.getDate()}
              </button>
            );
            current.setDate(current.getDate() + 1);
          }
          calendar.push(
            <div key={week} className="grid grid-cols-7 gap-2">
              {weekDays}
            </div>
          );
        }

        return (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {firstDayOfMonth.toLocaleDateString([], {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="h-10 flex items-center justify-center text-sm font-medium text-white/70"
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">{calendar}</div>
          </div>
        );
      }}
    </BookingAvailability.Calendar>
  );
};

const TimeSlotSelector = ({
  onSlotSelect,
}: {
  onSlotSelect: (slot: any) => void;
}) => {
  return (
    <BookingAvailability.TimeSlots>
      {({ slots, selectedDate, isLoading, error, hasSlots, isEmpty }) => {
        if (isLoading) {
          return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="animate-pulse space-y-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-12 bg-white/10 rounded"></div>
                  ))}
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-center py-8">
                <p className="text-red-400">
                  Failed to load time slots: {error}
                </p>
              </div>
            </div>
          );
        }

        if (isEmpty) {
          return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-center py-8">
                <p className="text-white/70">
                  No available time slots for this date.
                </p>
              </div>
            </div>
          );
        }

        return (
          <BookingSelection.SlotSelector slots={slots}>
            {({ selectSlot, isSlotSelected }) => (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Available Times for {selectedDate.toLocaleDateString()}
                </h3>
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <BookingAvailability.TimeSlot key={index} slot={slot}>
                      {({
                        timeRange,
                        isBookable,
                        availabilityText,
                        selectSlot: selectThisSlot,
                      }) => {
                        const isSelected = isSlotSelected
                          ? isSlotSelected(slot)
                          : false;
                        return (
                          <button
                            onClick={() => {
                              if (isBookable) {
                                selectSlot(slot);
                                selectThisSlot();
                                onSlotSelect(slot);
                              }
                            }}
                            disabled={!isBookable}
                            className={`w-full p-3 text-left rounded-lg border transition-colors ${
                              isSelected
                                ? "bg-blue-500/20 text-blue-300 border-blue-400"
                                : isBookable
                                ? "hover:bg-white/10 border-white/20 text-white"
                                : "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span
                                className={`font-medium ${
                                  isSelected
                                    ? "text-blue-300"
                                    : isBookable
                                    ? "text-white"
                                    : "text-white/40"
                                }`}
                              >
                                {timeRange}
                              </span>
                              <span
                                className={`text-sm ${
                                  isSelected
                                    ? "text-blue-200"
                                    : isBookable
                                    ? "text-white/70"
                                    : "text-white/30"
                                }`}
                              >
                                {availabilityText}
                              </span>
                            </div>
                          </button>
                        );
                      }}
                    </BookingAvailability.TimeSlot>
                  ))}
                </div>
              </div>
            )}
          </BookingSelection.SlotSelector>
        );
      }}
    </BookingAvailability.TimeSlots>
  );
};

const BookingSummaryView = ({ serviceId }: { serviceId: string }) => {
  return (
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
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <p className="text-white/70">
                Please select a date and time to proceed.
              </p>
            </div>
          );
        }

        return (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Booking Summary
            </h3>

            {summary && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-white/70">Service:</span>
                  <span className="font-medium text-white">
                    {summary.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Date:</span>
                  <span className="font-medium text-white">{summary.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Time:</span>
                  <span className="font-medium text-white">
                    {summary.startTime} - {summary.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Duration:</span>
                  <span className="font-medium text-white">
                    {summary.duration} minutes
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-white/20 pt-3">
                  <span className="text-white">Total:</span>
                  <span className="text-green-400">{summary.price}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={clearSelection}
                className="flex-1 px-4 py-2 border border-white/30 text-white/80 font-medium hover:bg-white/10 transition-colors rounded-lg"
              >
                Clear Selection
              </button>
              <button
                onClick={proceedToCheckout}
                disabled={!canBook || isBooking}
                className={`flex-1 px-4 py-2 font-medium transition-all rounded-lg ${
                  canBook && !isBooking
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        );
      }}
    </BookingSelection.BookingSummary>
  );
};

const BookNowContent = ({ serviceId }: { serviceId: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  return (
    <BookingServices.ServicesList>
      {({ services, isLoading, error }) => {
        // Auto-select the service when services are loaded
        React.useEffect(() => {
          if (services.length > 0 && serviceId) {
            const service = services.find((s) => s._id === serviceId);
            if (service) {
              // Use BookingSelection to select the service
              // This will be handled through the BookingSelection.ServiceSelector
            }
          }
        }, [services, serviceId]);

        if (isLoading) {
          return (
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 animate-pulse">
                <div className="h-8 bg-white/10 rounded mb-6"></div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-96 bg-white/10 rounded-lg"></div>
                  <div className="h-96 bg-white/10 rounded-lg"></div>
                </div>
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <div className="text-center">
                  <p className="text-red-400 mb-4">
                    Failed to load service: {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
          <BookingServices.ServiceListItem service={service}>
            {({ name, tagLine, price, duration, image }) => (
              <BookingSelection.ServiceSelector services={[service]}>
                {({ selectService }) => {
                  // Auto-select the service on mount
                  React.useEffect(() => {
                    selectService(service);
                  }, [service]);

                  return (
                    <div className="max-w-4xl mx-auto px-6 py-8">
                      {/* Service Header */}
                      <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                          Book {name}
                        </h1>
                        {tagLine && <p className="text-white/80">{tagLine}</p>}
                        <div className="flex justify-center items-center space-x-4 mt-4 text-sm text-white/70">
                          {duration && <span>{duration} minutes</span>}
                          <span>•</span>
                          <span>{price}</span>
                        </div>
                      </div>

                      {/* Progress Steps */}
                      <BookingSteps currentStep={currentStep} />

                      {/* Booking Content */}
                      <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Calendar and Time Slots */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Step 1: Date Selection */}
                          <div
                            className={currentStep >= 1 ? "block" : "hidden"}
                          >
                            <h2 className="text-xl font-semibold text-white mb-4">
                              Select a Date
                            </h2>
                            <CalendarView onDateSelect={handleDateSelect} />
                          </div>

                          {/* Step 2: Time Selection */}
                          {selectedDate && (
                            <div
                              className={currentStep >= 2 ? "block" : "hidden"}
                            >
                              <h2 className="text-xl font-semibold text-white mb-4">
                                Select a Time
                              </h2>
                              <TimeSlotSelector
                                onSlotSelect={handleSlotSelect}
                              />
                            </div>
                          )}
                        </div>

                        {/* Right Column - Service Info and Summary */}
                        <div className="space-y-6">
                          {/* Service Image */}
                          {image && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                              <WixMediaImage
                                media={image}
                                width={400}
                                height={200}
                                displayMode="fill"
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          )}

                          {/* Booking Summary */}
                          <BookingSummaryView serviceId={serviceId} />
                        </div>
                      </div>
                    </div>
                  );
                }}
              </BookingSelection.ServiceSelector>
            )}
          </BookingServices.ServiceListItem>
        );
      }}
    </BookingServices.ServicesList>
  );
};

export default function BookNowPage({
  serviceId,
  bookingServicesConfig,
  bookingAvailabilityConfig,
  bookingSelectionConfig,
  bookingTimezoneConfig,
}: BookNowPageProps) {
  // Create services manager with all required services
  const [servicesManager] = useState(() => createServicesManager(
    createServicesMap()
      .addService(
        BookingTimezoneServiceDefinition,
        BookingTimezoneService,
        bookingTimezoneConfig
      )
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
  ));

  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Step-by-Step Booking Flow"
        description="Complete step-by-step booking flow with calendar, time selection, and booking confirmation."
        docsUrl="/docs/examples/step-by-step-booking"
      />
      <ServicesManagerProvider servicesManager={servicesManager}>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <BookNowContent serviceId={serviceId} />
        </div>
      </ServicesManagerProvider>
    </KitchensinkLayout>
  );
}
