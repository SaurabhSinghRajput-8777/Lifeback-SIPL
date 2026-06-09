import { prisma } from "@/lib/prisma/client";
import { AssessmentReviewStatus, AssessmentStatus } from "@prisma/client";

export class ClinicianRepository {
  /**
   * Fetches all users who have taken an assessment.
   */
  static async getPatients() {
    return prisma.user.findMany({
      where: {
        role: "USER",
        assessments: { some: {} }
      },
      include: {
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { responses: true }
        }
      }
    });
  }

  /**
   * Fetches the counts for clinician overview metrics.
   */
  static async getOverviewCounts() {
    const totalPatients = await prisma.user.count({
      where: { role: "USER", assessments: { some: {} } }
    });

    const pendingReview = await prisma.assessment.count({
      where: { 
        status: AssessmentStatus.COMPLETED,
        reviewStatus: AssessmentReviewStatus.PENDING 
      }
    });

    const reviewed = await prisma.assessment.count({
      where: { 
        reviewStatus: AssessmentReviewStatus.REVIEWED 
      }
    });

    // To get high-risk count, we usually have to evaluate the responses or reports.
    // For MVP, we will fetch all completed assessments and filter in memory, 
    // or rely on a cron-job / report riskLevel. Since we are creating the MVP,
    // we will fetch pending and evaluate.
    const allCompleted = await prisma.assessment.findMany({
      where: { status: AssessmentStatus.COMPLETED },
      include: { responses: true }
    });

    return { totalPatients, pendingReview, reviewed, allCompleted };
  }

  /**
   * Fetches detailed assessment history for a specific patient.
   */
  static async getPatientDetails(patientId: string) {
    return prisma.user.findUnique({
      where: { id: patientId },
      include: {
        assessments: {
          orderBy: { createdAt: "desc" },
          include: { responses: true, clinicalNotes: true }
        },
        patientNotes: {
          orderBy: { createdAt: "desc" },
          include: { clinician: true }
        }
      }
    });
  }

  /**
   * Saves a clinical note.
   */
  static async saveClinicalNote(data: { patientId: string; clinicianId: string; assessmentId?: string; title?: string; content: string }) {
    return prisma.clinicalNote.create({
      data: {
        patientId: data.patientId,
        clinicianId: data.clinicianId,
        assessmentId: data.assessmentId,
        title: data.title,
        content: data.content
      }
    });
  }
}
