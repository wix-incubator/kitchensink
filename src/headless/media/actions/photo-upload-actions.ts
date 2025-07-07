import { z } from 'astro:schema';
import { members } from '@wix/members';
import { auth } from '@wix/essentials';
import { type IOAuthStrategy } from '@wix/sdk';
import type { FileUploadActionHandler } from './file-upload-actions';

// Input schemas for actions
export const MemberPhotoUploadInputSchema = z.object({
  photo: z.instanceof(File),
});

// Type for input validation
export type MemberPhotoUploadInput = z.infer<
  typeof MemberPhotoUploadInputSchema
>;

/**
 * Factory function to create member profile photo upload action handler
 * This demonstrates the pattern of service action factories that receive other actions as dependencies
 *
 * @param fileUploadActionHandler - A constructed file upload action handler (not a factory) that handles the actual file upload
 * @returns Object containing action handler and service functions for photo uploads
 */
export function createMemberProfilePhotoUploadAction(
  fileUploadActionHandler: FileUploadActionHandler
) {
  const uploadPhotoHandler = async ({ photo }: MemberPhotoUploadInput) => {
    // Check if user is logged in
    if (!auth.getContextualAuth<IOAuthStrategy>().loggedIn()) {
      throw new Error('Unauthorized');
    }

    // Get current member
    const { member } = await members.getCurrentMember();
    if (!member?._id) {
      throw new Error('Member not found');
    }

    // Use the injected file upload action to upload the image
    console.log('calling fileUploadActionHandler', photo);
    const uploadResult = await fileUploadActionHandler({ file: photo });

    // Check if upload was successful
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'File upload failed');
    }

    try {
      // Update member's profile photo with the uploaded file ID
      await members.updateMember(member._id, {
        profile: {
          photo: {
            _id: uploadResult.fileId,
          },
        },
      });

      return {
        success: true,
        fileId: uploadResult.fileId,
        message: 'Photo updated successfully',
      };
    } catch (error) {
      console.error('Failed to update member profile photo:', error);
      throw new Error('Upload succeeded but failed to update profile');
    }
  };

  return {
    uploadPhotoHandler,
    /**
     * Photo upload action for member profile photos
     * This wraps the handler to work with the generic file upload service
     */
    createPhotoUploadAction: (onSuccess?: () => Promise<void>) => {
      return async (file: File) => {
        const result = await uploadPhotoHandler({ photo: file });

        // Call the success callback if provided
        if (onSuccess) {
          await onSuccess();
        }

        return result;
      };
    },
  };
}

/**
 * Configuration for photo uploads
 */
export const getPhotoUploadConfig = () => ({
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
});
