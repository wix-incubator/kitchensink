import "../../styles/theme-1.css";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import { actions } from "astro:actions";
import { useState } from "react";
import { PageDocsRegistration } from "../../components/DocsMode";
import { CameraIcon } from "../../components/icons/CameraIcon";
import { CheckCircleIcon } from "../../components/icons/CheckCircleIcon";
import { CheckIcon } from "../../components/icons/CheckIcon";
import { MailIcon } from "../../components/icons/MailIcon";
import { PencilIcon } from "../../components/icons/PencilIcon";
import { SignOutIcon } from "../../components/icons/SignOutIcon";
import { UserIcon } from "../../components/icons/UserIcon";
import PhotoUploadDialog from "../../components/PhotoUploadDialog";
import UpdateProfileDialog from "../../components/UpdateProfileDialog";
import {
  CurrentMemberService,
  CurrentMemberServiceDefinition,
  type CurrentMemberServiceConfig,
} from "../../headless/members/services/current-member-service";
import { CurrentMemberProfile } from "../../headless/members/components";
import {
  ProfileUpdateService,
  ProfileUpdateServiceDefinition,
  type ProfileUpdateServiceConfig,
} from "../../headless/members/services/profile-update-service";
import { KitchensinkLayout } from "../../layouts/KitchensinkLayout";
import {
  loadPhotoUploadServiceConfig,
  PhotoUploadService,
  PhotoUploadServiceDefinition,
} from "../../headless/members/services/photo-upload-service";

interface ProfilePageProps {
  currentMemberServiceConfig?: CurrentMemberServiceConfig;
  profileUpdateServiceConfig?: ProfileUpdateServiceConfig;
}

