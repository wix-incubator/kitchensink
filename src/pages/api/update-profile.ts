import type { APIRoute } from "astro";
import { members } from "@wix/members";
import { isLoggedIn } from "@wix/astro/auth";

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check if user is logged in
    if (!isLoggedIn()) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const memberId = formData.get("memberId") as string;

    if (!memberId) {
      return new Response("Member ID is required", { status: 400 });
    }

    // Build the update object based on form data
    const updateData: any = {};

    // Personal Information
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const nickname = formData.get("nickname") as string;
    const profileTitle = formData.get("profileTitle") as string;
    const birthdate = formData.get("birthdate") as string;
    const privacyStatus = formData.get("privacyStatus") as string;

    // Professional Information
    const company = formData.get("company") as string;
    const jobTitle = formData.get("jobTitle") as string;

    // Contact Information
    const emailsString = formData.get("emails") as string;
    const phonesString = formData.get("phones") as string;

    // Address Information
    const addressLine = formData.get("addressLine") as string;
    const addressLine2 = formData.get("addressLine2") as string;
    const city = formData.get("city") as string;
    const subdivision = formData.get("subdivision") as string;
    const postalCode = formData.get("postalCode") as string;
    const country = formData.get("country") as string;

    // Build contact object
    if (
      firstName ||
      lastName ||
      birthdate ||
      company ||
      jobTitle ||
      emailsString ||
      phonesString ||
      addressLine
    ) {
      updateData.contact = {};

      if (firstName) updateData.contact.firstName = firstName;
      if (lastName) updateData.contact.lastName = lastName;
      if (birthdate) updateData.contact.birthdate = birthdate;
      if (company) updateData.contact.company = company;
      if (jobTitle) updateData.contact.jobTitle = jobTitle;

      // Handle multiple emails
      if (emailsString) {
        const emails = emailsString
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email);
        if (emails.length > 0) updateData.contact.emails = emails;
      }

      // Handle multiple phones
      if (phonesString) {
        const phones = phonesString
          .split(",")
          .map((phone) => phone.trim())
          .filter((phone) => phone);
        if (phones.length > 0) updateData.contact.phones = phones;
      }

      // Handle address
      if (
        addressLine ||
        addressLine2 ||
        city ||
        subdivision ||
        postalCode ||
        country
      ) {
        updateData.contact.addresses = [
          {
            ...(addressLine && { addressLine }),
            ...(addressLine2 && { addressLine2 }),
            ...(city && { city }),
            ...(subdivision && { subdivision }),
            ...(postalCode && { postalCode }),
            ...(country && { country }),
          },
        ];
      }
    }

    // Build profile object
    if (nickname || profileTitle) {
      updateData.profile = {};
      if (nickname) updateData.profile.nickname = nickname;
      if (profileTitle) updateData.profile.title = profileTitle;
    }

    // Handle privacy status
    if (privacyStatus) updateData.privacyStatus = privacyStatus;

    // Only update if there's actually data to update
    if (Object.keys(updateData).length > 0) {
      await members.updateMember(memberId, updateData);
    }

    // Redirect back to members page with success message
    return redirect("/members?updated=true");
  } catch (error) {
    console.error("Error updating member profile:", error);
    return redirect("/members?error=update_failed");
  }
};
