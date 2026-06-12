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
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/30 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-indigo-900/70 dark:text-indigo-200">Latest Score</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.latestScore !== null ? overview.latestScore : "--"}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-orange-500/10 hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-orange-900/70 dark:text-orange-200">Severity</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-heading font-bold text-foreground truncate">
            {overview.currentSeverity}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-green-500/10 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-green-100 dark:border-green-900/30 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-green-900/70 dark:text-green-200">Completed</span>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {overview.completedCount}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/30 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-purple-900/70 dark:text-purple-200">In Progress</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            </div>
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

          <div className="mt-6 p-6 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md relative overflow-hidden group hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-purple-400/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2 relative z-10">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Insights (Preview)
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed relative z-10">
              {insights.progressSummary}
            </p>
            <div className="mt-4 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 inline-block px-2 py-1 rounded relative z-10">Consistency: {insights.consistency}</div>
          </div>
        </section>

        {/* Recent Assessments */}
        <section className="lg:col-span-2 space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">Recent Assessments</h3>
            <Link href="/dashboard/history" className="text-sm text-clinical-interactive hover:text-clinical-primary font-medium">View All</Link>
          </div>

          <div className="rounded-xl border border-indigo-100 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-indigo-100 dark:border-indigo-900/30 text-xs font-bold text-indigo-900/60 dark:text-indigo-200/60 uppercase tracking-wider bg-indigo-50/50 dark:bg-indigo-900/10">
                    <th className="p-4">Type</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50 dark:divide-indigo-900/20">
                  {recent.map((item) => (
                    <tr key={item.id} className="group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
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
