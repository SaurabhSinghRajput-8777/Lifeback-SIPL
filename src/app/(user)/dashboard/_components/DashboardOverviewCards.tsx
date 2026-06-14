import React from "react";
import { Activity, AlertCircle, ClipboardList, Clock } from "lucide-react";
import { DashboardRepository } from "@/modules/dashboard/repositories/dashboard.repository";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";

export async function DashboardOverviewCards({ clerkId }: { clerkId: string }) {
  const dataset = await DashboardRepository.getDashboardDataset(clerkId);
  const overview = DashboardService.getDashboardOverview(dataset);

  return (
    <>
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
          {overview.hasTakenAssessment ? overview.currentSeverity : "--"}
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
    </>
  );
}

export function OverviewCardsSkeleton() {
  const cards = [
    { title: "Latest Score", color: "indigo" },
    { title: "Severity", color: "orange" },
    { title: "Completed", color: "green" },
    { title: "In Progress", color: "purple" },
  ];

  return (
    <>
      {cards.map((card, idx) => (
        <div key={idx} className={`p-4 sm:p-6 lg:p-8 rounded-xl border border-${card.color}-100 dark:border-${card.color}-900/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm animate-pulse`}>
          <div className={`flex items-center justify-between border-b border-${card.color}-100 dark:border-${card.color}-900/30 pb-3 sm:pb-4 mb-3 sm:mb-4`}>
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className={`w-8 h-8 sm:w-9 sm:h-9 bg-${card.color}-50 dark:bg-${card.color}-500/10 rounded-lg`}></div>
          </div>
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mt-2"></div>
        </div>
      ))}
    </>
  );
}
