import { prisma as db } from "@/lib/prisma/client";
import { ROLES, Role, PUBLIC_SIGNUP_ROLES, PublicSignupRole } from "@/config/roles";

export class OnboardingService {
  /**
   * Validates if a given role string is allowed for public signup.
   * If valid, returns the typed role. If invalid, returns the default role (USER).
   */
  public static validateSignupRole(roleInput: string | undefined | null): Role {
    if (!roleInput) {
      return ROLES.USER;
    }

    const normalizedRole = roleInput.toUpperCase();
    
    // Check if it is a valid public signup role (whitelist)
    if (PUBLIC_SIGNUP_ROLES.includes(normalizedRole as PublicSignupRole)) {
      return normalizedRole as Role;
    }

    // Default to USER if anything else (e.g., ADMIN spoofing attempts)
    return ROLES.USER;
  }

  /**
   * Resolves the final role given potentially untrusted input.
   * Centralizes the logic to ensure we always have a safe Role.
   */
  public static resolveRole(unsafeRole: string | undefined | null): Role {
    return this.validateSignupRole(unsafeRole);
  }

  /**
   * Persists the newly created user to the database with the resolved role.
   * The database acts as the single source of truth.
   */
  public static async persistRole(params: {
    clerkId: string;
    email: string;
    unsafeRoleFromClerk: string | undefined | null;
  }) {
    const resolvedRole = this.resolveRole(params.unsafeRoleFromClerk);

    const user = await db.user.upsert({
      where: { email: params.email },
      update: {
        clerkId: params.clerkId,
        role: resolvedRole,
      },
      create: {
        clerkId: params.clerkId,
        email: params.email,
        role: resolvedRole,
      },
    });

    return user;
  }
}
