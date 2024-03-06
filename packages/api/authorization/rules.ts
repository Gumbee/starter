import { Maybe } from '@forge/common/types';
import { EUserRole } from '@forge/database';

type RoleOwner = { role: Maybe<EUserRole> };

export function canCreateEntryCode(user: Maybe<RoleOwner>) {
  return user?.role && user.role === EUserRole.ADMIN;
}
