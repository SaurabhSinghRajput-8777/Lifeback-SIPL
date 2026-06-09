import { prisma } from "@/lib/prisma/client";
import { Prisma, AssessmentStatus } from "@prisma/client";

export class AssessmentRepository {
  static async create(data: Prisma.AssessmentUncheckedCreateInput) {
    return prisma.assessment.create({
      data,
    });
  }

  static async findById(id: string) {
    return prisma.assessment.findUnique({
      where: { id },
      include: {
        template: true,
        responses: true,
        report: true,
      },
    });
  }

  static async updateStatus(id: string, status: AssessmentStatus) {
    return prisma.assessment.update({
      where: { id },
      data: { status },
    });
  }

  static async saveReport(assessmentId: string, result: Prisma.AssessmentReportUncheckedCreateInput) {
    return prisma.assessmentReport.upsert({
      where: { assessmentId },
      create: result,
      update: result,
    });
  }
  
  static async getReport(assessmentId: string) {
    return prisma.assessmentReport.findUnique({
      where: { assessmentId },
    });
  }

  static async cleanupAllDrafts(templateId: string, excludeAssessmentId: string, userId?: string, anonymousSessionId?: string) {
    if (!userId && !anonymousSessionId) return;
    
    const drafts = await prisma.assessment.findMany({
      where: {
        templateId,
        status: AssessmentStatus.DRAFT,
        id: { not: excludeAssessmentId },
        ...(userId ? { userId } : { anonymousSessionId })
      },
      select: { id: true }
    });

    if (drafts.length > 0) {
      const draftIds = drafts.map(d => d.id);
      
      // Delete responses first to satisfy foreign key constraints
      await prisma.assessmentResponse.deleteMany({
        where: { assessmentId: { in: draftIds } }
      });

      // Delete the assessments
      await prisma.assessment.deleteMany({
        where: { id: { in: draftIds } }
      });
    }
  }
}
