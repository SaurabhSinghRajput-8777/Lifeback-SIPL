import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { AssessmentService } from "@/modules/assessment/services/assessment.service";
import { AnonymousSessionService } from "@/modules/auth/services/anonymous-session.service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const cookieStore = await cookies();
    const anonymousId = cookieStore.get("anonymous_id")?.value;

    let dbSessionId: string | undefined = undefined;

    if (!userId) {
      if (anonymousId) {
        // Look up existing session to get the primary key 'id'
        const session = await AnonymousSessionService.getSessionByAnonymousId(anonymousId);
        if (session) {
          dbSessionId = session.id;
        }
      } 
      
      if (!dbSessionId) {
        // Create new session if no cookie or if session wasn't found in DB
        const session = await AnonymousSessionService.createSession();
        dbSessionId = session.id;
      }
    }

    const body = await req.json();
    if (!body.templateName) {
      return NextResponse.json({ error: "templateName is required" }, { status: 400 });
    }

    const assessment = await AssessmentService.startAssessment(
      body.templateName,
      userId || undefined,
      dbSessionId
    );

    return NextResponse.json(assessment, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/assessments/start] ERROR CAUGHT:", error);
    if (error instanceof Error && error.stack) {
      console.error("[POST /api/assessments/start] STACK TRACE:", error.stack);
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ error: message, stack }, { status: 500 });
  }
}
