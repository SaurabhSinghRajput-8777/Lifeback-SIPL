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
    console.time("anonymousSession_getSession");
    const cookieStore = await cookies();
    const anonymousId = cookieStore.get(this.COOKIE_NAME)?.value;

    if (!anonymousId) {
      console.timeEnd("anonymousSession_getSession");
      return null;
    }

    const session = await this.getSessionByAnonymousId(anonymousId);
    console.timeEnd("anonymousSession_getSession");
    return session;
  }

  static async getSessionByAnonymousId(anonymousId: string) {
    console.time("anonymousSession_getById");
    const result = await prisma.anonymousSession.findUnique({
      where: { anonymousId },
    });
    console.timeEnd("anonymousSession_getById");
    return result;
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

  static async extendTTL(anonymousId: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Extend by 30 days

    await prisma.anonymousSession.update({
      where: { anonymousId },
      data: { expiresAt },
    });

    const cookieStore = await cookies();
    cookieStore.set(this.COOKIE_NAME, anonymousId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
    });
  }
}
