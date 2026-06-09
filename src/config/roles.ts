export const ROLES = {
  USER: "USER",
  CLINICIAN: "CLINICIAN",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const PUBLIC_SIGNUP_ROLES = [ROLES.USER, ROLES.CLINICIAN] as const;
export type PublicSignupRole = typeof PUBLIC_SIGNUP_ROLES[number];
