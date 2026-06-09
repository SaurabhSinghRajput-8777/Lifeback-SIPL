import { ClinicianRepository } from "../repositories/clinician.repository";
import { RiskAssessmentService } from "@/modules/dashboard/services/risk-assessment.service";

export class ClinicianService {
  /**
   * Fetches overview metrics for the Clinician Dashboard.
   */
  static async getClinicianOverview() {
    const data = await ClinicianRepository.getOverviewCounts();

    // Calculate High Risk count
    let highRiskCount = 0;
    for (const assessment of data.allCompleted) {
      const answers: Record<string, number> = {};
      assessment.responses.forEach(r => {
        const val = typeof r.answer === 'object' && r.answer !== null && 'value' in r.answer 
          ? Number((r.answer as { value: number }).value) 
          : Number(r.answer);
        answers[r.questionId] = isNaN(val) ? 0 : val;
      });
      
      const score = RiskAssessmentService.calculateScore(answers);
      const isHighRisk = RiskAssessmentService.isHighRisk(score, answers["phq9_9"]);
      
      if (isHighRisk) {
        highRiskCount++;
      }
    }

    return {
      totalPatients: data.totalPatients,
      pendingReview: data.pendingReview,
      reviewed: data.reviewed,
      highRisk: highRiskCount
    };
  }

  /**
   * Fetches the patient table data.
   */
  static async getPatientTable() {
    const patients = await ClinicianRepository.getPatients();

    return patients.map(p => {
      let latestScore = null;
      let severity = "N/A";
      let reviewStatus = "N/A";
      let date = null;

      if (p.assessments.length > 0) {
        const latest = p.assessments[0];
        date = latest.createdAt;
        reviewStatus = latest.reviewStatus;
        
        if (latest.status === "COMPLETED") {
          const answers: Record<string, number> = {};
          latest.responses.forEach(r => {
            const val = typeof r.answer === 'object' && r.answer !== null && 'value' in r.answer 
              ? Number((r.answer as { value: number }).value) 
              : Number(r.answer);
            answers[r.questionId] = isNaN(val) ? 0 : val;
          });
          latestScore = RiskAssessmentService.calculateScore(answers);
          severity = RiskAssessmentService.getSeverity(latestScore);
        }
      }

      return {
        id: p.id,
        name: p.email.split("@")[0], // Fallback if no profile name exists yet
        latestScore,
        severity,
        date,
        reviewStatus
      };
    });
  }

  /**
   * Fetches the high-risk queue.
   */
  static async getHighRiskQueue() {
    const data = await ClinicianRepository.getOverviewCounts();
    const queue = [];

    for (const assessment of data.allCompleted) {
      if (assessment.reviewStatus === "REVIEWED") continue; // Optionally hide reviewed high-risk

      const answers: Record<string, number> = {};
      assessment.responses.forEach(r => {
        const val = typeof r.answer === 'object' && r.answer !== null && 'value' in r.answer 
          ? Number((r.answer as { value: number }).value) 
          : Number(r.answer);
        answers[r.questionId] = isNaN(val) ? 0 : val;
      });
      
      const score = RiskAssessmentService.calculateScore(answers);
      const isHighRisk = RiskAssessmentService.isHighRisk(score, answers["phq9_9"]);
      
      if (isHighRisk) {
        queue.push({
          assessmentId: assessment.id,
          userId: assessment.userId,
          score,
          severity: RiskAssessmentService.getSeverity(score),
          date: assessment.createdAt,
          reviewStatus: assessment.reviewStatus
        });
      }
    }

    // Sort by most recent
    return queue.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
