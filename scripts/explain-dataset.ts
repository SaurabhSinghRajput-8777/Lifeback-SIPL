import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { DashboardRepository } from "../src/modules/dashboard/repositories/dashboard.repository";

// Use the local module prisma client to avoid conflicts, or instantiate a new one
// The repository uses imported `prisma` from "@/lib/prisma/client"
// We will just call the repository method and measure its output.
import { prisma } from "../src/lib/prisma/client";

async function run() {
  const USER_ID = "user_3EujGLmGZqhoEuJieMyyfNAlVSM";
  
  console.log("=== EXECUTING DATASET QUERY ===");
  const dataset = await DashboardRepository.getDashboardDataset(USER_ID);
  
  if (!dataset) {
    console.log("User not found");
    return;
  }
  
  console.log("\n=== ROW COUNTS ===");
  console.log(`Assessments returned: ${dataset.assessments.length}`);
  console.log(`Drafts count returned: ${dataset.draftsCount}`);
  
  console.log("\n=== PAYLOAD SIZE ESTIMATION ===");
  const jsonStr = JSON.stringify(dataset);
  const sizeBytes = Buffer.byteLength(jsonStr, 'utf8');
  console.log(`Total JSON Payload Size: ${sizeBytes} bytes (${(sizeBytes / 1024).toFixed(2)} KB)`);
  
  const singleAssessmentSize = dataset.assessments.length > 0 
    ? Buffer.byteLength(JSON.stringify(dataset.assessments[0]), 'utf8') 
    : 0;
  console.log(`Average size per assessment: ${singleAssessmentSize} bytes`);
  
  console.log("\n=== SCALING ESTIMATION ===");
  const baseSize = Buffer.byteLength(JSON.stringify({ userId: dataset.userId, draftsCount: dataset.draftsCount, assessments: [] }), 'utf8');
  
  console.log(`At 10 assessments:   ${((baseSize + (singleAssessmentSize * 10)) / 1024).toFixed(2)} KB`);
  console.log(`At 100 assessments:  ${((baseSize + (singleAssessmentSize * 100)) / 1024).toFixed(2)} KB`);
  console.log(`At 1000 assessments: ${((baseSize + (singleAssessmentSize * 1000)) / 1024).toFixed(2)} KB`);
}

run().catch(console.error).finally(() => process.exit(0));
