import { prisma } from "@/lib/prisma/client";
import { RiskAssessmentService } from "./risk-assessment.service";

export class DashboardService {
  /**
   * Derives the overview metrics from the unified dataset.
   */
  static getDashboardOverview(dataset: any) {
    if (!dataset) {
      return {
        latestScore: null,
        currentSeverity: "N/A",
        completedCount: 0,
        inProgressCount: 0,
        hasTakenAssessment: false
      };
    }

    const { assessments, draftsCount } = dataset;
    
    const completedAssessments = assessments.filter((a: any) => a.status === "COMPLETED");
    const completedCount = completedAssessments.length;
    const inProgressCount = assessments.filter((a: any) => a.status === "IN_PROGRESS").length + draftsCount;

    let latestScore = null;
    let currentSeverity = "N/A";

    const latestCompleted = completedAssessments[0]; // Ordered by desc
    if (latestCompleted && latestCompleted.report) {
      const reportJson = latestCompleted.report.reportJson as any;
      latestScore = reportJson.totalScore ?? null;
      currentSeverity = latestCompleted.report.riskLevel || "N/A";
    }

    return {
      latestScore,
      currentSeverity,
      completedCount,
      inProgressCount,
      hasTakenAssessment: assessments.length > 0
    };
  }

  /**
   * Derives recent assessments from the unified dataset.
   */
  static getRecentAssessments(dataset: any, limit: number = 5) {
    if (!dataset) return [];

    const { assessments } = dataset;
    
    return assessments.slice(0, limit).map((a: any) => {
      let score = null;
      if (a.status === "COMPLETED" && a.report) {
        const reportJson = a.report.reportJson as any;
        score = reportJson.totalScore ?? null;
      }

      return {
        id: a.id,
        name: a.template.name,
        date: a.createdAt,
        status: a.status,
        score
      };
    });
  }

  /**
   * Derives insights from the unified dataset.
   */
  static getInsights(dataset: any) {
    if (!dataset) {
      return {
        scoreTrend: [] as { date: string, score: number }[],
        consistency: "Not enough data",
        progressSummary: "Take your first assessment to begin generating insights."
      };
    }

    const completedAssessments = dataset.assessments.filter((a: any) => a.status === "COMPLETED");

    if (completedAssessments.length === 0) {
      return {
        scoreTrend: [] as { date: string, score: number }[],
        consistency: "Not enough data",
        progressSummary: "Take your first assessment to begin generating insights."
      };
    }

    // Trend requires ascending order (oldest to newest)
    const chronological = [...completedAssessments].reverse();

    const scoreTrend = chronological.map((a: any) => {
      const reportJson = a.report?.reportJson as any;
      const score = reportJson?.totalScore ?? 0;
      return {
        date: a.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score
      };
    });

    const recentTrend = scoreTrend.slice(-6);

    let progressSummary = "Continue taking regular assessments to establish a clear trend.";
    if (scoreTrend.length >= 2) {
      const firstScore = scoreTrend[0].score;
      const lastScore = scoreTrend[scoreTrend.length - 1].score;
      const diff = firstScore - lastScore;
      
      if (diff > 0) {
        const percent = Math.round((diff / (firstScore || 1)) * 100);
        progressSummary = `You have shown a ${percent}% (${diff} point) reduction in symptom severity since your first assessment.`;
      } else if (diff < 0) {
        progressSummary = `Your symptom severity has increased by ${Math.abs(diff)} points. Please consider discussing this with your clinician.`;
      } else {
        progressSummary = "Your symptom severity has remained stable compared to your initial baseline.";
      }
    }

    return {
      scoreTrend: recentTrend,
      consistency: scoreTrend.length > 2 ? "Good" : "Building data...",
      progressSummary
    };
  }
}
