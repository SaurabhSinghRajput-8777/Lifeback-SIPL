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
    let anonymousId = cookieStore.get("anonymous_id")?.value;

    if (!userId && !anonymousId) {
      const session = await AnonymousSessionService.createSession();
      anonymousId = session.anonymousId;
    }

    const body = await req.json();
    if (!body.templateName) {
      return NextResponse.json({ error: "templateName is required" }, { status: 400 });
    }

    const assessment = await AssessmentService.startAssessment(
      body.templateName,
      userId || undefined,
      anonymousId || undefined
    );

    return NextResponse.json(assessment, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
