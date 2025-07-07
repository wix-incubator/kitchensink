import {
  ProfileFormField,
  ProfileUpdateProgress,
  ProfileUpdateTrigger,
} from '../headless/members/components/ProfileUpdate';
import { PencilIcon } from './icons/PencilIcon';
import { CloseIcon } from './icons/CloseIcon';
import { UserIcon } from './icons/UserIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MailIcon } from './icons/MailIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { CheckIcon } from './icons/CheckIcon';

interface UpdateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateProfileDialog({
  isOpen,
  onClose,
}: UpdateProfileDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--theme-bg-tooltip)] backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Dialog Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-[var(--theme-bg-options)] backdrop-blur-lg rounded-3xl shadow-2xl border border-[var(--theme-border-primary-20)] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary-20)]">
            <h2 className="text-2xl font-bold text-[var(--theme-text-content)] flex items-center gap-3">
              <PencilIcon className="w-7 h-7" />
              Update Profile
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--theme-text-content-60)] hover:text-[var(--theme-text-content)] transition-colors p-2 hover:bg-[var(--theme-bg-options)] rounded-lg"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-6">
            {/* Personal Information Section */}
            <div className="bg-[var(--theme-bg-options)] rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-4 flex items-center gap-3">
                <UserIcon className="w-6 h-6" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileFormField field="firstName">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="lastName">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="nickname">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Nickname
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="Your display name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="profileTitle">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Profile Title
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="Your title or role"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="birthdate">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Birthdate
                      </label>
                      <input
                        type="date"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="privacyStatus">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Privacy Status
                      </label>
                      <select
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                      >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                      </select>
                    </div>
                  )}
                </ProfileFormField>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-[var(--theme-bg-options)] rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-4 flex items-center gap-3">
                <BriefcaseIcon className="w-6 h-6" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileFormField field="company">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="Your company name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="jobTitle">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="Your job title"
                      />
                    </div>
                  )}
                </ProfileFormField>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-[var(--theme-bg-options)] rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-4 flex items-center gap-3">
                <MailIcon className="w-6 h-6" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <ProfileFormField field="emails">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Additional Emails
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="email1@example.com, email2@example.com"
                      />
                      <p className="text-[var(--theme-text-content-50)] text-xs mt-1">
                        Separate multiple emails with commas
                      </p>
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="phones">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Phone Numbers
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="+1-555-123-4567, +1-555-987-6543"
                      />
                      <p className="text-[var(--theme-text-content-50)] text-xs mt-1">
                        Separate multiple phones with commas
                      </p>
                    </div>
                  )}
                </ProfileFormField>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-[var(--theme-bg-options)] rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-4 flex items-center gap-3">
                <LocationMarkerIcon className="w-6 h-6" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <ProfileFormField field="addressLine">
                    {({ value, onChange }) => (
                      <div>
                        <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={e => onChange(e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                          placeholder="123 Main Street"
                        />
                      </div>
                    )}
                  </ProfileFormField>
                </div>

                <div className="md:col-span-2">
                  <ProfileFormField field="addressLine2">
                    {({ value, onChange }) => (
                      <div>
                        <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={e => onChange(e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                          placeholder="Apt 4B, Suite 100, etc."
                        />
                      </div>
                    )}
                  </ProfileFormField>
                </div>

                <ProfileFormField field="city">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="New York"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="subdivision">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="NY"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="postalCode">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="10001"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="country">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-[var(--theme-text-content-80)] text-sm font-medium mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--theme-bg-options)] border border-[var(--theme-border-primary-20)] rounded-lg text-[var(--theme-text-content)] placeholder-[var(--theme-text-content-50)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-500)] focus:border-transparent transition-all"
                        placeholder="US"
                        maxLength={2}
                      />
                      <p className="text-[var(--theme-text-content-50)] text-xs mt-1">
                        2-letter country code (e.g., US, CA, GB)
                      </p>
                    </div>
                  )}
                </ProfileFormField>
              </div>
            </div>

            {/* Update Status */}
            <ProfileUpdateProgress>
              {({ updateState, hasMessage }) => (
                <>
                  {hasMessage && (
                    <div className="mb-6">
                      <div className="bg-[var(--theme-bg-options)] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            {updateState.type === 'loading' && (
                              <div className="animate-spin w-6 h-6 border-2 border-[var(--theme-border-primary-30)] border-t-[var(--theme-primary-500)] rounded-full"></div>
                            )}
                            {updateState.type === 'success' && (
                              <CheckIcon className="w-6 h-6 text-[var(--theme-text-success)]" />
                            )}
                            {updateState.type === 'error' && (
                              <CloseIcon className="w-6 h-6 text-[var(--theme-text-error)]" />
                            )}
                          </div>
                          <p className="text-[var(--theme-text-content)] font-medium">
                            {updateState.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </ProfileUpdateProgress>

            {/* Form Actions */}
            <ProfileUpdateTrigger>
              {({ updateProfile, canUpdate, isUpdating }) => {
                const handleUpdateProfile = async () => {
                  await updateProfile();
                  // Wait a moment for the success state to be visible to the user
                  setTimeout(() => {
                    onClose();
                  }, 1500);
                };

                return (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={!canUpdate}
                      className="flex-1 text-[var(--theme-text-content)] font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none"
                      style={{
                        background: canUpdate
                          ? 'var(--theme-btn-primary)'
                          : 'var(--theme-bg-options)',
                        cursor: !canUpdate ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (canUpdate) {
                          e.currentTarget.style.background =
                            'var(--theme-btn-primary-hover)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (canUpdate) {
                          e.currentTarget.style.background =
                            'var(--theme-btn-primary)';
                        }
                      }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        <CheckIcon className="w-5 h-5" />
                        {isUpdating ? 'Updating...' : 'Update Profile'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-4 bg-[var(--theme-bg-options)] hover:bg-[var(--theme-bg-primary-10)] text-[var(--theme-text-content)] font-semibold rounded-xl transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                );
              }}
            </ProfileUpdateTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
