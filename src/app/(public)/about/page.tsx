import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BrainCircuit, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileCarousel } from "@/components/ui/mobile-carousel";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "About LifeBack | Sequoia Insilico Pvt. Ltd.",
  description: "LifeBack is a clinical assessment orchestration platform built by Sequoia Insilico Pvt. Ltd., specialising in the objective detection of psychiatric conditions.",
};

export default async function AboutPage() {
  const { userId } = await auth();

  return (
    <div className="flex-1 w-full bg-background relative overflow-hidden">
      {/* Light/Dark Dynamic Background with Cubes & Indigo Gradient */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08] dark:opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-violet/10 dark:bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto text-center border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] sm:text-xs font-mono text-zinc-600 dark:text-white/60 mb-6 sm:mb-8 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse" />
          Sequoia Insilico Pvt. Ltd. (SIPL)
        </div>
        
        <h1 className="text-[36px] sm:text-5xl md:text-6xl lg:text-[72px] font-heading font-bold tracking-tight text-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-[1.15] sm:leading-[1.1]">
          We build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-brand-violet font-serif italic break-words">infrastructure</span> for objective mental health.
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          LifeBack is a clinical assessment orchestration platform built by SIPL, a BIRAC-backed deep-tech AI company specialising in the objective detection of psychiatric conditions.
        </p>
      </section>

      {/* Core Principles Section */}
      <section className="py-16 md:py-24 px-6 md:px-10 lg:px-16 xl:px-20 border-b border-border bg-muted/20">
        <div className="max-w-[1440px] mx-auto">
          <MobileCarousel autoScrollInterval={4000} className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
            {/* Principle 1 */}
            <div className="flex-none w-[85vw] md:w-auto snap-center md:snap-align-none p-6 md:p-8 rounded-2xl bg-background border border-border shadow-sm h-full hover:border-indigo-500/30 transition-colors text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 md:mb-6">
                <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3 md:mb-4">AI Assists — Never Replaces</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Clinical judgment is never delegated to a model. Every AI output is framed strictly as a behavioral observation, serving as a powerful tool for clinicians, not a replacement for their expertise or a definitive diagnosis.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="flex-none w-[85vw] md:w-auto snap-center md:snap-align-none p-6 md:p-8 rounded-2xl bg-background border border-border shadow-sm h-full hover:border-emerald-500/30 transition-colors text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 md:mb-6">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3 md:mb-4">Privacy is Structural</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Data architectures enforce zero-retention by design. Voice recordings and sensitive assessment parameters are never permanently stored. We adhere strictly to GDPR Article 9 and HIPAA compliance standards.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="flex-none w-[85vw] md:w-auto snap-center md:snap-align-none p-6 md:p-8 rounded-2xl bg-background border border-border shadow-sm h-full hover:border-brand-violet/30 transition-colors text-left">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-violet/10 flex items-center justify-center mb-5 md:mb-6">
                <LineChart className="w-5 h-5 md:w-6 md:h-6 text-brand-violet" />
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3 md:mb-4">Science is Public</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                All detection capabilities are grounded in peer-reviewed, externally validated research. Our upcoming NeurIPS 2026 publication underpins our claims and models, ensuring total transparency in our scientific approach.
              </p>
            </div>
          </MobileCarousel>
        </div>
      </section>

      {/* Corporate Context */}
      <section className="py-16 md:py-24 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-5 md:space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              A Standalone SaaS Platform
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Version 2.0 represents a fundamental architectural re-positioning. LifeBack is now operating as the primary interface for AI-assisted multi-modal depression screening.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              While SIPL's corporate presence handles institutional credibility, research publication, and investor relations, LifeBack is dedicated entirely to orchestrating fast, secure, and private clinical assessments.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link href="/research">
                <Button variant="outline" className="gap-2 h-12 px-6 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer rounded-full font-heading font-bold">
                  View Our Research <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="aspect-square md:aspect-[4/3] rounded-3xl border border-border bg-muted/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-brand-violet/20 mix-blend-overlay group-hover:opacity-75 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 text-center">
                <p className="font-serif italic text-xl md:text-3xl lg:text-4xl text-foreground/80 leading-relaxed font-light">
                  "Advancing psychiatric care through acoustic biomarkers and behavioral orchestration."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-t border-border bg-muted/10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6 md:mb-8 break-words">
          Experience the Platform
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
          Try the clinical-grade PHQ-9 assessment engine. Zero friction, completely anonymous, no account required to start.
        </p>
        <Link href={userId ? "/dashboard" : "/assessments/anonymous?source=ABOUT"}>
          <Button size="lg" className="h-auto py-4 md:py-0 md:h-14 px-6 md:px-8 rounded-none font-heading font-bold text-[14px] md:text-[15px] bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-xl whitespace-normal text-center max-w-full">
            {userId ? "Go To Dashboard" : "Take Free Assessment"} <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 shrink-0" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
