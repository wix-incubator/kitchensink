import { members } from '@wix/members';
import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import type { Signal } from '../../Signal';

export const CurrentMemberServiceDefinition = defineService<{
  currentMember: Signal<members.Member>;
  updateMember: (member: members.UpdateMember) => Promise<void>;
  refreshCurrentMember: () => Promise<void>;
}>('currentMember');

export type CurrentMemberServiceConfig = {
  member: members.Member;
};

export const CurrentMemberService =
  implementService.withConfig<CurrentMemberServiceConfig>()(
    CurrentMemberServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const currentMember: Signal<members.Member> = signalsService.signal(
        config.member as any
      );

      const refreshCurrentMember = async () => {
        const { member } = await members.getCurrentMember({
          fieldsets: ['FULL'],
        });
        if (member) {
          currentMember.set(member);
        }
      };

      return {
        currentMember,
        updateMember: async update => {
          const newMember = await members.updateMember(
            currentMember.get()._id!,
            update
          );
          currentMember.set(newMember);
        },
        refreshCurrentMember,
      };
    }
  );

export async function loadCurrentMemberServiceConfig(): Promise<CurrentMemberServiceConfig> {
  const { member } = await members.getCurrentMember({
    fieldsets: ['FULL'],
  });
  return {
    member: member!,
  };
}
