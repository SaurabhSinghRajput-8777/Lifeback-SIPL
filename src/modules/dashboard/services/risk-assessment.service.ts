export class RiskAssessmentService {
  /**
   * Calculates the PHQ-9 total score from a set of answers.
   */
  static calculateScore(answers: Record<string, number>): number {
    return Object.values(answers).reduce((acc, val) => acc + (val || 0), 0);
  }

  /**
   * Determines the severity category based on the PHQ-9 score.
   */
  static getSeverity(score: number): string {
    if (score >= 20) return "Severe";
    if (score >= 15) return "Moderately Severe";
    if (score >= 10) return "Moderate";
    if (score >= 5) return "Mild";
    return "Minimal";
  }

  /**
   * Determines if an assessment should be flagged for the High-Risk Queue.
   * Criteria: Severe severity OR Question 9 score > 0.
   */
  static isHighRisk(score: number, question9Score?: number): boolean {
    const isSevere = score >= 20;
    const hasSelfHarmRisk = question9Score !== undefined && question9Score > 0;
    
    return isSevere || hasSelfHarmRisk;
  }
}
