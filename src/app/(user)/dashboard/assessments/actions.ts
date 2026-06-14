"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma/client";
import { AssessmentService } from "@/modules/assessment/services/assessment.service";
import { redirect } from "next/navigation";

export async function startAssessmentAction(templateName: string = "PHQ9") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true }
  });
  if (!dbUser) throw new Error("User not found");
  
  const assessment = await AssessmentService.startAssessment(templateName, dbUser.id);
  
  redirect(`/assessments/${assessment.id}`);
}
