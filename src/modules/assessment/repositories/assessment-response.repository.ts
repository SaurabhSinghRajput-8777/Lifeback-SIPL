import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export class AssessmentResponseRepository {
  static async saveResponse(assessmentId: string, questionId: string, answer: unknown) {
    const existing = await prisma.assessmentResponse.findFirst({
      where: { assessmentId, questionId },
    });

    if (existing) {
      return prisma.assessmentResponse.update({
        where: { id: existing.id },
        data: { answer: answer as Prisma.InputJsonValue },
      });
    }

    return prisma.assessmentResponse.create({
      data: {
        assessmentId,
        questionId,
        answer: answer as Prisma.InputJsonValue,
      },
    });
  }

  static async getResponses(assessmentId: string) {
    return prisma.assessmentResponse.findMany({
      where: { assessmentId },
    });
  }
}
