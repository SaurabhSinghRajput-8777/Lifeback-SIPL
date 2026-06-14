import { AssessmentRenderer } from "@/modules/assessment/components/AssessmentRenderer";
import { TemplateRepository } from "@/modules/assessment/repositories/template.repository";
import { AssessmentTemplateConfig } from "@/types/assessment";
import { AssessmentHeader } from "@/modules/assessment/components/AssessmentHeader";
import { notFound } from "next/navigation";

export default async function AnonymousAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const template = await TemplateRepository.findByName("PHQ9");

  if (!template) {
    notFound();
  }

  const exitUrl = "/";

  const result = (
    <AssessmentRenderer 
      assessmentId="anonymous" 
      templateConfig={template.config as unknown as AssessmentTemplateConfig}
      mode="anonymous"
      completionSource={source || "DIRECT_LINK"}
      exitUrl={exitUrl}
    />
  );
  return result;
}
