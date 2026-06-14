import { NextResponse } from "next/server";
import { AnonymousSessionService } from "@/modules/auth/services/anonymous-session.service";
import { prisma } from "@/lib/prisma/client";
import { PHQ9Provider } from "@/modules/assessment/providers/phq9.provider";
import { TemplateRepository } from "@/modules/assessment/repositories/template.repository";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Currently only supporting PHQ9 in this flow
    const templateName = "PHQ9";

    // Run independent tasks in parallel
    const templatePromise = TemplateRepository.findByName(templateName);
    const bodyPromise = req.json();
    const sessionPromise = AnonymousSessionService.getSession().then(async session => {
      if (!session) {
        const newSession = await AnonymousSessionService.createSession();
        return newSession.id;
      } else {
        // Extend session TTL since they are active
        await AnonymousSessionService.extendTTL(session.anonymousId);
        return session.id;
      }
    });

    const [template, body, dbSessionId] = await Promise.all([templatePromise, bodyPromise, sessionPromise]);

    // Rate Limiting: Max 10 per hour per session
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await prisma.anonymousAssessmentMetric.count({
      where: {
        sessionId: dbSessionId,
        completedAt: { gte: oneHourAgo }
      }
    });

    if (recentCount >= 10) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }

    const { responses, completionSource, durationSeconds } = body;

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: "Invalid responses format" }, { status: 400 });
    }
    
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const provider = new PHQ9Provider();
    
    // Convert config
    const config = template.config as any;

    const isValid = await provider.validate(responses, config);
    if (!isValid) {
      return NextResponse.json({ error: "Validation failed. Ensure all required questions are answered." }, { status: 400 });
    }

    const result = await provider.score(responses, config);

    // High risk logic based on PHQ-9 Question 9
    // 0 = Normal, 1 = Support Resources, 2 = High Risk, 3 = Immediate Crisis
    const q9Value = typeof responses['phq9_9'] === 'number' ? responses['phq9_9'] : 0;
    const isHighRisk = q9Value > 0;
    const riskLevel = q9Value; // 0, 1, 2, 3

    // Save strictly aggregate data
    const metric = await prisma.anonymousAssessmentMetric.create({
      data: {
        sessionId: dbSessionId,
        assessmentType: templateName,
        score: result.totalScore,
        severity: result.severity,
        completionSource: completionSource || 'UNKNOWN',
        durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : null,
        isHighRisk,
        completedAt: new Date()
      }
    });

    // We do NOT save responses to the database. They are discarded.

    return NextResponse.json({ 
      metricId: metric.id,
      totalScore: result.totalScore, 
      severity: result.severity, 
      isHighRisk,
      riskLevel,
      templateName,
      summary: result.summary
    }, { status: 200 });

  } catch (error: any) {
    console.error("[POST /api/assessments/anonymous/complete] Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
