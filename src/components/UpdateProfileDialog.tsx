import {
  ProfileFormField,
  ProfileUpdateProgress,
  ProfileUpdateTrigger,
} from "../headless/members/ProfileUpdate";

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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Dialog Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-7 h-7"
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
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-6">
            {/* Personal Information Section */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <svg
                  className="w-6 h-6"
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
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileFormField field="firstName">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="lastName">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="nickname">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Nickname
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your display name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="profileTitle">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Profile Title
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your title or role"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="birthdate">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Birthdate
                      </label>
                      <input
                        type="date"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="privacyStatus">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Privacy Status
                      </label>
                      <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileFormField field="company">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your company name"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="jobTitle">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your job title"
                      />
                    </div>
                  )}
                </ProfileFormField>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <svg
                  className="w-6 h-6"
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
                Contact Information
              </h3>
              <div className="space-y-4">
                <ProfileFormField field="emails">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Additional Emails
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="email1@example.com, email2@example.com"
                      />
                      <p className="text-white/50 text-xs mt-1">
                        Separate multiple emails with commas
                      </p>
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="phones">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Phone Numbers
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="+1-555-123-4567, +1-555-987-6543"
                      />
                      <p className="text-white/50 text-xs mt-1">
                        Separate multiple phones with commas
                      </p>
                    </div>
                  )}
                </ProfileFormField>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <ProfileFormField field="addressLine">
                    {({ value, onChange }) => (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Apt 4B, Suite 100, etc."
                        />
                      </div>
                    )}
                  </ProfileFormField>
                </div>

                <ProfileFormField field="city">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="New York"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="subdivision">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="NY"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="postalCode">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="10001"
                      />
                    </div>
                  )}
                </ProfileFormField>

                <ProfileFormField field="country">
                  {({ value, onChange }) => (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="US"
                        maxLength={2}
                      />
                      <p className="text-white/50 text-xs mt-1">
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
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            {updateState.type === "loading" && (
                              <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-blue-500 rounded-full"></div>
                            )}
                            {updateState.type === "success" && (
                              <svg
                                className="w-6 h-6 text-green-400"
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
                            )}
                            {updateState.type === "error" && (
                              <svg
                                className="w-6 h-6 text-red-400"
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
                            )}
                          </div>
                          <p className="text-white font-medium">
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
              {({ updateProfile, canUpdate, isUpdating }) => (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={updateProfile}
                    disabled={!canUpdate}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    <span className="flex items-center justify-center gap-3">
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
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </ProfileUpdateTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
