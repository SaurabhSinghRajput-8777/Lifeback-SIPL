/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentProvider } from "./providers/provider.interface";

// Placeholder classes until implemented
class Phq9Provider implements AssessmentProvider {
  async validate() { return true; }
  async submit(data: Record<string, unknown>) { return data; }
  async score(_responses: Record<string, unknown>) { return 0; }
  async generateReport(_resultId: string) { return {}; }
}

class VoiceProvider implements AssessmentProvider {
  async validate() { return true; }
  async submit(data: Record<string, unknown>) { return data; }
  async score(_responses: Record<string, unknown>) { return 0; }
  async generateReport(_resultId: string) { return {}; }
}

export const assessmentRegistry: Record<string, new () => AssessmentProvider> = {
  phq9: Phq9Provider,
  voice: VoiceProvider,
};
