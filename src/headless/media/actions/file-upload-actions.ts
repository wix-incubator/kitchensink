import { z } from "astro:schema";
import { files } from "@wix/media";
import { auth } from "@wix/essentials";
import { type IOAuthStrategy } from "@wix/sdk";

// Configuration interface for file upload action factory
export interface FileUploadActionConfig {
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed MIME types */
  allowedMimeTypes?: string[];
  /** Allowed file extensions */
  allowedExtensions?: string[];
  /** Custom validation function */
  customValidation?: (file: File) => Promise<string | null>;
  /** Parent folder ID for organizing uploads */
  parentFolderId?: string;
}

// Input schemas for actions
export const FileUploadInputSchema = z.object({
  file: z.instanceof(File),
});

// Type for input validation
export type FileUploadInput = z.infer<typeof FileUploadInputSchema>;

/**
 * Factory function to create a configurable file upload handler
 * This uploads files to Wix Media and returns the file URL and ID
 * This is framework-agnostic and returns just the handler function
 */
export function createFileUploadAction(config: FileUploadActionConfig = {}) {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    allowedMimeTypes = [],
    allowedExtensions = [],
    customValidation,
    parentFolderId = "visitor-uploads",
  } = config;

  return async ({ file }: FileUploadInput) => {
    try {
      console.log("createFileUploadAction", file);
      // Authentication check
      if (!auth.getContextualAuth<IOAuthStrategy>().loggedIn()) {
        throw new Error("Authentication required");
      }

      // File size validation
      if (file.size > maxFileSize) {
        throw new Error(
          `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`
        );
      }

      // MIME type validation
      if (
        allowedMimeTypes.length > 0 &&
        !allowedMimeTypes.includes(file.type)
      ) {
        throw new Error(
          `File type ${
            file.type
          } is not allowed. Allowed types: ${allowedMimeTypes.join(", ")}`
        );
      }

      // Extension validation
      if (allowedExtensions.length > 0) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
          throw new Error(
            `File extension is not allowed. Allowed extensions: ${allowedExtensions.join(
              ", "
            )}`
          );
        }
      }

      // Custom validation
      if (customValidation) {
        const validationError = await customValidation(file);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      // Generate upload URL
      const { uploadUrl } = await auth.elevate(files.generateFileUploadUrl)(
        file.type,
        {
          fileName: file.name,
          parentFolderId,
        }
      );

      if (!uploadUrl) {
        throw new Error("Failed to generate upload URL");
      }

      // Upload file to Wix Media
      const uploadResponse = await fetch(uploadUrl + "?filename=" + file.name, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        console.error("Upload failed:", await uploadResponse.text());
        throw new Error("Failed to upload file");
      }

      // Get the uploaded file info
      const uploadResult = await uploadResponse.json();
      const fileId = uploadResult.file?.id;

      if (!fileId) {
        console.error("No file ID returned from upload:", uploadResult);
        throw new Error("Upload completed but no file ID received");
      }

      return {
        success: true,
        fileId,
        fileUrl: uploadResult.file?.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  };
}

// Type for a constructed file upload action handler
export type FileUploadActionHandler = ReturnType<typeof createFileUploadAction>;
