import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { members } from "@wix/members";
import { files } from "@wix/media";
import { isLoggedIn } from "@wix/astro/auth";
import { auth } from "@wix/essentials";

export const photoUploadAstroActions = {
  uploadPhoto: defineAction({
    accept: "form",
    input: z.object({
      photo: z.instanceof(File),
    }),
    handler: async ({ photo }) => {
      // Check if user is logged in
      if (!isLoggedIn()) {
        throw new Error("Unauthorized");
      }

      // Get current member
      const { member } = await members.getCurrentMember();
      if (!member?._id) {
        throw new Error("Member not found");
      }

      // Validate file type
      if (!photo.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Validate file size (10MB)
      if (photo.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Generate upload URL
      const { uploadUrl } = await auth.elevate(files.generateFileUploadUrl)(
        photo.type,
        {
          fileName: photo.name,
          parentFolderId: "visitor-uploads",
        }
      );

      if (!uploadUrl) {
        throw new Error("Failed to generate upload URL");
      }

      // Upload file to Wix Media
      const uploadResponse = await fetch(
        uploadUrl + "?filename=" + photo.name,
        {
          method: "PUT",
          headers: {
            "Content-Type": photo.type,
          },
          body: photo,
        }
      );

      if (!uploadResponse.ok) {
        console.error("Upload failed:", await uploadResponse.text());
        throw new Error("Failed to upload photo");
      }

      // Get the uploaded file info
      const uploadResult = await uploadResponse.json();
      const fileId = uploadResult.file?.id;

      if (!fileId) {
        console.error("No file ID returned from upload:", uploadResult);
        throw new Error("Upload completed but no file ID received");
      }

      // Update member's profile photo
      await members.updateMember(member._id, {
        profile: {
          photo: {
            _id: fileId,
          },
        },
      });

      return {
        success: true,
        fileId,
        message: "Photo updated successfully",
      };
    },
  }),
};
