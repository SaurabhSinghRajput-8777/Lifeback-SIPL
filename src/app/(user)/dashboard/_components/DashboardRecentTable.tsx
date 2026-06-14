import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { DashboardRepository } from "@/modules/dashboard/repositories/dashboard.repository";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";

export async function DashboardRecentTable({ clerkId }: { clerkId: string }) {
  const dataset = await DashboardRepository.getDashboardDataset(clerkId);
  const recent = DashboardService.getRecentAssessments(dataset, 5);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Recent Assessments</h3>
        <Link href="/dashboard/history" className="text-sm text-clinical-interactive hover:text-clinical-primary font-medium">View All</Link>
      </div>

      <div className="rounded-xl border border-indigo-100 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm overflow-hidden min-h-[250px]">
        {recent.length > 0 ? (
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
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 h-full text-center">
            <div className="w-16 h-16 rounded-full bg-brand-secondary/10 flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-brand-secondary/60" />
            </div>
            <p className="text-muted-foreground mb-4 font-medium">No recent assessments found.</p>
            <p className="text-sm text-muted-foreground/80 max-w-sm mb-6">
              Take your first assessment to establish a baseline and track your progress.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export function RecentTableSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Recent Assessments</h3>
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm overflow-hidden h-[250px] animate-pulse">
        <div className="w-full h-12 bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800"></div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 w-1/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
