import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../../Signal";
import { CurrentMemberServiceDefinition } from "./current-member-service";

export interface ProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  nickname: string;
  profileTitle: string;
  birthdate: string;
  privacyStatus: string;

  // Professional Information
  company: string;
  jobTitle: string;

  // Contact Information
  emails: string;
  phones: string;

  // Address Information
  addressLine: string;
  addressLine2: string;
  city: string;
  subdivision: string;
  postalCode: string;
  country: string;
}

export interface UpdateState {
  type: "idle" | "loading" | "success" | "error";
  message: string;
}

export interface ProfileUpdateServiceAPI {
  formData: Signal<ProfileFormData>;
  updateState: Signal<UpdateState>;
  updateField: (field: keyof ProfileFormData, value: string) => void;
  updateProfile: () => Promise<void>;
  resetForm: () => void;
  setFormData: (data: Partial<ProfileFormData>) => void;
}

export const ProfileUpdateServiceDefinition =
  defineService<ProfileUpdateServiceAPI>("profileUpdate");

export type ProfileUpdateServiceConfig = {};

export const ProfileUpdateService =
  implementService.withConfig<ProfileUpdateServiceConfig>()(
    ProfileUpdateServiceDefinition,
    ({ getService }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const currentMemberService = getService(CurrentMemberServiceDefinition);

      // Get current member data from the service
      const currentMember = currentMemberService.currentMember.get();

      // Extract initial data from current member
      const initialData: Partial<ProfileFormData> = {};

      if (currentMember) {
        // Map member data to form data
        if (currentMember.contact) {
          if (currentMember.contact.firstName)
            initialData.firstName = currentMember.contact.firstName;
          if (currentMember.contact.lastName)
            initialData.lastName = currentMember.contact.lastName;
          if (currentMember.contact.birthdate)
            initialData.birthdate = currentMember.contact.birthdate;
          if (currentMember.contact.company)
            initialData.company = currentMember.contact.company;
          if (currentMember.contact.jobTitle)
            initialData.jobTitle = currentMember.contact.jobTitle;
          if (currentMember.contact.emails?.length)
            initialData.emails = currentMember.contact.emails.join(", ");
          if (currentMember.contact.phones?.length)
            initialData.phones = currentMember.contact.phones.join(", ");

          if (currentMember.contact.addresses?.[0]) {
            const address = currentMember.contact.addresses[0];
            if (address.addressLine)
              initialData.addressLine = address.addressLine;
            if (address.addressLine2)
              initialData.addressLine2 = address.addressLine2;
            if (address.city) initialData.city = address.city;
            if (address.subdivision)
              initialData.subdivision = address.subdivision;
            if (address.postalCode) initialData.postalCode = address.postalCode;
            if (address.country) initialData.country = address.country;
          }
        }

        if (currentMember.profile) {
          if (currentMember.profile.nickname)
            initialData.nickname = currentMember.profile.nickname;
          if (currentMember.profile.title)
            initialData.profileTitle = currentMember.profile.title;
        }

        if (currentMember.privacyStatus)
          initialData.privacyStatus = currentMember.privacyStatus;
      }

      const defaultFormData: ProfileFormData = {
        firstName: "",
        lastName: "",
        nickname: "",
        profileTitle: "",
        birthdate: "",
        privacyStatus: "PUBLIC",
        company: "",
        jobTitle: "",
        emails: "",
        phones: "",
        addressLine: "",
        addressLine2: "",
        city: "",
        subdivision: "",
        postalCode: "",
        country: "",
        ...initialData,
      };

      const formData: Signal<ProfileFormData> = signalsService.signal(
        defaultFormData as any
      );
      const updateState: Signal<UpdateState> = signalsService.signal({
        type: "idle" as const,
        message: "",
      } as any);

      const updateField = (field: keyof ProfileFormData, value: string) => {
        const currentData = formData.get();
        formData.set({
          ...currentData,
          [field]: value,
        });
      };

      const setFormData = (data: Partial<ProfileFormData>) => {
        const currentData = formData.get();
        formData.set({
          ...currentData,
          ...data,
        });
      };

      const resetForm = () => {
        formData.set(defaultFormData);
        updateState.set({ type: "idle", message: "" });
      };

      const updateProfile = async (): Promise<void> => {
        try {
          updateState.set({ type: "loading", message: "Updating profile..." });

          const data = formData.get();

          // Convert form data to member update format
          const memberUpdate: any = {
            contact: {},
            profile: {},
          };

          // Map personal information
          if (data.firstName) memberUpdate.contact.firstName = data.firstName;
          if (data.lastName) memberUpdate.contact.lastName = data.lastName;
          if (data.birthdate) memberUpdate.contact.birthdate = data.birthdate;

          // Map professional information
          if (data.company) memberUpdate.contact.company = data.company;
          if (data.jobTitle) memberUpdate.contact.jobTitle = data.jobTitle;

          // Map contact information
          if (data.emails) {
            memberUpdate.contact.emails = data.emails
              .split(",")
              .map((email: string) => email.trim())
              .filter(Boolean);
          }
          if (data.phones) {
            memberUpdate.contact.phones = data.phones
              .split(",")
              .map((phone: string) => phone.trim())
              .filter(Boolean);
          }

          // Map address information
          if (
            data.addressLine ||
            data.addressLine2 ||
            data.city ||
            data.subdivision ||
            data.postalCode ||
            data.country
          ) {
            memberUpdate.contact.addresses = [
              {
                ...(data.addressLine && { addressLine: data.addressLine }),
                ...(data.addressLine2 && { addressLine2: data.addressLine2 }),
                ...(data.city && { city: data.city }),
                ...(data.subdivision && { subdivision: data.subdivision }),
                ...(data.postalCode && { postalCode: data.postalCode }),
                ...(data.country && { country: data.country }),
              },
            ];
          }

          // Map profile information
          if (data.nickname) memberUpdate.profile.nickname = data.nickname;
          if (data.profileTitle) memberUpdate.profile.title = data.profileTitle;

          // Map privacy status
          if (data.privacyStatus)
            memberUpdate.privacyStatus = data.privacyStatus;

          // Clean up empty objects
          if (Object.keys(memberUpdate.contact).length === 0) {
            delete memberUpdate.contact;
          }
          if (Object.keys(memberUpdate.profile).length === 0) {
            delete memberUpdate.profile;
          }

          // Use the currentMemberService to update, which will update both server and client state
          await currentMemberService.updateMember(memberUpdate);

          updateState.set({
            type: "success",
            message: "Profile updated successfully!",
          });
        } catch (error) {
          updateState.set({
            type: "error",
            message: "Update failed. Please try again.",
          });
        }
      };

      return {
        formData,
        updateState,
        updateField,
        updateProfile,
        resetForm,
        setFormData,
      };
    }
  );

export async function loadProfileUpdateServiceConfig(): Promise<ProfileUpdateServiceConfig> {
  return {};
}
