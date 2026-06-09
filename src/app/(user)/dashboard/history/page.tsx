import { currentUser } from "@clerk/nextjs/server";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { History as HistoryIcon, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HistoryPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Pass no limit to fetch all assessments
  const allAssessments = await DashboardService.getRecentAssessments(clerkUser.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Assessment History</h2>
          <p className="text-muted-foreground">
            View your past assessment scores and track your progress over time.
          </p>
        </div>
        
        <Link 
          href="/dashboard/assessments" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-6 text-sm font-medium transition-colors hover:bg-secondary/80"
        >
          Take New Assessment
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table Toolbar / Controls (Placeholder for future functionality) */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <HistoryIcon className="w-4 h-4" />
            <span>{allAssessments.length} Record{allAssessments.length !== 1 ? 's' : ''} Found</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground hover:bg-muted">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="p-4">Assessment Name</th>
                <th className="p-4">Date Taken</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allAssessments.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{item.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {item.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
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
                  <td className="p-4 text-sm font-mono font-medium text-foreground">
                    {item.score !== null ? item.score : "-"}
                  </td>
                  <td className="p-4 text-sm text-right">
                    <Link 
                      href={`/assessments/${item.id}`} 
                      className="text-brand-secondary hover:text-brand-secondary/80 font-medium transition-colors"
                    >
                      {item.status === "COMPLETED" ? "View Report" : "Continue"}
                    </Link>
                  </td>
                </tr>
              ))}
              {allAssessments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <HistoryIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground text-lg font-medium mb-2">No assessments found</p>
                      <p className="text-muted-foreground/70 text-sm max-w-md">
                        You haven't taken any assessments yet. Taking assessments helps track your mental health over time.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
