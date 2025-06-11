import { KitchensinkLayout } from "../layouts/KitchensinkLayout";

interface HomePageProps {
  // Future server-side data can be added here
}

export default function HomePage(props: HomePageProps) {
  return (
    <KitchensinkLayout>
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wix
            </span>
            <br />
            <span className="text-white/90">Kitchensink</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explore the complete suite of Wix features with real
            implementations, interactive examples, and comprehensive
            documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#available-features"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Use Cases
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a
                href="#docs-mode"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Docs Mode
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
            <div className="text-white/60 text-sm">
              <span className="mr-4">🚀 Live Examples</span>
              <span className="mr-4">📚 Full Documentation</span>
              <span>⚡ Ready to Use</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Learn by Exploring, Build with Confidence
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              This kitchensink showcases modern headless component architecture
              with
              <span className="text-blue-300 font-semibold">
                {" "}
                interactive documentation
              </span>
              . Activate docs mode on any page to discover components,
              understand patterns, and see real implementations in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Interactive Docs Mode
              </h3>
              <p className="text-white/60 text-sm">
                Click the docs button to highlight components and explore their
                APIs, props, and usage patterns directly on the page.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Headless Architecture
              </h3>
              <p className="text-white/60 text-sm">
                Components separate logic from UI using render props, making
                them reusable, testable, and framework-agnostic.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Open Source
              </h3>
              <p className="text-white/60 text-sm">
                All source code is available with comprehensive documentation,
                best practices, and real-world implementation examples.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-pink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                AI-Ready Development
              </h3>
              <p className="text-white/60 text-sm">
                Structured documentation and patterns designed for AI-assisted
                development and rapid prototyping workflows.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-400/30">
              <span className="text-white/80 text-sm">
                💡 <strong>Pro Tip:</strong> Look for the docs button (📋) in
                the top-left corner of any page
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Docs Mode Feature Section */}
      <div
        id="docs-mode"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Interactive Documentation Mode
                </h2>
              </div>

              <p className="text-xl text-white/80 mb-6 leading-relaxed">
                Discover our innovative{" "}
                <span className="text-blue-300 font-semibold">docs mode</span> -
                click any page to highlight headless components and explore
                their documentation in real-time.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Headless Components Architecture
                    </h3>
                    <p className="text-white/70 text-sm">
                      Every component separates business logic from presentation
                      using render props, making them reusable and testable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Visual Component Discovery
                    </h3>
                    <p className="text-white/70 text-sm">
                      Components glow with blue borders in docs mode, showing
                      you exactly what's interactive and documented.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      Inline Documentation
                    </h3>
                    <p className="text-white/70 text-sm">
                      Click any highlighted component to open detailed docs with
                      APIs, examples, and implementation guides.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="/store/products/acme-t-shirt?docsMode=true"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <span>Try Docs Mode</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white/60 text-xs">Interactive Demo</div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>

                  {/* Simulated component with docs highlight */}
                  <div className="relative">
                    <div className="h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border-2 border-blue-400/50 animate-pulse"></div>
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Click for docs
                    </div>
                  </div>

                  <div className="h-4 bg-white/10 rounded w-3/4"></div>

                  {/* Another simulated component */}
                  <div className="relative">
                    <div className="h-12 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg border-2 border-green-400/50 animate-pulse delay-300"></div>
                    <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      Interactive
                    </div>
                  </div>

                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>

                {/* Docs drawer simulation */}
                <div className="absolute -right-4 top-8 w-48 h-32 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-3 transform rotate-2 shadow-xl">
                  <div className="text-white/80 text-xs mb-2 font-medium">
                    Component Docs
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-white/20 rounded w-full"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2
            id="available-features"
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Available Features
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Each feature includes working examples, source code, and
            step-by-step implementation guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Wix Stores */}
          <a
            href="/store"
            className="group block transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/50 to-teal-500/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                  <span className="text-green-300 text-sm font-medium">
                    Available
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Wix Stores</h3>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                E-commerce functionality including product catalogs, shopping
                cart, checkout process, inventory management, and order
                processing.
              </p>
              <div className="flex items-center text-green-300 font-semibold group-hover:text-green-200 transition-colors duration-300">
                <span>Explore Now</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </a>

          {/* Members Management */}
          <a
            href="/members"
            className="group block transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/50 to-purple-500/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                  <span className="text-green-300 text-sm font-medium">
                    Available
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Members Management
              </h3>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                Complete member authentication, profile management, registration
                flows, and member data handling with secure sessions.
              </p>
              <div className="flex items-center text-blue-300 font-semibold group-hover:text-blue-200 transition-colors duration-300">
                <span>Explore Now</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </a>

          {/* Wix Forms - Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/50 to-emerald-600/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/30">
                  <span className="text-orange-300 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">
                Wix Forms
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Dynamic form creation, submissions management, custom fields,
                validation, and automated email responses.
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>In Development</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Wix Bookings */}
          <a
            href="/bookings"
            className="group block transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/50 to-pink-500/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30">
                  <span className="text-green-300 text-sm font-medium">
                    Available
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Wix Bookings
              </h3>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                Complete appointment scheduling and service management platform.
                Multiple implementation examples showing different booking flows
                and UI patterns.
              </p>
              <div className="flex items-center text-purple-300 font-semibold group-hover:text-purple-200 transition-colors duration-300">
                <span>Explore Now</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </a>

          {/* Events - Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/50 to-orange-500/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/30">
                  <span className="text-orange-300 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">
                Wix Events
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Event creation and management, ticket sales, RSVPs, guest lists,
                event promotion, and check-in systems.
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>In Development</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Data Collections - Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/50 to-blue-500/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/30">
                  <span className="text-orange-300 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">
                Data Collections
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Custom database schemas, CRUD operations, data filtering,
                sorting, pagination, and advanced querying capabilities.
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>In Development</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Restaurants - Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/50 to-red-600/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/30">
                  <span className="text-orange-300 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">
                Restaurants
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Restaurant management including menus, online ordering, table
                reservations, and delivery systems.
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>In Development</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Search - Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/50 to-orange-600/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/30">
                  <span className="text-orange-300 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">Search</h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Advanced search functionality with filtering, autocomplete, and
                intelligent search across your site content.
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>In Development</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* SEO - Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500/50 to-cyan-600/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-400/30">
                  <span className="text-orange-300 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">SEO</h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Search engine optimization tools including meta tags, sitemaps,
                structured data, and performance optimization.
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>In Development</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* More Coming Soon */}
          <div className="group block transform transition-all duration-300 hover:scale-105">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10 p-8 h-full hover:bg-white/10 transition-all duration-300 opacity-75">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/50 to-indigo-600/50 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                  <span className="text-blue-300 text-sm font-medium">
                    More Soon
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white/70 mb-3">
                More Features
              </h3>
              <p className="text-white/50 text-base leading-relaxed mb-4">
                Additional Wix platform features and integrations are being
                added regularly. Stay tuned for updates!
              </p>
              <div className="flex items-center text-white/40 font-semibold">
                <span>Expanding</span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