export function ProfilePage({
  currentMemberServiceConfig,
  profileUpdateServiceConfig,
}: ProfilePageProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);

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
        profileUpdateServiceConfig
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

        {/* Centered Profile Layout */}
        <div className="flex items-center justify-center min-h-screen p-4 lg:p-6">
          {/* User Profile Panel */}
          <div className="bg-[var(--theme-bg-options)] backdrop-blur-lg rounded-3xl shadow-2xl border border-[var(--theme-border-primary-20)] p-6 lg:p-8 w-full lg:max-w-md flex flex-col">
            {/* Profile Section */}
            <div className="text-center mb-6 lg:mb-8">
              <CurrentMemberProfile.ProfilePhoto>
                {({ photoUrl, hasPhoto, altText }) => (
                  <div className="relative inline-block mb-6 group">
                    {hasPhoto ? (
                      <img
                        src={photoUrl}
                        alt={altText}
                        className="w-24 h-24 rounded-full border-4 border-[var(--theme-border-primary-30)] shadow-2xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-[var(--theme-border-primary-30)] shadow-2xl flex items-center justify-center" style={{ background: 'var(--theme-gradient-primary)' }}>
                        <UserIcon className="w-12 h-12 text-[var(--theme-text-content)]" />
                      </div>
                    )}
                    {/* Edit Photo Button */}
                    <button
                      onClick={() => setShowPhotoDialog(true)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-3 border-[var(--theme-text-content)] flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg"
                      style={{ background: 'var(--theme-primary-500)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--theme-primary-600)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--theme-primary-500)';
                      }}
                      title="Change profile photo"
                    >
                      <CameraIcon className="w-4 h-4 text-[var(--theme-text-content)]" />
                    </button>
                    {/* Status Badge */}
                    <CurrentMemberProfile.ActivityStatus>
                      {({ isActive }) => (
                        <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-[var(--theme-text-success)] rounded-full border-2 border-[var(--theme-text-content)] flex items-center justify-center">
                          <CheckIcon className="w-3 h-3 text-[var(--theme-text-content)]" />
                        </div>
                      )}
                    </CurrentMemberProfile.ActivityStatus>
                  </div>
                )}
              </CurrentMemberProfile.ProfilePhoto>

              <CurrentMemberProfile.Nickname>
                {({ displayName }) => (
                  <h1 className="text-3xl font-bold text-[var(--theme-text-content)] mb-2">
                    Welcome back, {displayName}!
                  </h1>
                )}
              </CurrentMemberProfile.Nickname>

              <CurrentMemberProfile.FullName>
                {({ hasFullName, fullName }) => (
                  <>
                    {hasFullName && (
                      <p className="text-[var(--theme-text-content-80)] text-lg mb-2">{fullName}</p>
                    )}
                  </>
                )}
              </CurrentMemberProfile.FullName>

              <CurrentMemberProfile.Email>
                {({ hasEmail, email, isVerified }) => (
                  <>
                    {hasEmail && (
                      <p className="text-[var(--theme-text-content-60)] text-sm mb-4 flex items-center justify-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        {email}
                        {isVerified && (
                          <CheckCircleIcon className="w-4 h-4 text-[var(--theme-text-success)]" />
                        )}
                      </p>
                    )}
                  </>
                )}
              </CurrentMemberProfile.Email>

              <CurrentMemberProfile.LastLoginDate>
                {({ hasLastLogin, formattedDate }) => (
                  <>
                    {hasLastLogin && (
                      <p className="text-[var(--theme-text-content-50)] text-xs">
                        Last login: {formattedDate}
                      </p>
                    )}
                  </>
                )}
              </CurrentMemberProfile.LastLoginDate>
            </div>

            {/* Member Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <CurrentMemberProfile.ActivityStatus>
                {({ displayStatus }) => (
                  <div className="bg-[var(--theme-bg-options)] rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[var(--theme-text-content)] mb-1">
                      {displayStatus}
                    </div>
                    <div className="text-[var(--theme-text-content-60)] text-sm">Status</div>
                  </div>
                )}
              </CurrentMemberProfile.ActivityStatus>
              <CurrentMemberProfile.DaysMember>
                {({ daysMember }) => (
                  <div className="bg-[var(--theme-bg-options)] rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[var(--theme-text-content)] mb-1">
                      {daysMember}
                    </div>
                    <div className="text-[var(--theme-text-content-60)] text-sm">Days Member</div>
                  </div>
                )}
              </CurrentMemberProfile.DaysMember>
            </div>

            {/* Update Profile Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowUpdateDialog(true)}
                className="w-full text-[var(--theme-text-content)] font-semibold py-3 lg:py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                style={{ background: 'var(--theme-btn-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--theme-btn-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--theme-btn-primary)';
                }}
              >
                <span className="flex items-center justify-center gap-3">
                  <PencilIcon className="w-5 lg:w-6 h-5 lg:h-6" />
                  Update Profile
                </span>
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <form
                action="/api/auth/logout?returnToUrl=/members"
                method="POST"
                className="w-full"
                data-astro-reload
              >
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 lg:py-4 px-6 border border-transparent text-base lg:text-lg font-semibold rounded-2xl text-[var(--theme-text-content)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-text-error)] transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{ background: 'var(--theme-btn-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--theme-btn-secondary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--theme-btn-secondary)';
                  }}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-6">
                    <SignOutIcon className="h-5 lg:h-6 w-5 lg:w-6 text-[var(--theme-text-content-80)] group-hover:text-[var(--theme-text-content)] transition-colors" />
                  </span>
                  Sign Out
                </button>
              </form>

              <div className="text-center">
                <p className="text-[var(--theme-text-content-60)] text-sm">
                  Secure logout powered by Wix
                </p>
              </div>
            </div>

            <div className="mt-6 lg:mt-8 pt-6 border-t border-[var(--theme-border-primary-20)]">
              <div className="text-center">
                <p className="text-[var(--theme-text-content-60)] text-sm">
                  Thanks for being a member! Click above to sign out when you're
                  done.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Dialog */}
        <UpdateProfileDialog
          isOpen={showUpdateDialog}
          onClose={() => setShowUpdateDialog(false)}
        />

        {/* Photo Upload Dialog */}
        <PhotoUploadDialog
          isOpen={showPhotoDialog}
          onClose={() => setShowPhotoDialog(false)}
        />
      </KitchensinkLayout>
    </ServicesManagerProvider>
  );
}
