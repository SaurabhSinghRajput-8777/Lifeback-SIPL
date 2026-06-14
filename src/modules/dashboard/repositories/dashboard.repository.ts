import { prisma } from "@/lib/prisma/client";
import { cache } from "react";

export class DashboardRepository {
  /**
   * Fetches the minimal, unified dataset required for the User Dashboard.
   * Eliminates the need to independently query the DB for Overview, Recent, and Insights.
   */
  static getDashboardDataset = cache(async (clerkId: string) => {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true }
    });

    if (!user) return null;

    // Run parallel queries to avoid sequential round-trip latency
    const [assessments, draftsCount] = await Promise.all([
      prisma.assessment.findMany({
        where: { userId: user.id, status: { not: "DRAFT" } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          reviewStatus: true,
          template: {
            select: { name: true }
          },
          report: {
            select: {
              riskLevel: true,
              reportJson: true
            }
          }
        }
      }),
      prisma.assessment.count({
        where: { userId: user.id, status: "DRAFT" }
      })
    ]);

    return {
      userId: user.id,
      assessments,
      draftsCount
    };
  });
}
