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
          className="inline-flex h-11 items-center justify-center rounded-md bg-brand-secondary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-brand-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Take First Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Overview Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Activity className="w-5 h-5 text-brand-secondary" />
            <span className="text-sm font-medium">Latest Score</span>
          </div>
          <div className="text-3xl font-heading font-bold text-foreground">
            {overview.latestScore !== null ? overview.latestScore : "--"}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Severity</span>
          </div>
          <div className="text-xl font-heading font-bold text-foreground truncate">
            {overview.currentSeverity}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="text-3xl font-heading font-bold text-foreground">
            {overview.completedCount}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">In Progress</span>
          </div>
          <div className="text-3xl font-heading font-bold text-foreground">
            {overview.inProgressCount}
          </div>
        </div>
      </section>

      {/* Quick Actions & Insights */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <section className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/dashboard/assessments" 
              className="flex items-center gap-3 w-full p-4 rounded-xl border border-brand-secondary/30 bg-brand-secondary/10 hover:bg-brand-secondary/20 transition-colors text-foreground"
            >
              <Activity className="w-5 h-5 text-brand-secondary" />
              <span className="font-medium">Take New Assessment</span>
            </Link>
            <Link 
              href="/dashboard/history" 
              className="flex items-center gap-3 w-full p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-foreground"
            >
              <History className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">View History</span>
            </Link>
          </div>

          <div className="mt-8 p-6 rounded-xl border border-border bg-card">
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Insights (Preview)
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {insights.progressSummary}
            </p>
            <div className="mt-4 text-xs font-mono text-muted-foreground">Consistency: {insights.consistency}</div>
          </div>
        </section>

        {/* Recent Assessments */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">Recent Assessments</h3>
            <Link href="/dashboard/history" className="text-sm text-brand-secondary hover:text-brand-secondary/80">View all</Link>
          </div>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="p-4">Assessment</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "COMPLETED" ? "bg-brand-secondary/20 text-brand-secondary" :
                          item.status === "IN_PROGRESS" ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" :
                          "bg-muted-foreground/20 text-muted-foreground"
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
