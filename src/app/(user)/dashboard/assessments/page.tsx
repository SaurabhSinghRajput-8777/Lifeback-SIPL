import Link from "next/link";
import { Activity, Mic, ArrowRight } from "lucide-react";

import { startAssessmentAction } from "./actions";

export default function AssessmentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Available Assessments</h2>
        <p className="text-muted-foreground">
          Select an assessment below to begin. Regular check-ins help us track your progress more effectively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link 
          href="/assessments/new"
          className="group relative flex flex-col p-6 rounded-2xl border border-brand-secondary/30 bg-brand-secondary/5 hover:bg-brand-secondary/10 transition-all duration-300 h-full"
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-brand-secondary" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center mb-6">
            <Activity className="w-6 h-6 text-brand-secondary" />
          </div>
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">
            PHQ-9 (Depression)
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
            The Patient Health Questionnaire is a standard instrument for screening, diagnosing, monitoring, and measuring the severity of depression.
          </p>
          <div className="flex items-center justify-between text-xs font-medium mt-auto w-full">
            <span className="text-brand-secondary">9 Questions</span>
            <span className="text-muted-foreground">~3 mins</span>
          </div>
        </Link>

        {/* Voice Assessment Card (Placeholder) */}
        <div className="group relative flex flex-col p-6 rounded-2xl border border-border bg-card opacity-75">
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              Coming Soon
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
            <Mic className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading font-bold text-muted-foreground mb-2">
            Voice Assessment
          </h3>
          <p className="text-muted-foreground/70 text-sm leading-relaxed mb-6 flex-1">
            An advanced AI-powered acoustic analysis tool that detects subtle vocal biomarkers correlated with psychological stress and mood disorders.
          </p>
          <div className="flex items-center justify-between text-xs font-medium mt-auto">
            <span className="text-muted-foreground">Voice Recording</span>
            <span className="text-muted-foreground">~1 min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
