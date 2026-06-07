import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma/client";
import { hasRole } from "../permissions";

export class AuthService {
  static async getCurrentClerkId() {
    const session = await auth();
    return session.userId;
  }

  static async getCurrentUser() {
    const clerkId = await this.getCurrentClerkId();
    if (!clerkId) return null;

    return prisma.user.findUnique({
      where: { clerkId },
    });
  }

  static async getCurrentRole() {
    const user = await this.getCurrentUser();
    return user?.role || null;
  }

  static async requireAuth() {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return user;
  }

  static async requireRole(requiredRole: string) {
    const user = await this.requireAuth();
    if (!hasRole(user.role, requiredRole)) {
      throw new Error("Forbidden: Insufficient Permissions");
    }
    return user;
  }
}
