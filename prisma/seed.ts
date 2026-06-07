import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const consents = [
    { type: "TERMS", title: "Terms of Service v1", content: "Terms of Service..." },
    { type: "PRIVACY_POLICY", title: "Privacy Policy v1", content: "Privacy Policy..." },
    { type: "VOICE_RECORDING", title: "Voice Consent v1", content: "Voice Recording Consent..." },
    { type: "AI_PROCESSING", title: "AI Processing Consent v1", content: "AI Processing Consent..." },
  ];

  for (const consent of consents) {
    const hash = crypto.createHash("sha256").update(consent.content).digest("hex");
    
    await prisma.consentVersion.create({
      data: {
        consentType: consent.type as "TERMS" | "PRIVACY_POLICY" | "VOICE_RECORDING" | "AI_PROCESSING",
        version: "1.0.0",
        title: consent.title,
        contentHash: hash,
        contentUrl: "https://lifeback.local/legal/" + consent.type.toLowerCase(),
        effectiveDate: new Date(),
        isActive: true,
      },
    });
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
