import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, History } from "lucide-react";
import { Suspense } from "react";

import { DashboardOverviewCards, OverviewCardsSkeleton } from "./_components/DashboardOverviewCards";
import { DashboardRecentTable, RecentTableSkeleton } from "./_components/DashboardRecentTable";
import { DashboardInsightsPanel, InsightsPanelSkeleton } from "./_components/DashboardInsightsPanel";

export default async function DashboardPage() {
  let clerkUser = await currentUser();
  
  if (!clerkUser && process.env.NODE_ENV === "development") {
    const h = await headers();
    const mockId = h.get('x-mock-clerk-id');
    if (mockId) {
      clerkUser = { id: mockId } as any;
    }
  }

  if (!clerkUser) redirect("/sign-in");

  const html = (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <DashboardOverviewCards clerkId={clerkUser.id} />
        </Suspense>
      </section>

      {/* Quick Actions & Insights */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Quick Actions & Insights Column */}
        <section className="lg:col-span-1 space-y-4 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-foreground">Action Center</h3>

          <div className="space-y-3">
            <Link
              href="/dashboard/assessments"
              className="flex items-center gap-3 w-full p-4 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 text-foreground group"
            >
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-semibold tracking-tight">Take New Assessment</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-3 w-full p-4 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 text-foreground group"
            >
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-semibold tracking-tight">View History</span>
            </Link>
          </div>

          <Suspense fallback={<InsightsPanelSkeleton />}>
            <DashboardInsightsPanel clerkId={clerkUser.id} />
          </Suspense>
        </section>

        {/* Recent Assessments Column */}
        <section className="lg:col-span-2 space-y-4 min-w-0">
          <Suspense fallback={<RecentTableSkeleton />}>
            <DashboardRecentTable clerkId={clerkUser.id} />
          </Suspense>
        </section>
      </div>
    </div>
  );
  
  return html;
}
