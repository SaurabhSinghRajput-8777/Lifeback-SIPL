import { currentUser } from "@clerk/nextjs/server";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ClipboardList, TrendingUp, Clock, AlertCircle, History } from "lucide-react";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const overview = await DashboardService.getDashboardOverview(clerkUser.id);
  const recent = await DashboardService.getRecentAssessments(clerkUser.id, 5);
  const insights = await DashboardService.getInsights(clerkUser.id);

  if (!overview.hasTakenAssessment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-full bg-brand-secondary/20 flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-brand-secondary" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Welcome to LifeBack</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          Take your first PHQ-9 assessment to establish your baseline and begin tracking your mental health journey.
        </p>
        <Link
          href="/dashboard/assessments"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Take First Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Latest Score</span>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.latestScore !== null ? overview.latestScore : "--"}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Severity</span>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <div className="text-lg sm:text-xl font-heading font-bold text-foreground truncate">
            {overview.currentSeverity}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</span>
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.completedCount}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">In Progress</span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-clinical-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.inProgressCount}
          </div>
        </div>
      </section>

      {/* Quick Actions & Insights */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

        {/* Quick Actions */}
        <section className="lg:col-span-1 space-y-4 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-foreground">Action Center (Blue Theme)</h3>

          <div className="space-y-3">
            <Link
              href="/dashboard/assessments"
              className="flex items-center gap-3 w-full p-5 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300 text-foreground"
            >
              <Activity className="w-5 h-5 text-clinical-primary" />
              <span className="font-medium">Take New Assessment</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-3 w-full p-5 rounded-xl border border-border/80 bg-card shadow-sm hover:border-clinical-interactive/30 hover:shadow-md transition-all duration-300 text-foreground"
            >
              <History className="w-5 h-5 text-clinical-interactive" />
              <span className="font-medium">View History</span>
            </Link>
          </div>

          <div className="mt-6 p-6 rounded-xl border border-clinical-soft/50 bg-clinical-soft/30 dark:bg-clinical-primary/10 shadow-sm">
            <h4 className="text-sm font-medium text-clinical-navy dark:text-clinical-soft mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-clinical-primary" /> Insights (Preview)
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {insights.progressSummary}
            </p>
            <div className="mt-4 text-xs font-mono text-muted-foreground">Consistency: {insights.consistency}</div>
          </div>
        </section>

        {/* Recent Assessments */}
        <section className="lg:col-span-2 space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">Recent Assessments</h3>
            <Link href="/dashboard/history" className="text-sm text-clinical-interactive hover:text-clinical-primary font-medium">View All</Link>
          </div>

          <div className="rounded-xl border border-border/80 shadow-sm bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="p-4">Type</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {recent.map((item) => (
                    <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === "COMPLETED" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                          item.status === "IN_PROGRESS" ? "bg-clinical-primary/20 text-clinical-primary" :
                            "bg-muted/50 text-muted-foreground border border-border"
                          }`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono text-foreground">
                        {item.score !== null ? item.score : "-"}
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                        No recent assessments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
