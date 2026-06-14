import React from "react";
import { TrendingUp, Activity } from "lucide-react";
import { DashboardRepository } from "@/modules/dashboard/repositories/dashboard.repository";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";
import Link from "next/link";

export async function DashboardInsightsPanel({ clerkId }: { clerkId: string }) {
  const dataset = await DashboardRepository.getDashboardDataset(clerkId);
  const insights = DashboardService.getInsights(dataset);
  const overview = DashboardService.getDashboardOverview(dataset);

  return (
    <div className="mt-6 p-6 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md relative overflow-hidden group hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500 min-h-[160px]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-purple-400/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2 relative z-10">
        <TrendingUp className="w-4 h-4 text-indigo-500" /> Insights (Preview)
      </h4>
      
      {overview.hasTakenAssessment ? (
        <>
          <p className="text-sm text-foreground/80 leading-relaxed relative z-10">
            {insights.progressSummary}
          </p>
          <div className="mt-4 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 inline-block px-2 py-1 rounded relative z-10">
            Consistency: {insights.consistency}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start relative z-10">
          <p className="text-sm text-muted-foreground/80 leading-relaxed mb-4">
            Insights will appear here once you complete your first assessment.
          </p>
          <Link 
            href="/dashboard/assessments"
            className="text-xs font-medium text-clinical-primary hover:underline flex items-center gap-1"
          >
            <Activity className="w-3 h-3" />
            Start First Assessment
          </Link>
        </div>
      )}
    </div>
  );
}

export function InsightsPanelSkeleton() {
  return (
    <div className="mt-6 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md relative overflow-hidden h-[160px] animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
      <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
  );
}
