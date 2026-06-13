import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Network, Scale, BrainCircuit, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileCarousel } from "@/components/ui/mobile-carousel";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Why LifeBack | The Orchestration Platform",
  description: "An Architecture of Trust built for precision, privacy, and clinical relevance.",
};

const pillars = [
  {
    title: "Orchestration, Not Just Assessment",
    subtitle: "Extensible Platform Architecture",
    desc: "LifeBack is positioned as an extensible assessment operating system. Rather than hardcoding simple forms, LifeBack orchestrates complex, multi-modal clinical workflows. It securely routes data to external AI systems without internalizing the ML models directly, ensuring a highly modular, decoupled, and robust architecture.",
    icon: Network,
  },
  {
    title: "AI Assists — Never Replaces",
    subtitle: "Strict Clinical Boundaries",
    desc: "Clinical judgment is never delegated to a model. Every AI output generated on our platform is framed strictly as a behavioral observation—serving as a powerful triage and prioritization tool for clinicians, never as a replacement for their expertise or a definitive diagnostic classification.",
    icon: BrainCircuit,
  },
  {
    title: "Privacy Is Structural",
    subtitle: "Zero Telemetry & RLS",
    desc: "Privacy isn't a feature toggle; it's structural. From hashing client IPs to guaranteeing zero-telemetry workflows, patient data is fundamentally isolated. At the database layer, PostgreSQL Row-Level Security (RLS) ensures absolute data segregation and strict access control across our four-tier authorization model.",
    icon: Lock,
  },
  {
    title: "Research Standard Precision",
    subtitle: "Evidence-Based Frameworks",
    desc: "We don't invent new psychological frameworks. LifeBack strictly adheres to the Patient Health Questionnaire (PHQ-9) diagnostic criteria. We exist to digitize, secure, and scale the exact clinical standards used by medical professionals worldwide with unmatched precision and speed.",
    icon: Scale,
  },
];

export default async function WhyLifebackPage() {
  const { userId } = await auth();

  return (
    <div className="flex-1 w-full bg-background text-foreground relative overflow-hidden">
      {/* Light/Dark Dynamic Background with Cubes & Orange Gradient */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08] dark:opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto text-center border-b border-border">
        <div className="inline-flex items-center text-[10px] sm:text-[12px] font-mono font-bold uppercase tracking-[0.14em] text-foreground/50 mb-6 sm:mb-8">
          <div className="w-2 h-2 rounded-full bg-brand-secondary mr-3 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          Core Architecture
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-heading font-bold tracking-tight text-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-[1.15] sm:leading-[1.1]">
          An architecture built entirely on <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-rose-400 font-serif italic break-words">absolute trust.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          In a landscape cluttered with pseudo-science and invasive tracking, LifeBack is engineered as a secure, clinical-grade assessment operating system.
        </p>
      </section>

      {/* Deep-Dive Staggered Section */}
      <section className="py-16 md:py-24 lg:py-32 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
          {pillars.map((pillar, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Abstract Visual / Diagram Card */}
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/3] rounded-3xl bg-muted/30 border border-border flex items-center justify-center p-6 sm:p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-background border border-border shadow-xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-700 ease-out">
                    <pillar.icon className="h-8 w-8 sm:h-10 sm:w-10 text-brand-secondary/80" strokeWidth={1.5} />
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border/50 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-0 w-[1px] h-full bg-border/50 -translate-x-1/2" />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
                <div className="text-[10px] sm:text-[12px] font-mono font-bold text-brand-secondary mb-3 sm:mb-4 uppercase tracking-[0.15em]">
                  {pillar.subtitle}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4 sm:mb-6">
                  {pillar.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Trust Checklist Footer */}
      <section className="py-16 md:py-24 px-6 md:px-10 lg:px-16 xl:px-20 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-brand-secondary mx-auto mb-4 md:mb-6" />
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">The LifeBack Guarantee</h2>
            <p className="text-muted-foreground text-base md:text-lg">System-level assurances enforced by code, not just policy.</p>
          </div>
          <MobileCarousel autoScrollInterval={3500} className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-8 lg:gap-x-12 sm:gap-y-6 md:gap-y-10 overflow-x-auto snap-x snap-mandatory pb-6 sm:pb-0 hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
            {[
              "Modular API Gateway",
              "Zero third-party analytics",
              "PostgreSQL Row-Level Security",
              "Hashed client IP logging",
              "Strict clinical PHQ-9 adherence",
              "No AI model internalization",
              "End-to-end data portability",
              "Instant account deletion",
              "Four-tier role-based auth"
            ].map((item, i) => (
              <div key={i} className="flex-none w-[85vw] sm:w-auto snap-center sm:snap-align-none flex items-center gap-4 p-5 md:p-6 rounded-2xl bg-background border border-border shadow-sm hover:border-brand-secondary/30 transition-colors h-full">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-brand-secondary shrink-0" />
                <span className="text-foreground text-[14px] md:text-base font-medium font-body leading-tight">{item}</span>
              </div>
            ))}
          </MobileCarousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6 md:mb-8 break-words">Ready to experience the platform?</h2>
        <Link href={userId ? "/assessments/new" : "/assessments/anonymous?source=WHY_LIFEBACK"}>
          <Button size="lg" className="h-auto py-4 md:py-0 md:h-14 px-6 md:px-8 rounded-none font-heading font-bold text-[14px] md:text-[15px] bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-xl whitespace-normal text-center max-w-full">
            {userId ? "Start PHQ-9 Assessment" : "Start Anonymous PHQ-9 Assessment"} <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 shrink-0" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
