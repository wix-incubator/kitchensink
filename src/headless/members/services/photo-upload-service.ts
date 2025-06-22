import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { CurrentMemberServiceDefinition } from "./current-member-service";

export interface UploadState {
  type: "idle" | "loading" | "success" | "error";
  message: string;
  progress?: number;
}

export interface PhotoUploadServiceAPI {
  selectedFile: Signal<File | null>;
  uploadState: Signal<UploadState>;
  dragOver: Signal<boolean>;
  previewUrl: Signal<string | null>;
  selectFile: (file: File) => void;
  clearFile: () => void;
  uploadPhoto: () => Promise<void>;
  setDragOver: (isDragOver: boolean) => void;
  validateFile: (file: File) => { isValid: boolean; error?: string };
}

export const PhotoUploadServiceDefinition =
  defineService<PhotoUploadServiceAPI>("photoUpload");

export const PhotoUploadService = implementService.withConfig<{
  maxFileSize?: number;
  allowedTypes?: string[];
  photoUploadAstroActions: {
    uploadPhoto: (formData: FormData) => Promise<any>;
  };
}>()(PhotoUploadServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const currentMemberService = getService(CurrentMemberServiceDefinition);

  const selectedFile: Signal<File | null> = signalsService.signal(null as any);
  const uploadState: Signal<UploadState> = signalsService.signal({
    type: "idle" as const,
    message: "",
  } as any);
  const dragOver: Signal<boolean> = signalsService.signal(false as any);
  const previewUrl: Signal<string | null> = signalsService.signal(null as any);

  const maxFileSize = config.maxFileSize || 10 * 1024 * 1024; // 10MB default
  const allowedTypes = config.allowedTypes || [
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!file.type.startsWith("image/")) {
      return {
        isValid: false,
        error: "Please select an image file (JPG, PNG, GIF)",
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "File type not supported" };
    }

    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  };

  const selectFile = (file: File) => {
    const validation = validateFile(file);

    if (!validation.isValid) {
      uploadState.set({ type: "error", message: validation.error! });
      return;
    }

    selectedFile.set(file);
    previewUrl.set(URL.createObjectURL(file));
    uploadState.set({ type: "idle", message: "" });
  };

  const clearFile = () => {
    const currentPreviewUrl = previewUrl.get();
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }

    selectedFile.set(null);
    previewUrl.set(null);
    uploadState.set({ type: "idle", message: "" });
  };

  const uploadPhoto = async (): Promise<void> => {
    const file = selectedFile.get();
    if (!file) return;

    try {
      uploadState.set({ type: "loading", message: "Uploading photo..." });

      const formData = new FormData();
      formData.append("photo", file);

      const result = await config.photoUploadAstroActions.uploadPhoto(formData);

      uploadState.set({
        type: "success",
        message: result.message || "Photo updated successfully!",
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Refresh current member data to update profile photo reactively
      await currentMemberService.refreshCurrentMember();
    } catch (error: any) {
      uploadState.set({
        type: "error",
        message: error.message || "Upload failed. Please try again.",
      });
    }
  };

  const setDragOver = (isDragOver: boolean) => {
    dragOver.set(isDragOver);
  };

  return {
    selectedFile,
    uploadState,
    dragOver,
    previewUrl,
    selectFile,
    clearFile,
    uploadPhoto,
    setDragOver,
    validateFile,
  };
});

export async function loadPhotoUploadServiceConfig(): Promise<
  Omit<
    ServiceFactoryConfig<typeof PhotoUploadService>,
    "photoUploadAstroActions"
  >
> {
  return {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
  };
}
