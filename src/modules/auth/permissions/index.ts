import { ROLE_HIERARCHY, AUTH_CONFIG } from "@/config/auth";

export const hasRole = (userRole: string | undefined | null, requiredRole: string): boolean => {
  if (!userRole) return false;
  
  const userLevel = ROLE_HIERARCHY[userRole.toUpperCase()] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole.toUpperCase()] || 0;
  
  return userLevel >= requiredLevel;
};

// Route & Portal Access
export const canAccessUser = (role?: string) => hasRole(role, AUTH_CONFIG.roles.user);
export const canAccessClinician = (role?: string) => hasRole(role, AUTH_CONFIG.roles.clinician);
export const canAccessAdmin = (role?: string) => hasRole(role, AUTH_CONFIG.roles.admin);
export const canAccessSuperAdmin = (role?: string) => hasRole(role, AUTH_CONFIG.roles.super_admin);

// Feature Access
export const canViewAssessment = (role?: string) => hasRole(role, AUTH_CONFIG.roles.user);
export const canViewReport = (role?: string) => hasRole(role, AUTH_CONFIG.roles.clinician) || hasRole(role, AUTH_CONFIG.roles.user); // Users can view their own reports (ownership checked elsewhere)
export const canManageUsers = (role?: string) => hasRole(role, AUTH_CONFIG.roles.admin);
export const canManageClinicians = (role?: string) => hasRole(role, AUTH_CONFIG.roles.super_admin);
