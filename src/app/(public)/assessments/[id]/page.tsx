import { AssessmentService } from "@/modules/assessment/services/assessment.service";
import { AssessmentRenderer } from "@/modules/assessment/components/AssessmentRenderer";
import { AssessmentResults } from "@/modules/assessment/components/AssessmentResults";
import { notFound } from "next/navigation";
import { AssessmentStatus } from "@prisma/client";
import { AssessmentTemplateConfig, AssessmentResult } from "@/types/assessment";

import { auth } from "@clerk/nextjs/server";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assessment = await AssessmentService.getAssessment(id);
  const { userId } = await auth();
  const isAnonymous = !userId;

  if (!assessment) {
    notFound();
  }

  if (assessment.status === AssessmentStatus.COMPLETED) {
    const report = assessment.report;
    if (!report) {
      return <div className="p-8 text-center text-red-500">Error: Report missing for completed assessment.</div>;
    }
    return <AssessmentResults result={report.reportJson as unknown as AssessmentResult} isAnonymous={isAnonymous} />;
  }

  // Pre-fill answers from backend for state re-hydration
  const initialResponses: Record<string, unknown> = {};
  if (assessment.responses) {
    for (const r of assessment.responses) {
      initialResponses[r.questionId] = r.answer;
    }
  }

  return (
    <AssessmentRenderer 
      assessmentId={assessment.id} 
      templateConfig={assessment.templateSnapshot as unknown as AssessmentTemplateConfig}
      initialResponses={initialResponses}
    />
  );
}
