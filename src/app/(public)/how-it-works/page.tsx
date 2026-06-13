import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, FileText, Cpu, Activity, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "How It Works | LifeBack",
  description: "A rigid, five-step clinical flow engineered to provide clarity in under three minutes.",
};

const steps = [
  {
    step: "01",
    title: "Initialize",
    subtitle: "Frictionless Access",
    desc: "We removed the barrier to entry. No account is required to take the assessment. We believe mental health insights should be instantly accessible when you need them most, without forcing you through a registration funnel.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Input",
    subtitle: "Standardized Evaluation",
    desc: "You will answer 9 carefully calibrated clinical questions based strictly on the Patient Health Questionnaire (PHQ-9) diagnostic criteria. This is the exact same framework utilized by medical professionals globally to screen for depression.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Process",
    subtitle: "Secure Scoring Engine",
    desc: "Your responses are processed instantly by our clinical scoring engine. Every calculation is performed with zero telemetry—meaning we do not track your keystrokes, monitor your screen time, or send your answers to third-party analytics.",
    icon: Cpu,
  },
  {
    step: "04",
    title: "Output",
    subtitle: "Severity Stratification",
    desc: "LifeBack translates your raw responses into a definitive, stratified severity matrix. You receive a clear cumulative score (0-27) along with a baseline clinical recommendation indicating the severity of your depressive symptoms.",
    icon: Activity,
  },
  {
    step: "05",
    title: "Retain",
    subtitle: "Data Portability",
    desc: "You retain absolute control over the output. You can export it instantly, print it for your doctor, or discard it entirely. If you choose to create an account, the data is saved securely, but you always maintain the right to delete it.",
    icon: Database,
  },
];

export default async function HowItWorksPage() {
  const { userId } = await auth();

  return (
    <div className="flex-1 w-full bg-background relative overflow-hidden">
      {/* Light/Dark Dynamic Background with Cubes & Emerald Gradient */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08] dark:opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto text-center border-b border-border">
        <div className="inline-flex items-center text-[10px] sm:text-[12px] font-mono font-bold uppercase tracking-[0.14em] text-foreground/60 mb-6 sm:mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Clinical Pipeline
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-heading font-bold tracking-tight text-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-[1.15] sm:leading-[1.1]">
          A rigid, standardized <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-serif italic break-words">clinical flow.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Engineered to provide actionable, evidence-based clarity in under three minutes. Zero friction, absolute privacy.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 lg:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-t border-border bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-12 md:gap-20">
            {steps.map((item, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-16 group">
                {/* Timeline Line (Desktop only) */}
                {idx !== steps.length - 1 && (
                  <div className="hidden md:block absolute left-[3.5rem] top-24 bottom-[-5rem] w-[1px] bg-border group-hover:bg-brand-secondary/50 transition-colors duration-500" />
                )}

                {/* Step Indicator */}
                <div className="shrink-0 flex items-center md:items-start gap-6 md:w-32">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:border-brand-secondary group-hover:shadow-md transition-all duration-300 z-10 relative">
                    <item.icon className="w-6 h-6 text-foreground/60 group-hover:text-brand-secondary transition-colors" />
                  </div>
                  <div className="md:hidden text-4xl font-heading font-bold text-foreground/10">{item.step}</div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-background p-8 rounded-2xl border border-border shadow-sm group-hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                  <div className="absolute -bottom-6 -right-2 text-[120px] font-heading font-bold text-foreground/[0.02] group-hover:text-foreground/[0.04] transition-colors duration-500 pointer-events-none select-none leading-none">
                    {item.step}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-[12px] font-mono font-bold text-brand-secondary mb-3 uppercase tracking-widest">
                      {item.subtitle}
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed md:text-lg">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 text-center bg-background border-t border-border">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6 md:mb-8 break-words">Ready to get started?</h2>
        <Link href={userId ? "/assessments/new" : "/assessments/anonymous?source=HOW_IT_WORKS"}>
          <Button size="lg" className="h-auto py-4 md:py-0 md:h-14 px-6 md:px-8 rounded-none font-heading font-bold text-[14px] md:text-[15px] bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-xl whitespace-normal text-center max-w-full">
            {userId ? "Start PHQ-9 Assessment" : "Start Anonymous PHQ-9 Assessment"} <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 shrink-0" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
