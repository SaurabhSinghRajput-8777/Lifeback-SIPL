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
      select: {
        id: true,
        email: true,
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            createdAt: true,
            status: true,
            reviewStatus: true,
            report: {
              select: {
                riskLevel: true,
                reportJson: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Fetches the counts for clinician overview metrics.
   */
  static async getOverviewCounts() {
    const [totalPatients, pendingReview, reviewed, highRisk] = await Promise.all([
      prisma.user.count({
        where: { role: "USER", assessments: { some: {} } }
      }),
      prisma.assessment.count({
        where: { 
          status: AssessmentStatus.COMPLETED,
          reviewStatus: AssessmentReviewStatus.PENDING 
        }
      }),
      prisma.assessment.count({
        where: { 
          reviewStatus: AssessmentReviewStatus.REVIEWED 
        }
      }),
      prisma.assessmentReport.count({
        where: {
          reportJson: {
            path: ['isHighRisk'],
            equals: true
          }
        }
      })
    ]);

    return { totalPatients, pendingReview, reviewed, highRisk };
  }

  /**
   * Fetches detailed assessment history for a specific patient.
   */
  static async getPatientDetails(patientId: string) {
    return prisma.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        email: true,
        assessments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            createdAt: true,
            reviewStatus: true,
            clinicalNotes: true,
            report: {
              select: {
                riskLevel: true,
                reportJson: true
              }
            }
          }
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
