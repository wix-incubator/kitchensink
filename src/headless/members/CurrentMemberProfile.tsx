import type { ServiceAPI } from "@wix/services-definitions";
import { useService } from "@wix/services-manager-react";
import { CurrentMemberServiceDefinition } from "./current-member-service";

export const FullName = (props: {
  children: (props: { fullName: string }) => React.ReactNode;
}) => {
  const { currentMember } = useService(
    CurrentMemberServiceDefinition
  ) as ServiceAPI<typeof CurrentMemberServiceDefinition>;

  const member = currentMember.get();

  const fullName = `${member.contact!.firstName} ${member.contact!.lastName}`;
  return props.children({ fullName });
};
