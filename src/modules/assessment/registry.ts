/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentProvider } from "./providers/provider.interface";

import { PHQ9Provider } from "./providers/phq9.provider";
import { AssessmentResult, AssessmentTemplateConfig } from "@/types/assessment";

// Placeholder class until implemented
class VoiceProvider implements AssessmentProvider {
  async validate(_responses: Record<string, unknown>, _template: AssessmentTemplateConfig) { return true; }
  async score(_responses: Record<string, unknown>, _template: AssessmentTemplateConfig) {
    return {
      providerVersion: "1.0.0",
      totalScore: 0,
      severity: "Unknown",
      summary: "Voice assessment not yet implemented.",
    };
  }
  async generateSummary(_result: AssessmentResult) { return "Pending"; }
}

export const assessmentRegistry: Record<string, new () => AssessmentProvider> = {
  phq9: PHQ9Provider,
  voice: VoiceProvider,
};
