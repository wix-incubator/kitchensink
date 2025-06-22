import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import {
  ProfileUpdateServiceDefinition,
  type ProfileFormData,
} from "../services/profile-update-service";

export const ProfileFormField = (props: {
  field: keyof ProfileFormData;
  children: (props: {
    value: string;
    onChange: (value: string) => void;
    field: keyof ProfileFormData;
  }) => React.ReactNode;
}) => {
  const service = useService(ProfileUpdateServiceDefinition) as ServiceAPI<
    typeof ProfileUpdateServiceDefinition
  >;

  const formData = service.formData.get();
  const value = formData[props.field];

  const onChange = (newValue: string) => {
    service.updateField(props.field, newValue);
  };

  return props.children({
    value,
    onChange,
    field: props.field,
  });
};

export const ProfileUpdateTrigger = (props: {
  children: (props: {
    updateProfile: () => Promise<void>;
    canUpdate: boolean;
    isUpdating: boolean;
  }) => React.ReactNode;
}) => {
  const service = useService(ProfileUpdateServiceDefinition) as ServiceAPI<
    typeof ProfileUpdateServiceDefinition
  >;

  const updateState = service.updateState.get();
  const isUpdating = updateState.type === "loading";

  return props.children({
    updateProfile: service.updateProfile,
    canUpdate: !isUpdating,
    isUpdating,
  });
};

export const ProfileUpdateProgress = (props: {
  children: (props: {
    updateState: {
      type: "idle" | "loading" | "success" | "error";
      message: string;
    };
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    hasMessage: boolean;
  }) => React.ReactNode;
}) => {
  const service = useService(ProfileUpdateServiceDefinition) as ServiceAPI<
    typeof ProfileUpdateServiceDefinition
  >;

  const updateState = service.updateState.get();

  return props.children({
    updateState,
    isLoading: updateState.type === "loading",
    isSuccess: updateState.type === "success",
    isError: updateState.type === "error",
    hasMessage: updateState.message !== "",
  });
};

export const ProfileForm = (props: {
  children: (props: {
    formData: ProfileFormData;
    updateField: (field: keyof ProfileFormData, value: string) => void;
    setFormData: (data: Partial<ProfileFormData>) => void;
    resetForm: () => void;
  }) => React.ReactNode;
}) => {
  const service = useService(ProfileUpdateServiceDefinition) as ServiceAPI<
    typeof ProfileUpdateServiceDefinition
  >;

  const formData = service.formData.get();

  return props.children({
    formData,
    updateField: service.updateField,
    setFormData: service.setFormData,
    resetForm: service.resetForm,
  });
};
