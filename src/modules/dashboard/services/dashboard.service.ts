import { prisma } from "@/lib/prisma/client";
import { RiskAssessmentService } from "./risk-assessment.service";

export class DashboardService {
  /**
   * Fetches the overview metrics for the User Dashboard MVP.
   */
  static async getDashboardOverview(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        assessments: {
          orderBy: { createdAt: "desc" },
          where: {
            OR: [
              { status: { not: "DRAFT" } },
              { status: "DRAFT", responses: { some: {} } }
            ]
          },
          include: { responses: true }
        }
      }
    });

    if (!user) {
      return {
        latestScore: null,
        currentSeverity: "N/A",
        completedCount: 0,
        inProgressCount: 0,
        hasTakenAssessment: false
      };
    }

    const assessments = user.assessments;
    const completedCount = assessments.filter(a => a.status === "COMPLETED").length;
    const inProgressCount = assessments.filter(a => a.status === "IN_PROGRESS" || a.status === "DRAFT").length;

    let latestScore = null;
    let currentSeverity = "N/A";

    // Find the latest completed assessment to calculate score
    const latestCompleted = assessments.find(a => a.status === "COMPLETED");
    
    if (latestCompleted && latestCompleted.responses.length > 0) {
      const answers: Record<string, number> = {};
      latestCompleted.responses.forEach(r => {
        const val = typeof r.answer === 'object' && r.answer !== null && 'value' in r.answer 
          ? Number((r.answer as { value: number }).value) 
          : Number(r.answer);
        answers[r.questionId] = isNaN(val) ? 0 : val;
      });
      
      latestScore = RiskAssessmentService.calculateScore(answers);
      currentSeverity = RiskAssessmentService.getSeverity(latestScore);
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
   * Fetches recent assessments for the user table.
   */
  static async getRecentAssessments(clerkId: string, limit?: number) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        assessments: {
          orderBy: { createdAt: "desc" },
          ...(limit ? { take: limit } : {}),
          where: {
            OR: [
              { status: { not: "DRAFT" } },
              { status: "DRAFT", responses: { some: {} } }
            ]
          },
          include: { template: true, responses: true }
        }
      }
    });

    if (!user) return [];

    return user.assessments.map(a => {
      let score = null;
      if (a.status === "COMPLETED" && a.responses.length > 0) {
        const answers: Record<string, number> = {};
        a.responses.forEach(r => {
          const val = typeof r.answer === 'object' && r.answer !== null && 'value' in r.answer 
            ? Number((r.answer as { value: number }).value) 
            : Number(r.answer);
          answers[r.questionId] = isNaN(val) ? 0 : val;
        });
        score = RiskAssessmentService.calculateScore(answers);
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
   * Fetches insights placeholders for the User Dashboard.
   */
  static async getInsights(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        assessments: {
          where: { status: "COMPLETED" },
          orderBy: { createdAt: "asc" },
          include: { responses: true }
        }
      }
    });

    if (!user || user.assessments.length === 0) {
      return {
        scoreTrend: [] as { date: string, score: number }[],
        consistency: "Not enough data",
        progressSummary: "Take your first assessment to begin generating insights."
      };
    }

    const scoreTrend = user.assessments.map(a => {
      let score = 0;
      a.responses.forEach(r => {
        const val = typeof r.answer === 'object' && r.answer !== null && 'value' in r.answer 
          ? Number((r.answer as { value: number }).value) 
          : Number(r.answer);
        score += isNaN(val) ? 0 : val;
      });
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
