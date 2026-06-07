import { AssessmentResult, AssessmentTemplateConfig } from "@/types/assessment";

export interface AssessmentProvider {
  validate(responses: Record<string, unknown>, template: AssessmentTemplateConfig): Promise<boolean>;
  score(responses: Record<string, unknown>, template: AssessmentTemplateConfig): Promise<AssessmentResult>;
  generateSummary(result: AssessmentResult): Promise<string>;
}
