import { useRef } from "react";
import {
  FileSelector,
  PreviewImage,
  UploadProgress,
  UploadTrigger,
} from "../headless/members/PhotoUpload";
import { withDocsWrapper } from "./DocsMode";
import { CurrentMemberProfile } from "../headless/members/CurrentMemberProfile";

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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Dialog Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Update Profile Photo
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
            {/* Current Photo Preview */}
            <div className="text-center mb-6">
              <p className="text-white/80 text-sm mb-4">
                Current Profile Photo
              </p>
              <div className="relative inline-block">
                <CurrentMemberProfile.ProfilePhoto>
                  {({ photoUrl, hasPhoto, altText }) =>
                    hasPhoto ? (
                      <img
                        src={photoUrl}
                        alt={altText}
                        className="w-32 h-32 rounded-full border-4 border-white/30 shadow-xl object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white"
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
              {withDocsWrapper(
                ({
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
                          ? "border-blue-400 bg-blue-500/10"
                          : "border-white/30 bg-white/5 hover:bg-white/10"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PreviewImage>
                        {withDocsWrapper(
                          ({ hasPreview, previewUrl, selectedFile }) => (
                            <>
                              {!hasPreview ? (
                                <div>
                                  <svg
                                    className="w-16 h-16 text-white/60 mx-auto mb-4 group-hover:text-white/80 transition-colors"
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
                                  <h3 className="text-xl font-semibold text-white mb-2">
                                    Upload New Photo
                                  </h3>
                                  <p className="text-white/60 mb-4">
                                    Drag & drop your image here or click to
                                    browse
                                  </p>
                                  <p className="text-white/50 text-sm">
                                    Supports: JPG, PNG, GIF (Max 10MB)
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  {previewUrl && (
                                    <img
                                      src={previewUrl}
                                      alt="New photo preview"
                                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white/30"
                                    />
                                  )}
                                  <p className="text-white/80 font-medium mb-2">
                                    New Photo Selected
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    {selectedFile?.name}
                                  </p>
                                </div>
                              )}
                            </>
                          ),
                          "PhotoUpload.PreviewImage",
                          "/docs/components/photo-upload#previewimage"
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
                ),
                "PhotoUpload.FileSelector",
                "/docs/components/photo-upload#fileselector"
              )}
            </FileSelector>

            {/* Upload Status */}
            <UploadProgress>
              {withDocsWrapper(
                ({ uploadState, hasMessage }) => (
                  <>
                    {hasMessage && (
                      <div className="mb-6">
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div>
                              {uploadState.type === "loading" && (
                                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-blue-500 rounded-full"></div>
                              )}
                              {uploadState.type === "success" && (
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
                              {uploadState.type === "error" && (
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
                              {uploadState.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ),
                "PhotoUpload.UploadProgress",
                "/docs/components/photo-upload#uploadprogress"
              )}
            </UploadProgress>

            {/* Form Actions */}
            <UploadTrigger>
              {withDocsWrapper(
                ({ uploadPhoto, canUpload, isUploading }) => {
                  const handleUploadPhoto = async () => {
                    await uploadPhoto();
                    onClose();
                  };

                  return (
                    <div className="flex gap-4">
                      <button
                        onClick={handleUploadPhoto}
                        disabled={!canUpload}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none"
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
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                },
                "PhotoUpload.UploadTrigger",
                "/docs/components/photo-upload#uploadtrigger"
              )}
            </UploadTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
