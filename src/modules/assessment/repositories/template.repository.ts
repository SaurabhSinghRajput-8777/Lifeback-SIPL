import { prisma } from "@/lib/prisma/client";

export class TemplateRepository {
  static async findById(id: string) {
    return prisma.assessmentTemplate.findUnique({
      where: { id },
    });
  }

  static async findByName(name: string) {
    return prisma.assessmentTemplate.findFirst({
      where: { name, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
