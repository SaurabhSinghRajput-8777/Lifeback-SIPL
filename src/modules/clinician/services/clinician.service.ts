import { ClinicianRepository } from "../repositories/clinician.repository";
import { RiskAssessmentService } from "@/modules/dashboard/services/risk-assessment.service";
import { prisma } from "@/lib/prisma/client";

export class ClinicianService {
  /**
   * Fetches overview metrics for the Clinician Dashboard.
   */
  static async getClinicianOverview() {
    return ClinicianRepository.getOverviewCounts();
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
        
        if (latest.status === "COMPLETED" && latest.report) {
          const reportJson = latest.report.reportJson as any;
          latestScore = reportJson.totalScore ?? null;
          severity = latest.report.riskLevel || "N/A";
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
   * Fetches the high-risk queue directly from the database.
   */
  static async getHighRiskQueue() {
    const highRiskReports = await prisma.assessmentReport.findMany({
      where: {
        assessment: { reviewStatus: "PENDING" }, // Only show pending in the queue
        reportJson: {
          path: ['isHighRisk'],
          equals: true
        }
      },
      include: {
        assessment: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            reviewStatus: true
          }
        }
      },
      orderBy: {
        generatedAt: 'desc'
      }
    });

    return highRiskReports.map(report => {
      const reportJson = report.reportJson as any;
      return {
        assessmentId: report.assessment.id,
        userId: report.assessment.userId,
        score: reportJson.totalScore ?? 0,
        severity: report.riskLevel || "N/A",
        date: report.assessment.createdAt,
        reviewStatus: report.assessment.reviewStatus
      };
    });
  }
}
