import { useEffect, useState } from "react";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { KitchensinkLayout } from "../../layouts/KitchensinkLayout";
import PhotoUploadDialog from "../../components/PhotoUploadDialog";
import UpdateProfileDialog from "../../components/UpdateProfileDialog";
import {
  CurrentMemberServiceDefinition,
  CurrentMemberService,
} from "../../headless/members/current-member-service";
import {
  ProfileUpdateServiceDefinition,
  ProfileUpdateService,
} from "../../headless/members/profile-update-service";
import {
  PhotoUploadServiceDefinition,
  PhotoUploadService,
} from "../../headless/members/photo-upload-service";
import { CurrentMemberProfile } from "../../headless/members/CurrentMemberProfile";
import { actions } from "astro:actions";
import {
  withDocsWrapper,
  PageDocsRegistration,
} from "../../components/DocsMode";

interface MembersPageProps {
  userIsLoggedIn: boolean;
  member?: any;
  updated?: string | null;
  error?: string | null;
  currentMemberServiceConfig?: any;
  profileUpdateServiceConfig?: any;
}

const ProfileContent = ({
  setShowPhotoDialog,
}: {
  setShowPhotoDialog: (show: boolean) => void;
}) => {
  return (
    <>
      <CurrentMemberProfile.ProfilePhoto>
        {withDocsWrapper(
          ({ photoUrl, hasPhoto, altText }) => (
            <div className="relative inline-block mb-6 group">
              {hasPhoto ? (
                <img
                  src={photoUrl}
                  alt={altText}
                  className="w-24 h-24 rounded-full border-4 border-white/30 shadow-2xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white/30 shadow-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
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
              )}
              {/* Edit Photo Button */}
              <button
                onClick={() => setShowPhotoDialog(true)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full border-3 border-white flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
                title="Change profile photo"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              {/* Status Badge */}
              <CurrentMemberProfile.ActivityStatus>
                {withDocsWrapper(
                  ({ isActive }) => (
                    <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ),
                  "CurrentMemberProfile.ActivityStatus",
                  "/docs/components/current-member-profile#activitystatus"
                )}
              </CurrentMemberProfile.ActivityStatus>
            </div>
          ),
          "CurrentMemberProfile.ProfilePhoto",
          "/docs/components/current-member-profile#profilephoto"
        )}
      </CurrentMemberProfile.ProfilePhoto>

      <CurrentMemberProfile.Nickname>
        {withDocsWrapper(
          ({ displayName }) => (
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {displayName}!
            </h1>
          ),
          "CurrentMemberProfile.Nickname",
          "/docs/components/current-member-profile#nickname"
        )}
      </CurrentMemberProfile.Nickname>

      <CurrentMemberProfile.FullName>
        {withDocsWrapper(
          ({ hasFullName, fullName }) => (
            <>
              {hasFullName && (
                <p className="text-white/80 text-lg mb-2">{fullName}</p>
              )}
            </>
          ),
          "CurrentMemberProfile.FullName",
          "/docs/components/current-member-profile#fullname"
        )}
      </CurrentMemberProfile.FullName>

      <CurrentMemberProfile.Email>
        {withDocsWrapper(
          ({ hasEmail, email, isVerified }) => (
            <>
              {hasEmail && (
                <p className="text-white/60 text-sm mb-4 flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {email}
                  {isVerified && (
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </p>
              )}
            </>
          ),
          "CurrentMemberProfile.Email",
          "/docs/components/current-member-profile#email"
        )}
      </CurrentMemberProfile.Email>

      <CurrentMemberProfile.LastLoginDate>
        {withDocsWrapper(
          ({ hasLastLogin, formattedDate }) => (
            <>
              {hasLastLogin && (
                <p className="text-white/50 text-xs">
                  Last login: {formattedDate}
                </p>
              )}
            </>
          ),
          "CurrentMemberProfile.LastLoginDate",
          "/docs/components/current-member-profile#lastlogindate"
        )}
      </CurrentMemberProfile.LastLoginDate>
    </>
  );
};

const MemberStatsContent = () => {
  return (
    <>
      <CurrentMemberProfile.ActivityStatus>
        {withDocsWrapper(
          ({ displayStatus }) => (
            <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">
                {displayStatus}
              </div>
              <div className="text-white/60 text-sm">Status</div>
            </div>
          ),
          "CurrentMemberProfile.ActivityStatus",
          "/docs/components/current-member-profile#activitystatus"
        )}
      </CurrentMemberProfile.ActivityStatus>
      <CurrentMemberProfile.DaysMember>
        {withDocsWrapper(
          ({ daysMember }) => (
            <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">
                {daysMember}
              </div>
              <div className="text-white/60 text-sm">Days Member</div>
            </div>
          ),
          "CurrentMemberProfile.DaysMember",
          "/docs/components/current-member-profile#daysmember"
        )}
      </CurrentMemberProfile.DaysMember>
    </>
  );
};

export function MembersPage({
  userIsLoggedIn,
  member,
  updated,
  error,
  currentMemberServiceConfig,
  profileUpdateServiceConfig,
}: MembersPageProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(!!updated);
  const [showErrorMessage, setShowErrorMessage] = useState(!!error);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => setShowErrorMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  // Create services manager with all three services that depend on each other
  const servicesManager = createServicesManager(
    createServicesMap()
      .addService(
        CurrentMemberServiceDefinition,
        CurrentMemberService,
        currentMemberServiceConfig
      )
      .addService(
        ProfileUpdateServiceDefinition,
        ProfileUpdateService,
        profileUpdateServiceConfig || {}
      )
      .addService(PhotoUploadServiceDefinition, PhotoUploadService, {
        maxFileSize: 10 * 1024 * 1024,
        allowedTypes: ["image/jpeg", "image/png", "image/gif"],
        photoUploadAstroActions: actions.photoUploadAstroActions,
      })
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <KitchensinkLayout>
        {/* Register page documentation */}
        <PageDocsRegistration
          title="Members Profile Page"
          description="A complete member profile interface showcasing CurrentMemberProfile, PhotoUpload, and ProfileUpdate headless components working together."
          docsUrl="/docs/examples/members-page-overview"
        />

        {/* Success/Error Messages */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg border border-green-400/30 animate-pulse">
            <div className="flex items-center gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Profile updated successfully!
            </div>
          </div>
        )}

        {showErrorMessage && (
          <div className="fixed top-4 right-4 z-50 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg border border-red-400/30 animate-pulse">
            <div className="flex items-center gap-2">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {error === "update_failed"
                ? "Failed to update profile. Please try again."
                : "An error occurred."}
            </div>
          </div>
        )}

        {userIsLoggedIn ? (
          // Logged in layout - responsive panels (stacked on mobile, side by side on desktop)
          <div className="flex flex-col lg:flex-row min-h-screen p-4 lg:p-6 gap-4 lg:gap-6">
            {/* Left Panel - User Profile */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 w-full lg:max-w-md flex flex-col">
              {/* Profile Section */}
              <div className="text-center mb-6 lg:mb-8">
                <ProfileContent setShowPhotoDialog={setShowPhotoDialog} />
              </div>

              {/* Member Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MemberStatsContent />
              </div>

              {/* Update Profile Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowUpdateDialog(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 lg:py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 lg:w-6 h-5 lg:h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Update Profile
                  </span>
                </button>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <a
                  href="/api/auth/logout"
                  className="group relative w-full flex justify-center py-3 lg:py-4 px-6 border border-transparent text-base lg:text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 hover:from-red-600 hover:via-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-6">
                    <svg
                      className="h-5 lg:h-6 w-5 lg:w-6 text-white/80 group-hover:text-white transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                  Sign Out
                </a>

                <div className="text-center">
                  <p className="text-white/60 text-sm">
                    Secure logout powered by Wix
                  </p>
                </div>
              </div>

              <div className="mt-6 lg:mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-white/60 text-sm">
                    Thanks for being a member! Click above to sign out when
                    you're done.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Coming Soon */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 flex-1 flex flex-col min-h-[400px] lg:min-h-0">
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {/* Empty State Icon */}
                <div className="w-20 lg:w-24 h-20 lg:h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 lg:mb-6 backdrop-blur-sm">
                  <svg
                    className="w-10 lg:w-12 h-10 lg:h-12 text-white/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>

                {/* Empty State Content */}
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
                  More Features Coming Soon
                </h2>
                <p className="text-white/70 text-base lg:text-lg mb-4 lg:mb-6 max-w-md px-4 lg:px-0">
                  We're working on exciting new features for our members. Stay
                  tuned for updates!
                </p>

                {/* Feature Cards Preview */}
                <div className="grid grid-cols-1 gap-3 lg:gap-4 w-full max-w-sm">
                  <div className="bg-white/5 rounded-xl p-3 lg:p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-400"
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
                      <div>
                        <h3 className="text-white font-medium text-sm lg:text-base">
                          Member Analytics
                        </h3>
                        <p className="text-white/50 text-xs lg:text-sm">
                          Activity insights
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 lg:p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-400"
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
                      <div>
                        <h3 className="text-white font-medium text-sm lg:text-base">
                          Community Hub
                        </h3>
                        <p className="text-white/50 text-xs lg:text-sm">
                          Connect with others
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 lg:p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm lg:text-base">
                          Member Rewards
                        </h3>
                        <p className="text-white/50 text-xs lg:text-sm">
                          Exclusive benefits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Not logged in layout - centered single panel (responsive)
          <div className="flex min-h-screen p-4 lg:p-6 items-center justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 w-full max-w-md flex flex-col">
              <div className="text-center mb-6 lg:mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Welcome
                </h1>
                <p className="text-white/80 text-base lg:text-lg">
                  Sign in to continue
                </p>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <a
                  href="/api/auth/login?returnToUrl=/members"
                  className="group relative w-full flex justify-center py-3 lg:py-4 px-6 border border-transparent text-base lg:text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-6">
                    <svg
                      className="h-5 lg:h-6 w-5 lg:w-6 text-white/80 group-hover:text-white transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                  Sign In
                </a>

                <div className="text-center">
                  <p className="text-white/60 text-sm">
                    Secure login powered by Wix
                  </p>
                </div>
              </div>

              <div className="mt-6 lg:mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-white/60 text-sm">
                    Don't have an account? You'll be able to create one after
                    clicking sign in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Profile Dialog */}
        {userIsLoggedIn && (
          <UpdateProfileDialog
            isOpen={showUpdateDialog}
            onClose={() => setShowUpdateDialog(false)}
          />
        )}

        {/* Photo Upload Dialog */}
        {userIsLoggedIn && (
          <PhotoUploadDialog
            member={member}
            isOpen={showPhotoDialog}
            onClose={() => setShowPhotoDialog(false)}
          />
        )}
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}
