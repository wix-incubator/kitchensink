import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import { members } from "@wix/members";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type { Signal } from "../Signal";

export const CurrentMemberServiceDefinition = defineService<{
  currentMember: Signal<members.Member>;
}>("currentMember");

export const CurrentMemberService = implementService.withConfig<{
  member: members.Member;
}>()(CurrentMemberServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const currentMember: Signal<members.Member> = signalsService.signal(
    config.member as any
  );

  return {
    currentMember,
  };
});

export async function loadCurrentMemberServiceConfig(): Promise<
  ServiceFactoryConfig<typeof CurrentMemberService>
> {
  const { member } = await members.getCurrentMember();
  return {
    member: member!,
  };
}
