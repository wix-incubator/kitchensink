import { useRef } from "react";
import {
  FileSelector,
  PreviewImage,
  UploadProgress,
  UploadTrigger,
} from "../headless/members/components/PhotoUpload";
import { CurrentMemberProfile } from "../headless/members/components/CurrentMemberProfile";

interface PhotoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoUploadDialog({
  isOpen,
  onClose,
}: PhotoUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--theme-bg-tooltip)] backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Dialog Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-[var(--theme-bg-options)] backdrop-blur-lg rounded-3xl shadow-2xl border border-[var(--theme-border-primary-20)] w-full max-w-2xl">
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary-20)]">
            <h2 className="text-2xl font-bold text-[var(--theme-text-content)] flex items-center gap-3">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Update Profile Photo
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--theme-text-content-60)] hover:text-[var(--theme-text-content)] transition-colors p-2 hover:bg-[var(--theme-bg-options)] rounded-lg"
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
            {/* Current Photo Preview */}
            <div className="text-center mb-6">
              <p className="text-[var(--theme-text-content-80)] text-sm mb-4">
                Current Profile Photo
              </p>
              <div className="relative inline-block">
                <CurrentMemberProfile.ProfilePhoto>
                  {({ photoUrl, hasPhoto, altText }) =>
                    hasPhoto ? (
                      <img
                        src={photoUrl}
                        alt={altText}
                        className="w-32 h-32 rounded-full border-4 border-[var(--theme-border-primary-30)] shadow-xl object-cover"
                      />
                    ) : (
                      <div
                        className="w-32 h-32 rounded-full border-4 border-[var(--theme-border-primary-30)] shadow-xl flex items-center justify-center"
                        style={{ background: "var(--theme-gradient-primary)" }}
                      >
                        <svg
                          className="w-16 h-16 text-[var(--theme-text-content)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )
                  }
                </CurrentMemberProfile.ProfilePhoto>
              </div>
            </div>

            {/* Upload Area */}
            <FileSelector>
              {({
                dragOver,
                handleDragOver,
                handleDragLeave,
                handleDrop,
                handleFileSelect,
              }) => (
                <div className="mb-6">
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer group ${
                      dragOver
                        ? "border-[var(--theme-primary-500)] bg-[var(--theme-bg-primary-10)]"
                        : "border-[var(--theme-border-primary-30)] bg-[var(--theme-bg-options)] hover:bg-[var(--theme-bg-primary-10)]"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PreviewImage>
                      {({ hasPreview, previewUrl, selectedFile }) => (
                        <>
                          {!hasPreview ? (
                            <div>
                              <svg
                                className="w-16 h-16 text-[var(--theme-text-content-60)] mx-auto mb-4 group-hover:text-[var(--theme-text-content-80)] transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <h3 className="text-xl font-semibold text-[var(--theme-text-content)] mb-2">
                                Upload New Photo
                              </h3>
                              <p className="text-[var(--theme-text-content-60)] mb-4">
                                Drag & drop your image here or click to browse
                              </p>
                              <p className="text-[var(--theme-text-content-50)] text-sm">
                                Supports: JPG, PNG, GIF (Max 10MB)
                              </p>
                            </div>
                          ) : (
                            <div>
                              {previewUrl && (
                                <img
                                  src={previewUrl}
                                  alt="New photo preview"
                                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-[var(--theme-border-primary-30)]"
                                />
                              )}
                              <p className="text-[var(--theme-text-content-80)] font-medium mb-2">
                                New Photo Selected
                              </p>
                              <p className="text-[var(--theme-text-content-60)] text-sm">
                                {selectedFile?.name}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </PreviewImage>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              )}
            </FileSelector>

            {/* Upload Status */}
            <UploadProgress>
              {({ uploadState, hasMessage }) => (
                <>
                  {hasMessage && (
                    <div className="mb-6">
                      <div className="bg-[var(--theme-bg-options)] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            {uploadState.type === "loading" && (
                              <div className="animate-spin w-6 h-6 border-2 border-[var(--theme-border-primary-30)] border-t-[var(--theme-primary-500)] rounded-full"></div>
                            )}
                            {uploadState.type === "success" && (
                              <svg
                                className="w-6 h-6 text-[var(--theme-text-success)]"
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
                            {uploadState.type === "error" && (
                              <svg
                                className="w-6 h-6 text-[var(--theme-text-error)]"
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
                          <p className="text-[var(--theme-text-content)] font-medium">
                            {uploadState.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </UploadProgress>

            {/* Form Actions */}
            <UploadTrigger>
              {({ uploadPhoto, canUpload, isUploading }) => {
                const handleUploadPhoto = async () => {
                  await uploadPhoto();
                  onClose();
                };

                return (
                  <div className="flex gap-4">
                    <button
                      onClick={handleUploadPhoto}
                      disabled={!canUpload}
                      className="flex-1 text-[var(--theme-text-content)] font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none"
                      style={{
                        background: canUpload
                          ? "var(--theme-btn-primary)"
                          : "var(--theme-bg-options)",
                        cursor: !canUpload ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (canUpload) {
                          e.currentTarget.style.background =
                            "var(--theme-btn-primary-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (canUpload) {
                          e.currentTarget.style.background =
                            "var(--theme-btn-primary)";
                        }
                      }}
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        {isUploading ? "Uploading..." : "Update Photo"}
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
            </UploadTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
