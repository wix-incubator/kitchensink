import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CurrentMemberServiceDefinition } from "../services/current-member-service";

/**
 * Props for FullName headless component
 */
export interface FullNameProps {
  /** Render prop function that receives full name data */
  children: (props: FullNameRenderProps) => React.ReactNode;
}

/**
 * Render props for FullName component
 */
export interface FullNameRenderProps {
  /** Full name combining first and last name */
  fullName: string;
  /** First name only */
  firstName: string;
  /** Last name only */
  lastName: string;
  /** Whether both first and last names are available */
  hasFullName: boolean;
}

/**
 * Headless component for displaying member's full name
 * @example
 * ```tsx
 * <CurrentMemberProfile.FullName>
 *   {({ fullName, hasFullName }) => (
 *     <h1>{hasFullName ? fullName : 'Member'}</h1>
 *   )}
 * </CurrentMemberProfile.FullName>
 * ```
 */
const FullName = (props: FullNameProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const firstName = member.contact?.firstName || "";
  const lastName = member.contact?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const hasFullName = Boolean(firstName && lastName);

  return props.children({
    fullName,
    firstName,
    lastName,
    hasFullName,
  });
};

/**
 * Props for Nickname headless component
 */
export interface NicknameProps {
  /** Render prop function that receives nickname data */
  children: (props: NicknameRenderProps) => React.ReactNode;
}

/**
 * Render props for Nickname component
 */
export interface NicknameRenderProps {
  /** Member's nickname */
  nickname: string;
  /** Whether a nickname is available */
  hasNickname: boolean;
  /** Display name (nickname if available, otherwise first name or 'Member') */
  displayName: string;
}

/**
 * Headless component for displaying member's nickname
 * @example
 * ```tsx
 * <CurrentMemberProfile.Nickname>
 *   {({ displayName, hasNickname }) => (
 *     <span>{displayName} {hasNickname && '(Nickname)'}</span>
 *   )}
 * </CurrentMemberProfile.Nickname>
 * ```
 */
const Nickname = (props: NicknameProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const nickname = member.profile?.nickname || "";
  const hasNickname = Boolean(nickname);
  const displayName = nickname || member.contact?.firstName || "Member";

  return props.children({
    nickname,
    hasNickname,
    displayName,
  });
};

/**
 * Props for Email headless component
 */
export interface EmailProps {
  /** Render prop function that receives email data */
  children: (props: EmailRenderProps) => React.ReactNode;
}

/**
 * Render props for Email component
 */
export interface EmailRenderProps {
  /** Member's login email */
  email: string;
  /** Whether the email is verified */
  isVerified: boolean;
  /** Whether an email is available */
  hasEmail: boolean;
}

/**
 * Headless component for displaying member's email with verification status
 * @example
 * ```tsx
 * <CurrentMemberProfile.Email>
 *   {({ email, isVerified, hasEmail }) => (
 *     <div>
 *       {hasEmail && <span>{email} {isVerified && '✓'}</span>}
 *     </div>
 *   )}
 * </CurrentMemberProfile.Email>
 * ```
 */
const Email = (props: EmailProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const email = member.loginEmail || "";
  const isVerified = Boolean(member.loginEmailVerified);
  const hasEmail = Boolean(email);

  return props.children({
    email,
    isVerified,
    hasEmail,
  });
};

/**
 * Props for LastLoginDate headless component
 */
export interface LastLoginDateProps {
  /** Render prop function that receives last login date data */
  children: (props: LastLoginDateRenderProps) => React.ReactNode;
}

/**
 * Render props for LastLoginDate component
 */
export interface LastLoginDateRenderProps {
  /** Last login date as Date object */
  lastLoginDate: Date | null;
  /** Formatted last login date string */
  formattedDate: string;
  /** Whether last login date is available */
  hasLastLogin: boolean;
  /** Relative time string (e.g., "2 days ago") */
  relativeTime: string;
}

/**
 * Headless component for displaying member's last login date
 * @example
 * ```tsx
 * <CurrentMemberProfile.LastLoginDate>
 *   {({ formattedDate, hasLastLogin, relativeTime }) => (
 *     <div>
 *       {hasLastLogin && (
 *         <span>Last login: {formattedDate} ({relativeTime})</span>
 *       )}
 *     </div>
 *   )}
 * </CurrentMemberProfile.LastLoginDate>
 * ```
 */
const LastLoginDate = (props: LastLoginDateProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const lastLoginDate = member.lastLoginDate
    ? new Date(member.lastLoginDate)
    : null;
  const hasLastLogin = Boolean(lastLoginDate);

  const formattedDate = lastLoginDate ? lastLoginDate.toLocaleDateString() : "";

  const relativeTime = lastLoginDate
    ? (() => {
        const now = new Date();
        const diffMs = now.getTime() - lastLoginDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "today";
        if (diffDays === 1) return "yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
      })()
    : "";

  return props.children({
    lastLoginDate,
    formattedDate,
    hasLastLogin,
    relativeTime,
  });
};

/**
 * Props for ActivityStatus headless component
 */
export interface ActivityStatusProps {
  /** Render prop function that receives activity status data */
  children: (props: ActivityStatusRenderProps) => React.ReactNode;
}

/**
 * Render props for ActivityStatus component
 */
