import type { APIRoute } from "astro";
import { members } from "@wix/members";
import { files } from "@wix/media";
import { isLoggedIn } from "@wix/astro/auth";
import { auth } from "@wix/essentials";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if user is logged in
    if (!isLoggedIn()) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get current member
    const { member } = await members.getCurrentMember();
    if (!member?._id) {
      return new Response("Member not found", { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const photo = formData.get("photo") as File;

    if (!photo) {
      return new Response("No photo provided", { status: 400 });
    }

    // Validate file type
    if (!photo.type.startsWith("image/")) {
      return new Response("File must be an image", { status: 400 });
    }

    // Validate file size (10MB)
    if (photo.size > 10 * 1024 * 1024) {
      return new Response("File size must be less than 10MB", { status: 400 });
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
      return new Response("Failed to generate upload URL", { status: 500 });
    }

    // Upload file to Wix Media
    const uploadResponse = await fetch(uploadUrl + "?filename=" + photo.name, {
      method: "PUT",
      headers: {
        "Content-Type": photo.type,
      },
      body: photo,
    });

    if (!uploadResponse.ok) {
      console.error("Upload failed:", await uploadResponse.text());
      return new Response("Failed to upload photo", { status: 500 });
    }

    // Get the uploaded file info
    const uploadResult = await uploadResponse.json();
    const fileId = uploadResult.file?.id;

    if (!fileId) {
      console.error("No file ID returned from upload:", uploadResult);
      return new Response("Upload completed but no file ID received", {
        status: 500,
      });
    }

    // Update member's profile photo
    await members.updateMember(member._id, {
      profile: {
        photo: {
          _id: fileId,
        },
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        fileId,
        message: "Photo updated successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error uploading photo:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
