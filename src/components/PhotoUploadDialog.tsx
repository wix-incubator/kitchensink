import React, { useState, useRef } from "react";

interface PhotoUploadDialogProps {
  member?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoUploadDialog({
  member,
  isOpen,
  onClose,
}: PhotoUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "loading" | "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploadState = () => {
    setSelectedFile(null);
    setShowPreview(false);
    setUploadStatus({ type: null, message: "" });
    setDragOver(false);
  };

  const handleClose = () => {
    resetUploadState();
    onClose();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadStatus({
        type: "error",
        message: "Please select an image file (JPG, PNG, GIF)",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "File size must be less than 10MB",
      });
      return;
    }

    setSelectedFile(file);
    setShowPreview(true);
    setUploadStatus({ type: null, message: "" });
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus({ type: "loading", message: "Uploading photo..." });

      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Photo updated successfully!",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await response.text();
        setUploadStatus({ type: "error", message: `Upload failed: ${error}` });
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: "Upload failed. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
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
              onClick={handleClose}
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
                {member?.profile?.photo?.url ? (
                  <img
                    src={member.profile.photo.url}
                    alt="Current profile photo"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
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
                {!showPreview ? (
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
                      Drag & drop your image here or click to browse
                    </p>
                    <p className="text-white/50 text-sm">
                      Supports: JPG, PNG, GIF (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    {selectedFile && (
                      <img
                        src={URL.createObjectURL(selectedFile)}
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

            {/* Upload Status */}
            {uploadStatus.type && (
              <div className="mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      {uploadStatus.type === "loading" && (
                        <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-blue-500 rounded-full"></div>
                      )}
                      {uploadStatus.type === "success" && (
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
                      {uploadStatus.type === "error" && (
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
                      {uploadStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4">
              <button
                onClick={uploadPhoto}
                disabled={!selectedFile || uploadStatus.type === "loading"}
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
                  Update Photo
                </span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
