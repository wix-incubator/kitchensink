import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '@wix/services-definitions/core-services/signals';

export interface UploadState {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  progress?: number;
}

export interface FileValidationRules {
  maxFileSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface FileUploadServiceAPI {
  selectedFile: Signal<File | null>;
  uploadState: Signal<UploadState>;
  dragOver: Signal<boolean>;
  previewUrl: Signal<string | null>;
  validationRules: FileValidationRules;
  selectFile: (file: File) => void;
  clearFile: () => void;
  uploadFile: () => Promise<void>;
  setDragOver: (isDragOver: boolean) => void;
  validateFile: (file: File) => { isValid: boolean; error?: string };
  canPreview: (file: File) => boolean;
}

export const FileUploadServiceDefinition =
  defineService<FileUploadServiceAPI>('fileUpload');

export const FileUploadService = implementService.withConfig<{
  maxFileSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  uploadAction: (file: File) => Promise<any>;
  onUploadSuccess?: (result: any) => Promise<void> | void;
  onUploadError?: (error: any) => Promise<void> | void;
}>()(FileUploadServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const selectedFile: Signal<File | null> = signalsService.signal(null as any);
  const uploadState: Signal<UploadState> = signalsService.signal({
    type: 'idle' as const,
    message: '',
  } as any);
  const dragOver: Signal<boolean> = signalsService.signal(false as any);
  const previewUrl: Signal<string | null> = signalsService.signal(null as any);

  const validationRules: FileValidationRules = {
    maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB default
    allowedTypes: config.allowedTypes || [],
    allowedExtensions: config.allowedExtensions || [],
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type if specified
    if (
      validationRules.allowedTypes &&
      validationRules.allowedTypes.length > 0
    ) {
      if (!validationRules.allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: `File type not supported. Allowed types: ${validationRules.allowedTypes.join(
            ', '
          )}`,
        };
      }
    }

    // Check file extension if specified
    if (
      validationRules.allowedExtensions &&
      validationRules.allowedExtensions.length > 0
    ) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (
        !fileExtension ||
        !validationRules.allowedExtensions.includes(fileExtension)
      ) {
        return {
          isValid: false,
          error: `File extension not supported. Allowed extensions: ${validationRules.allowedExtensions.join(
            ', '
          )}`,
        };
      }
    }

    // Check file size
    if (
      validationRules.maxFileSize &&
      file.size > validationRules.maxFileSize
    ) {
      const maxSizeMB = Math.round(validationRules.maxFileSize / (1024 * 1024));
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  };

  const canPreview = (file: File): boolean => {
    // For now, only support image previews
    return file.type.startsWith('image/');
  };

  const selectFile = (file: File) => {
    const validation = validateFile(file);

    if (!validation.isValid) {
      uploadState.set({ type: 'error', message: validation.error! });
      return;
    }

    selectedFile.set(file);

    // Generate preview URL if supported
    if (canPreview(file)) {
      previewUrl.set(URL.createObjectURL(file));
    } else {
      previewUrl.set(null);
    }

    uploadState.set({ type: 'idle', message: '' });
  };

  const clearFile = () => {
    const currentPreviewUrl = previewUrl.get();
    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
    }

    selectedFile.set(null);
    previewUrl.set(null);
    uploadState.set({ type: 'idle', message: '' });
  };

  const uploadFile = async (): Promise<void> => {
    const file = selectedFile.get();
    if (!file) return;

    try {
      uploadState.set({ type: 'loading', message: 'Uploading file...' });

      const result = await config.uploadAction(file);

      uploadState.set({
        type: 'success',
        message: result.message || 'File uploaded successfully!',
      });

      // Call success callback if provided
      if (config.onUploadSuccess) {
        await config.onUploadSuccess(result);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error: any) {
      uploadState.set({
        type: 'error',
        message: error.message || 'Upload failed. Please try again.',
      });

      // Call error callback if provided
      if (config.onUploadError) {
        await config.onUploadError(error);
      }
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
    validationRules,
    selectFile,
    clearFile,
    uploadFile,
    setDragOver,
    validateFile,
    canPreview,
  };
});

export async function loadFileUploadServiceConfig(): Promise<
  Omit<
    ServiceFactoryConfig<typeof FileUploadService>,
    'uploadAction' | 'onUploadSuccess' | 'onUploadError'
  >
> {
  return {
    maxFileSize: 10 * 1024 * 1024, // 10MB default
    allowedTypes: [], // No restrictions by default
    allowedExtensions: [], // No restrictions by default
  };
}
