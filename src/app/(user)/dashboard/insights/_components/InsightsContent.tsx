import React from "react";
import Link from "next/link";
import { BarChart2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { DashboardRepository } from "@/modules/dashboard/repositories/dashboard.repository";
import { DashboardService } from "@/modules/dashboard/services/dashboard.service";

export async function InsightsContent({ clerkId }: { clerkId: string }) {
  const dataset = await DashboardRepository.getDashboardDataset(clerkId);
  const insights = DashboardService.getInsights(dataset);
  const { scoreTrend, consistency, progressSummary } = insights;
  const hasData = scoreTrend.length > 0;

  // PHQ-9 Max Score is 27
  const MAX_SCORE = 27;

  if (!hasData) {
    return (
      <div className="p-12 rounded-xl border border-border bg-card text-center">
        <div className="flex flex-col items-center justify-center">
          <BarChart2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg font-medium mb-2">No Insights Available</p>
          <p className="text-muted-foreground/70 text-sm max-w-md mb-6">
            Insights require at least one completed assessment to begin analyzing your mental health baseline.
          </p>
          <Link 
            href="/dashboard/assessments" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-secondary px-6 text-sm font-medium text-white shadow transition-colors hover:bg-brand-secondary/90"
          >
            Take First Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Chart */}
      <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card flex flex-col">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-secondary" />
          Symptom Severity Trend
        </h3>
        
        <div className="flex-1 flex items-end gap-2 sm:gap-4 h-64 mt-4 relative">
          {/* Y-Axis Lines (Background) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
            <div className="border-b border-border w-full h-0"></div>
            <div className="border-b border-border w-full h-0"></div>
            <div className="border-b border-border w-full h-0"></div>
            <div className="border-b border-border w-full h-0"></div>
          </div>

          {/* Bars */}
          {scoreTrend.map((data, idx) => {
            const heightPercent = Math.max((data.score / MAX_SCORE) * 100, 4); // Min 4% height to be visible
            
            // Color coding based on severity
            let barColor = "bg-green-500/80"; // Minimal
            if (data.score >= 5) barColor = "bg-yellow-500/80"; // Mild
            if (data.score >= 10) barColor = "bg-orange-500/80"; // Moderate
            if (data.score >= 15) barColor = "bg-red-500/80"; // Moderately Severe
            if (data.score >= 20) barColor = "bg-red-700/80"; // Severe

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 relative group z-10">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs py-1 px-2 rounded font-mono">
                  Score: {data.score}
                </div>
                
                {/* Bar */}
                <div className="w-full h-full flex items-end justify-center">
                  <div 
                    className={`w-full max-w-[40px] rounded-t-sm transition-all duration-1000 ease-out ${barColor} group-hover:brightness-125`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                
                {/* Label */}
                <div className="text-xs text-muted-foreground font-mono text-center w-full truncate px-1">
                  {data.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Analytics */}
      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-brand-secondary/30 bg-brand-secondary/5">
          <h4 className="text-sm font-medium text-brand-secondary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Summary
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            {progressSummary}
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-muted/30">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Tracking Consistency</h4>
          <div className="text-2xl font-heading font-bold text-foreground mb-2">
            {consistency}
          </div>
          <p className="text-xs text-muted-foreground/70">
            Based on frequency of assessments.
          </p>
        </div>
        
        <div className="p-6 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Clinical Note
          </h4>
          <p className="text-xs text-orange-600/80 dark:text-orange-200/70 leading-relaxed">
            These insights are generated by AI analysis of your self-reported scores. They are not a substitute for professional medical advice. Always consult your clinician regarding treatment changes.
          </p>
        </div>
      </div>
    </div>
  );
}

export function InsightsContentSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card flex flex-col h-[350px]">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="flex-1 flex items-end gap-4 h-64 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
              <div className="w-full max-w-[40px] bg-slate-200 dark:bg-slate-800 rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-border bg-card h-[140px]">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
          <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card h-[120px]">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card h-[140px]">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
          <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    </div>
  );
}
