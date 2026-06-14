import "dotenv/config";
import { DashboardService } from "./src/modules/dashboard/services/dashboard.service";
import { ClinicianService } from "./src/modules/clinician/services/clinician.service";
import { ClinicianRepository } from "./src/modules/clinician/repositories/clinician.repository";
import { performance } from "perf_hooks";

const USER_ID = "user_3EujGLmGZqhoEuJieMyyfNAlVSM";
const CLINICIAN_ID = "user_3F4nrZMhzl5K9rkqppdX1Gw3AgE"; // Also their patient for history

async function measure(name, fn) {
  const start = performance.now();
  await fn();
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}

import { prisma } from "./src/lib/prisma/client";
import { DashboardRepository } from "./src/modules/dashboard/repositories/dashboard.repository";

async function run() {
  console.log("=== WARMUP ===");
  await measure("DB Connection Establish", () => prisma.user.findFirst());
  
  console.log("\n=== USER DASHBOARD ===");
  
  let dataset: any;
  await measure("Dashboard Dataset Query", async () => {
    dataset = await DashboardRepository.getDashboardDataset(USER_ID);
  });
  
  await measure("Dashboard Overview (Memory)", () => DashboardService.getDashboardOverview(dataset));
  await measure("Dashboard Recent (Memory)", () => DashboardService.getRecentAssessments(dataset, 5));
  await measure("Dashboard Insights (Memory)", () => DashboardService.getInsights(dataset));

  console.log("\n=== CLINICIAN DASHBOARD ===");
  // Note: ClinicianService doesn't take clinician ID right now, it returns all? Let's check signature.
  await measure("Clinician Overview", () => ClinicianService.getClinicianOverview());
  await measure("High Risk Queue", () => ClinicianService.getHighRiskQueue());
  await measure("Patient Table", () => ClinicianService.getPatientTable());

  console.log("\n=== CLINICAL NOTES & HISTORY ===");
  // Using user_3EujGLmGZqhoEuJieMyyfNAlVSM's db id: f1f05cfd-c494-467b-a7ae-50ede102044a
  const patientDbId = "f1f05cfd-c494-467b-a7ae-50ede102044a";
  await measure("Patient Details (History & Notes)", () => ClinicianRepository.getPatientDetails(patientDbId));

}

run().catch(console.error).finally(() => process.exit(0));
