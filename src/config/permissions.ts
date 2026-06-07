import { AUTH_CONFIG } from "./auth";

export const PERMISSIONS = {
  CAN_ACCESS_CLINICIAN_PORTAL: [AUTH_CONFIG.roles.clinician, AUTH_CONFIG.roles.admin],
  CAN_ACCESS_ADMIN_PORTAL: [AUTH_CONFIG.roles.admin],
  CAN_START_ASSESSMENT: [AUTH_CONFIG.roles.user, AUTH_CONFIG.roles.anonymous],
  CAN_VIEW_REPORT: [AUTH_CONFIG.roles.user, AUTH_CONFIG.roles.clinician],
};
