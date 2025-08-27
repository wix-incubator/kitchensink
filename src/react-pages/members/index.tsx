import { PageDocsRegistration } from '@/components/DocsMode';
import { KitchensinkLayout } from '../../layouts/KitchensinkLayout';
import '../../styles/theme-1.css';

export function MembersPage() {
  return (
    <KitchensinkLayout>
      <PageDocsRegistration
        title="Wix Members Overview"
        description="A complete solution for user authentication, member management, and social features, with headless components for building customized member experiences."
        docsUrl="/docs/components/members-overview"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-[var(--theme-text-content)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-[var(--theme-text-content)] mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Wix Members
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--theme-text-content-80)] mb-12 max-w-4xl mx-auto leading-relaxed">
              Powerful tools for building and managing online communities. From
              member authentication to social profiles, explore how to create
              engaging, personalized experiences for your users.
            </p>
          </div>
        </div>

        {/* What is Wix Members */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-[var(--theme-bg-options)] backdrop-blur-lg rounded-3xl shadow-2xl border border-[var(--theme-border-primary-10)] p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[var(--theme-text-content)] mb-6">
                What is Wix Members?
              </h2>
              <p className="text-xl text-[var(--theme-text-content-80)] max-w-3xl mx-auto leading-relaxed">
                Wix Members provides a comprehensive suite of tools for user
                authentication, profile management, and social engagement. It
                allows you to build secure, scalable, and interactive member
                areas in your application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Authentication */}
              <div className="bg-[var(--theme-bg-options)] rounded-2xl p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--theme-gradient-primary)' }}
                >
                  <svg
                    className="w-6 h-6 text-[var(--theme-text-content)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--theme-text-content)] mb-2">
                  Secure Authentication
                </h3>
                <p className="text-[var(--theme-text-content-70)] text-sm">
                  Robust, secure, and easy-to-integrate authentication flows for
                  member sign-up and login.
                </p>
              </div>

              {/* Profile Management */}
              <div className="bg-[var(--theme-bg-options)] rounded-2xl p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--theme-gradient-secondary)' }}
                >
                  <svg
                    className="w-6 h-6 text-[var(--theme-text-content)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--theme-text-content)] mb-2">
                  Profile Management
                </h3>
                <p className="text-[var(--theme-text-content-70)] text-sm">
                  Allow members to manage their profiles, update personal
                  information, and customize their settings.
                </p>
              </div>

              {/* Social Features */}
              <div className="bg-[var(--theme-bg-options)] rounded-2xl p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--theme-gradient-accent)' }}
                >
                  <svg
                    className="w-6 h-6 text-[var(--theme-text-content)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--theme-text-content)] mb-2">
                  Social Features
                </h3>
                <p className="text-[var(--theme-text-content-70)] text-sm">
                  Enable member interactions, activity feeds, and community
                  building with integrated social capabilities.
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Examples */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--theme-text-content)] mb-6">
              Implementation Example
            </h2>
            <p className="text-xl text-[var(--theme-text-content-80)] max-w-3xl mx-auto">
              Explore a complete member profile page built with our headless
              components. This example demonstrates a sophisticated,
              feature-rich approach to member profile management.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <a
              href="/members/profile"
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-[var(--theme-bg-options)] backdrop-blur-lg rounded-3xl shadow-2xl border border-[var(--theme-border-primary-10)] p-8 h-full hover:bg-[var(--theme-bg-primary-10)] transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'var(--theme-gradient-primary-50)' }}
                  >
                    <svg
                      className="w-8 h-8 text-[var(--theme-text-content)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div
                    className="px-3 py-1 backdrop-blur-sm rounded-full border border-[var(--theme-border-primary-30)]"
                    style={{ background: 'var(--theme-primary-500-20)' }}
                  >
                    <span className="text-[var(--theme-text-accent)] text-sm font-medium">
                      Live Example
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[var(--theme-text-content)] mb-4">
                  Member Profile Page
                </h3>

                <p className="text-[var(--theme-text-content-70)] text-base leading-relaxed mb-6">
                  A fully functional member profile page showcasing profile
                  photo uploads, information updates, and activity status, all
                  built with our powerful headless components.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--theme-text-accent)] rounded-full"></div>
                    <span className="text-[var(--theme-text-content-80)] text-sm">
                      Headless components for maximum flexibility
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--theme-text-accent)] rounded-full"></div>
                    <span className="text-[var(--theme-text-content-80)] text-sm">
                      Client-side services for state management
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--theme-text-accent)] rounded-full"></div>
                    <span className="text-[var(--theme-text-content-80)] text-sm">
                      Seamless integration with Astro Actions
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-[var(--theme-text-accent)] font-semibold group-hover:text-[var(--theme-text-accent-light)] transition-colors duration-300">
                  <span>View Profile Example</span>
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
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
