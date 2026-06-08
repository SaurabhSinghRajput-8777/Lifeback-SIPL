import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import crypto from "crypto";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

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
  const phq9Config = {
    questions: [
      { id: "q1", type: "SCALE", text: "Little interest or pleasure in doing things", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q2", type: "SCALE", text: "Feeling down, depressed, or hopeless", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q3", type: "SCALE", text: "Trouble falling or staying asleep, or sleeping too much", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q4", type: "SCALE", text: "Feeling tired or having little energy", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q5", type: "SCALE", text: "Poor appetite or overeating", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q6", type: "SCALE", text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q7", type: "SCALE", text: "Trouble concentrating on things, such as reading the newspaper or watching television", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q8", type: "SCALE", text: "Moving or speaking so slowly that other people could have noticed.\\nOr the opposite — being so fidgety or restless that you have been moving around a lot more than usual", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] },
      { id: "q9", type: "SCALE", text: "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way", required: true, options: [{ value: 0, label: "Not at all" }, { value: 1, label: "Several days" }, { value: 2, label: "More than half the days" }, { value: 3, label: "Nearly every day" }] }
    ]
  };

  await prisma.assessmentTemplate.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" }, // Using a deterministic UUID or relying on `name` wait Prisma doesn't have unique on `name` in schema
    update: {
      config: phq9Config,
      isActive: true,
      version: "1.0.0",
    },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "PHQ9",
      version: "1.0.0",
      config: phq9Config,
      isActive: true,
    }
  });

  console.log("Seeding consents...");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
