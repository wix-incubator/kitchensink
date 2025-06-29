import React from "react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  BookingServicesService,
  BookingServicesServiceDefinition,
} from "../../../headless/bookings/services/booking-services-service";
import { BookingServices } from "../../../headless/bookings/components";
import { WixMediaImage } from "../../../headless/media/components";
import { PageDocsRegistration } from "../../../components/DocsMode";

interface BookingsHomePageProps {
  bookingServicesConfig: any;
}

const HeroSection = () => {
  return (
    <div className="text-center w-full min-h-screen relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background video placeholder - using gradient instead */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="text-center px-3 relative z-10 flex flex-col justify-center min-h-screen">
        <div className="font-sans font-bold uppercase tracking-widest pt-16 text-white/90">
          Ambition is the first step towards
        </div>
        <div className="font-bold text-4xl sm:text-6xl md:text-8xl pt-4 text-white">
          Success
        </div>
        <div className="text-xl pt-6 tracking-wider text-white/80">
          Now Available for Online Coaching
        </div>
        <div className="pt-7">
          <a
            className="inline-block bg-white text-black px-8 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
            href="/bookings/example-2/services"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <div className="mt-[-175px] relative z-20">
      <div className="w-full bg-white h-full relative">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="pl-5 py-2 pr-5 lg:pr-24">
              <div className="w-9 h-[2px] bg-black mb-2 my-8"></div>
              <h2 className="mb-7 mt-10 tracking-tighter max-w-xs text-4xl font-bold">
                About me
              </h2>
              <p className="text-sm flex-1 leading-7">
                My name is Allan Johnson and I am a personal coach. My goal is
                to assist people identify and overcome obstacles in their lives
                and to maximize their potential. Through my coaching, I help
                people set goals, build the confidence and skills they need to
                achieve success and develop a positive mindset and a sense of
                self-worth.
              </p>
              <p>&nbsp;</p>
              <p className="text-sm flex-1 leading-7">
                As the famous American author, salesman and motivational speaker
                Zig Ziglar once said: "Success is the doing, not the getting; in
                the trying, not the triumph. Success is a personal standard,
                reaching for the highest that is in us, becoming all that we can
                be. If we do our best, we are a success."
              </p>
              <div className="mt-11 mb-20">
                <a
                  href="/about-me"
                  className="inline-block bg-black text-white border-2 border-black px-5 py-2 text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Read More
                </a>
              </div>
            </div>
            <div className="w-full h-full min-h-[320px]">
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 w-full h-full bg-cover flex items-center justify-center text-white/60">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesPreviewSection = () => {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-blue-50 py-16">
      <BookingServices.ServicesList>
        {({ services, isLoading, hasServices }) => {
          if (isLoading) {
            return (
              <div className="max-w-7xl mx-auto px-5">
                <div className="w-9 h-[2px] bg-black mb-2 my-8"></div>
                <h2 className="mb-7 mt-10 tracking-tighter text-4xl font-bold max-w-xs">
                  How I Can Help You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (!hasServices) {
            return null;
          }

          // Show only first 3 services as featured
          const featuredServices = services.slice(0, 3);

          return (
            <div className="max-w-7xl mx-auto px-5">
              <div className="w-9 h-[2px] bg-black mb-2 my-8"></div>
              <h2 className="mb-7 mt-10 tracking-tighter text-4xl font-bold max-w-xs">
                How I Can Help You
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {featuredServices.map((service) => (
                  <BookingServices.ServiceListItem
                    key={service._id}
                    service={service}
                  >
                    {({ serviceId, name, tagLine, duration, price, image }) => (
                      <div className="w-full bg-white overflow-hidden mx-auto border border-gray-200 relative h-full min-h-[500px] shadow-lg hover:shadow-xl transition-shadow">
                        <a href={`/bookings/example-2/${serviceId}`}>
                          <div className="w-full h-48 overflow-hidden">
                            {image ? (
                              <WixMediaImage
                                media={image}
                                displayMode="fit"
                                className="w-full h-full object-cover"
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
                        </a>
                        <div className="px-6 py-4 text-center pb-20">
                          <a
                            href={`/bookings/example-2/${serviceId}`}
                            className="font-bold text-xl mb-2 hover:text-gray-700 block"
                          >
                            {name}
                          </a>
                          <div className="text-sm">
                            {tagLine && (
                              <p className="my-3 text-gray-600">{tagLine}</p>
                            )}
                            {duration && (
                              <p className="leading-8">{duration} minutes</p>
                            )}
                            <p className="leading-8 font-semibold">{price}</p>
                          </div>
                        </div>
                        <div className="w-full mx-auto pb-8 absolute bottom-0 text-center">
                          <a
                            href={`/bookings/example-2/${serviceId}`}
                            className="inline-block bg-black text-white border-2 border-black px-5 py-2 text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    )}
                  </BookingServices.ServiceListItem>
                ))}
              </div>

              <div className="flex my-8 justify-center">
                <a
                  className="inline-block bg-black text-white border-2 border-black px-5 py-2 text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
                  href="/bookings/example-2/services"
                >
                  More Services
                </a>
              </div>
            </div>
          );
        }}
      </BookingServices.ServicesList>
    </div>
  );
};

export default function BookingsHomePage({
  bookingServicesConfig,
}: BookingsHomePageProps) {
  // Create services manager
  const servicesManager = createServicesManager(
    createServicesMap().addService(
      BookingServicesServiceDefinition,
      BookingServicesService,
      bookingServicesConfig
    )
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <PageDocsRegistration
        title="Bookings Example 2 - Personal Brand"
        description="Modern, personal brand-focused design with storytelling elements and streamlined booking process."
        docsUrl="/docs/examples/bookings-example-2"
      />
      <div className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ServicesPreviewSection />
      </div>
    </ServicesManagerProvider>
  );
}
