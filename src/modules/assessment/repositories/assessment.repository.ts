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
}
