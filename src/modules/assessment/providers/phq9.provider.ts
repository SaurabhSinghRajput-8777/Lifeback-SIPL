/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentProvider } from "./provider.interface";
import { AssessmentResult, AssessmentTemplateConfig } from "@/types/assessment";

export class PHQ9Provider implements AssessmentProvider {
  public readonly version = "1.0.0";

  async validate(responses: Record<string, unknown>, template: AssessmentTemplateConfig): Promise<boolean> {
    const requiredQuestions = template.questions.filter((q) => q.required !== false);
    for (const q of requiredQuestions) {
      if (!(q.id in responses)) {
        return false;
      }
      const answer = responses[q.id];
      if (typeof answer !== "number" || answer < 0 || answer > 3) {
        return false;
      }
    }
    return true;
  }

  async score(responses: Record<string, unknown>, _template: AssessmentTemplateConfig): Promise<AssessmentResult> {
    let totalScore = 0;
    for (const key in responses) {
      const answer = responses[key];
      if (typeof answer === "number") {
        totalScore += answer;
      }
    }

    let severity = "Unknown";
    let summary = "Score calculated.";

    if (totalScore >= 0 && totalScore <= 4) {
      severity = "Minimal";
      summary = "Minimal depression symptoms.";
    } else if (totalScore >= 5 && totalScore <= 9) {
      severity = "Mild";
      summary = "Mild depression symptoms.";
    } else if (totalScore >= 10 && totalScore <= 14) {
      severity = "Moderate";
      summary = "Moderate depression symptoms.";
    } else if (totalScore >= 15 && totalScore <= 19) {
      severity = "Moderately Severe";
      summary = "Moderately severe depression symptoms.";
    } else if (totalScore >= 20 && totalScore <= 27) {
      severity = "Severe";
      summary = "Severe depression symptoms.";
    }

    return {
      providerVersion: this.version,
      totalScore,
      severity,
      summary,
    };
  }

  async generateSummary(result: AssessmentResult): Promise<string> {
    return `The PHQ-9 assessment indicates ${result.severity.toLowerCase()} symptoms with a total score of ${result.totalScore}. ${result.summary}`;
  }
}
