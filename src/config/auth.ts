export const AUTH_CONFIG = {
  roles: {
    super_admin: "SUPER_ADMIN",
    admin: "ADMIN",
    clinician: "CLINICIAN",
    user: "USER",
    anonymous: "ANONYMOUS",
  },
};

export const ROLE_HIERARCHY: Record<string, number> = {
  USER: 1,
  CLINICIAN: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};
