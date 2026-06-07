import { prisma } from "@/lib/prisma/client";
import crypto from "crypto";
import { cookies } from "next/headers";

export class AnonymousSessionService {
  private static COOKIE_NAME = "anonymous_id";

  static async createSession(ipHash?: string, userAgentHash?: string) {
    const anonymousId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days TTL

    const session = await prisma.anonymousSession.create({
      data: {
        anonymousId,
        ipHash,
        userAgentHash,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(this.COOKIE_NAME, anonymousId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
    });

    return session;
  }

  static async getSession() {
    const cookieStore = await cookies();
    const anonymousId = cookieStore.get(this.COOKIE_NAME)?.value;

    if (!anonymousId) return null;

    return prisma.anonymousSession.findUnique({
      where: { anonymousId },
    });
  }

  static async convertSession(userId: string) {
    const session = await this.getSession();
    if (!session) return null;

    const updatedSession = await prisma.anonymousSession.update({
      where: { id: session.id },
      data: {
        convertedUserId: userId,
        convertedAt: new Date(),
      },
    });

    const cookieStore = await cookies();
    cookieStore.delete(this.COOKIE_NAME);

    return updatedSession;
  }
}
