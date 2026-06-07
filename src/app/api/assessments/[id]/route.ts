import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { AssessmentService } from "@/modules/assessment/services/assessment.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const cookieStore = await cookies();
    const anonymousId = cookieStore.get("anonymous_id")?.value;

    if (!userId && !anonymousId) {
      return NextResponse.json({ error: "Unauthorized. Missing identity." }, { status: 401 });
    }

    const { id } = await params;
    const assessment = await AssessmentService.getAssessment(id);

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json(assessment, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
