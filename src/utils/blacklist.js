// Who may blacklist partners: full admins (no staff role) and Business Managers
// (their own partners only; the backend enforces this too)
export const canBlacklistPartners = (user) =>
  Boolean(user) && (!user.staffRoleName || Boolean(user.scopedToOwnFranchises));
