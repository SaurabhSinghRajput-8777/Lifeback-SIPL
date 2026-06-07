import { prisma } from "@/lib/prisma/client";
import { ConsentType, AcceptanceMethod } from "@prisma/client";
import crypto from "crypto";

export class ConsentService {
  static async createConsentVersion(
    consentType: ConsentType,
    version: string,
    title: string,
    content: string,
    contentUrl: string
  ) {
    const contentHash = crypto.createHash("sha256").update(content).digest("hex");

    // Supersede active versions
    await prisma.consentVersion.updateMany({
      where: { consentType, isActive: true },
      data: { isActive: false, supersededAt: new Date() },
    });

    return prisma.consentVersion.create({
      data: {
        consentType,
        version,
        title,
        contentHash,
        contentUrl,
        effectiveDate: new Date(),
        isActive: true,
      },
    });
  }

  static async acceptConsent(
    consentVersionId: string,
    acceptanceMethod: AcceptanceMethod,
    userId?: string,
    anonymousSessionId?: string,
    ipHash?: string
  ) {
    if (!userId && !anonymousSessionId) {
      throw new Error("Must provide either userId or anonymousSessionId");
    }

    return prisma.userConsent.create({
      data: {
        consentVersionId,
        acceptanceMethod,
        userId,
        anonymousSessionId,
        ipHash,
      },
    });
  }

  static async getLatestConsent(consentType: ConsentType) {
    return prisma.consentVersion.findFirst({
      where: {
        consentType,
        isActive: true,
      },
      orderBy: {
        effectiveDate: "desc",
      },
    });
  }
}