export interface ActivityStatusRenderProps {
  /** Raw activity status */
  status: string;
  /** Whether member is active */
  isActive: boolean;
  /** Formatted status display text */
  displayStatus: string;
  /** Status color (for styling) */
  statusColor: "green" | "yellow" | "red" | "gray";
}

/**
 * Headless component for displaying member's activity status
 * @example
 * ```tsx
 * <CurrentMemberProfile.ActivityStatus>
 *   {({ displayStatus, isActive, statusColor }) => (
 *     <span className={`text-${statusColor}-400`}>
 *       {displayStatus} {isActive && '🟢'}
 *     </span>
 *   )}
 * </CurrentMemberProfile.ActivityStatus>
 * ```
 */
const ActivityStatus = (props: ActivityStatusProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const status = member.activityStatus || "UNKNOWN";
  const isActive = status === "ACTIVE";

  const displayStatus = (() => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      default:
        return status || "Unknown";
    }
  })();

  const statusColor: "green" | "yellow" | "red" | "gray" = (() => {
    switch (status) {
      case "ACTIVE":
        return "green";
      default:
        return "gray";
    }
  })();

  return props.children({
    status,
    isActive,
    displayStatus,
    statusColor,
  });
};

/**
 * Props for DaysMember headless component
 */
export interface DaysMemberProps {
  /** Render prop function that receives days member data */
  children: (props: DaysMemberRenderProps) => React.ReactNode;
}

/**
 * Render props for DaysMember component
 */
export interface DaysMemberRenderProps {
  /** Number of days as a member */
  daysMember: number;
  /** Member creation date */
  createdDate: Date | null;
  /** Formatted creation date string */
  formattedCreatedDate: string;
  /** Whether creation date is available */
  hasCreatedDate: boolean;
  /** Membership duration description (e.g., "New member", "1 year member") */
  membershipDuration: string;
}

/**
 * Headless component for displaying how long the user has been a member
 * @example
 * ```tsx
 * <CurrentMemberProfile.DaysMember>
 *   {({ daysMember, membershipDuration }) => (
 *     <div>
 *       <span>{daysMember}</span>
 *       <small>{membershipDuration}</small>
 *     </div>
 *   )}
 * </CurrentMemberProfile.DaysMember>
 * ```
 */
const DaysMember = (props: DaysMemberProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const createdDate = member._createdDate
    ? new Date(member._createdDate)
    : null;
  const hasCreatedDate = Boolean(createdDate);

  const daysMember = createdDate
    ? Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formattedCreatedDate = createdDate
    ? createdDate.toLocaleDateString()
    : "";

  const membershipDuration = (() => {
    if (daysMember === 0) return "New member";
    if (daysMember < 7) return "Less than a week";
    if (daysMember < 30)
      return `${Math.floor(daysMember / 7)} week${
        Math.floor(daysMember / 7) > 1 ? "s" : ""
      } member`;
    if (daysMember < 365)
      return `${Math.floor(daysMember / 30)} month${
        Math.floor(daysMember / 30) > 1 ? "s" : ""
      } member`;
    return `${Math.floor(daysMember / 365)} year${
      Math.floor(daysMember / 365) > 1 ? "s" : ""
    } member`;
  })();

  return props.children({
    daysMember,
    createdDate,
    formattedCreatedDate,
    hasCreatedDate,
    membershipDuration,
  });
};

/**
 * Props for ProfilePhoto headless component
 */
export interface ProfilePhotoProps {
  /** Render prop function that receives profile photo data */
  children: (props: ProfilePhotoRenderProps) => React.ReactNode;
}

/**
 * Render props for ProfilePhoto component
 */
export interface ProfilePhotoRenderProps {
  /** Profile photo URL */
  photoUrl: string;
  /** Whether a profile photo is available */
  hasPhoto: boolean;
  /** Alt text for the photo */
  altText: string;
}

/**
 * Headless component for displaying member's profile photo
 * @example
 * ```tsx
 * <CurrentMemberProfile.ProfilePhoto>
 *   {({ photoUrl, hasPhoto, altText }) => (
 *     <div>
 *       {hasPhoto ? (
 *         <img src={photoUrl} alt={altText} />
 *       ) : (
 *         <div>No photo</div>
 *       )}
 *     </div>
 *   )}
 * </CurrentMemberProfile.ProfilePhoto>
 * ```
 */
const ProfilePhoto = (props: ProfilePhotoProps) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();
  const photoUrl = member.profile?.photo?.url || "";
  const hasPhoto = Boolean(photoUrl);

  const displayName =
    member.profile?.nickname || member.contact?.firstName || "User";
  const altText = `${displayName}'s profile photo`;

  return props.children({
    photoUrl,
    hasPhoto,
    altText,
  });
};

/**
 * Namespace containing all current member profile headless components
 *
 * @example
 * ```tsx
 * import { CurrentMemberProfile } from './CurrentMemberProfile';
 *
 * <CurrentMemberProfile.FullName>
 *   {({ fullName }) => <h1>{fullName}</h1>}
 * </CurrentMemberProfile.FullName>
 * ```
 */
export const CurrentMemberProfile = {
  FullName,
  Nickname,
  Email,
  LastLoginDate,
  ActivityStatus,
  DaysMember,
  ProfilePhoto,
} as const;
