import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { InsightsContent, InsightsContentSkeleton } from "./_components/InsightsContent";

export default async function InsightsPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Health Insights</h2>
          <p className="text-muted-foreground">
            AI-driven analysis of your assessment history and symptom progression.
          </p>
        </div>
      </div>

      <Suspense fallback={<InsightsContentSkeleton />}>
        <InsightsContent clerkId={clerkUser.id} />
      </Suspense>
    </div>
  );
}
