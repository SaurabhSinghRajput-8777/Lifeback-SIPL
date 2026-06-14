import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { HistoryTable, HistoryTableSkeleton } from "./_components/HistoryTable";

export default async function HistoryPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Assessment History</h2>
          <p className="text-muted-foreground">
            View your past assessment scores and track your progress over time.
          </p>
        </div>
        
        <Link 
          href="/dashboard/assessments" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary text-primary-foreground px-6 text-sm font-medium transition-colors hover:bg-primary/90"
        >
          Take New Assessment
        </Link>
      </div>

      <Suspense fallback={<HistoryTableSkeleton />}>
        <HistoryTable clerkId={clerkUser.id} />
      </Suspense>
    </div>
  );
}
