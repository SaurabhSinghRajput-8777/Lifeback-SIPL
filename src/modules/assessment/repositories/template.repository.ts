import { prisma } from "@/lib/prisma/client";

export class TemplateRepository {
  private static templateCache = new Map<string, { data: any; expires: number }>();

  static async findById(id: string) {
    return prisma.assessmentTemplate.findUnique({
      where: { id },
    });
  }

  static async findByName(name: string) {
    const now = Date.now();
    const cached = this.templateCache.get(name);
    
    // 5 minute cache TTL
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const result = await prisma.assessmentTemplate.findFirst({
      where: { name, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (result) {
      this.templateCache.set(name, { data: result, expires: now + 5 * 60 * 1000 });
    }

    return result;
  }
}
