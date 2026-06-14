import React from "react";
import Link from "next/link";
import { History as HistoryIcon, Filter } from "lucide-react";
import { DashboardRepository } from "@/modules/dashboard/repositories/dashboard.repository";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";
import { Button } from "@/components/ui/button";

export async function HistoryTable({ clerkId }: { clerkId: string }) {
  const dataset = await DashboardRepository.getDashboardDataset(clerkId);
  const allAssessments = DashboardService.getRecentAssessments(dataset, 1000);

  return (
    <div className="rounded-xl border border-border/80 shadow-sm bg-card overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
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
            <tr className="border-b border-border/40 bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <th className="p-4">Assessment Name</th>
              <th className="p-4">Date Taken</th>
              <th className="p-4">Status</th>
              <th className="p-4">Score</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {allAssessments.map((item: any) => (
              <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                <td className="p-4 text-sm font-medium text-foreground">{item.name}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {item.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                </td>
                <td className="p-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "COMPLETED" ? "bg-brand-secondary/20 text-brand-secondary" :
                    item.status === "IN_PROGRESS" ? "bg-brand-violet/20 text-brand-violet" :
                    "bg-muted/50 text-muted-foreground border border-border"
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
                    className="text-brand-violet hover:text-brand-violet/80 font-medium transition-colors opacity-0 group-hover:opacity-100"
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
  );
}

export function HistoryTableSkeleton() {
  return (
    <div className="rounded-xl border border-border/80 shadow-sm bg-card overflow-hidden animate-pulse">
      <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="w-full h-10 bg-muted/40 border-b border-border/40"></div>
      <div className="divide-y divide-border/80">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center p-4">
            <div className="h-4 w-1/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-1/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
