import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { PhotoUploadServiceDefinition } from "./photo-upload-service";

export const FileSelector = (props: {
  children: (props: {
    selectedFile: File | null;
    previewUrl: string | null;
    dragOver: boolean;
    selectFile: (file: File) => void;
    clearFile: () => void;
    handleDragOver: (event: React.DragEvent) => void;
    handleDragLeave: (event: React.DragEvent) => void;
    handleDrop: (event: React.DragEvent) => void;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => React.ReactNode;
}) => {
  const service = useService(PhotoUploadServiceDefinition) as ServiceAPI<
    typeof PhotoUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const previewUrl = service.previewUrl.get();
  const dragOver = service.dragOver.get();

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    service.setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    service.setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    service.setDragOver(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      service.selectFile(files[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      service.selectFile(files[0]);
    }
  };

  return props.children({
    selectedFile,
    previewUrl,
    dragOver,
    selectFile: service.selectFile,
    clearFile: service.clearFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  });
};

export const UploadProgress = (props: {
  children: (props: {
    uploadState: {
      type: "idle" | "loading" | "success" | "error";
      message: string;
      progress?: number;
    };
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    hasError: boolean;
    hasMessage: boolean;
  }) => React.ReactNode;
}) => {
  const service = useService(PhotoUploadServiceDefinition) as ServiceAPI<
    typeof PhotoUploadServiceDefinition
  >;

  const uploadState = service.uploadState.get();

  return props.children({
    uploadState,
    isLoading: uploadState.type === "loading",
    isSuccess: uploadState.type === "success",
    isError: uploadState.type === "error",
    hasError: uploadState.type === "error",
    hasMessage: uploadState.message !== "",
  });
};

export const UploadTrigger = (props: {
  children: (props: {
    uploadPhoto: () => Promise<void>;
    canUpload: boolean;
    isUploading: boolean;
  }) => React.ReactNode;
}) => {
  const service = useService(PhotoUploadServiceDefinition) as ServiceAPI<
    typeof PhotoUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const uploadState = service.uploadState.get();

  const canUpload = selectedFile !== null && uploadState.type !== "loading";
  const isUploading = uploadState.type === "loading";

  return props.children({
    uploadPhoto: service.uploadPhoto,
    canUpload,
    isUploading,
  });
};

export const PreviewImage = (props: {
  children: (props: {
    selectedFile: File | null;
    previewUrl: string | null;
    hasPreview: boolean;
  }) => React.ReactNode;
}) => {
  const service = useService(PhotoUploadServiceDefinition) as ServiceAPI<
    typeof PhotoUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const previewUrl = service.previewUrl.get();

  return props.children({
    selectedFile,
    previewUrl,
    hasPreview: previewUrl !== null,
  });
};
