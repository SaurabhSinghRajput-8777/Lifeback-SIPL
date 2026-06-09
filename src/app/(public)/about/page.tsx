import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, BrainCircuit, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About LifeBack | Sequoia Insilico Pvt. Ltd.",
  description: "LifeBack is a clinical assessment orchestration platform built by Sequoia Insilico Pvt. Ltd., specialising in the objective detection of psychiatric conditions.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-background relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-60 -left-40 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-600 dark:text-white/60 mb-8 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sequoia Insilico Pvt. Ltd. (SIPL)
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-foreground mb-8 max-w-4xl mx-auto">
          We build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-serif italic">infrastructure</span> for objective mental health.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          LifeBack is a clinical assessment orchestration platform built by SIPL, a BIRAC-backed deep-tech AI company specialising in the objective detection of psychiatric conditions.
        </p>
      </section>

      {/* Core Principles Section */}
      <section className="py-24 px-6 md:px-10 lg:px-16 xl:px-20 border-t border-border bg-muted/30">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Principle 1 */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-4">AI Assists — Never Replaces</h3>
              <p className="text-muted-foreground leading-relaxed">
                Clinical judgment is never delegated to a model. Every AI output is framed strictly as a behavioral observation, serving as a powerful tool for clinicians, not a replacement for their expertise or a definitive diagnosis.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-4">Privacy is Structural</h3>
              <p className="text-muted-foreground leading-relaxed">
                Data architectures enforce zero-retention by design. Voice recordings and sensitive assessment parameters are never permanently stored. We adhere strictly to GDPR Article 9 and HIPAA compliance standards.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-4">Science is Public</h3>
              <p className="text-muted-foreground leading-relaxed">
                All detection capabilities are grounded in peer-reviewed, externally validated research. Our upcoming NeurIPS 2026 publication underpins our claims and models, ensuring total transparency in our scientific approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Context */}
      <section className="py-24 px-6 md:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              A Standalone SaaS Platform
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Version 2.0 represents a fundamental architectural re-positioning. LifeBack is now operating as the primary interface for AI-assisted multi-modal depression screening.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              While SIPL's corporate presence handles institutional credibility, research publication, and investor relations, LifeBack is dedicated entirely to orchestrating fast, secure, and private clinical assessments.
            </p>
            <div className="pt-4">
              <Link href="/research">
                <Button variant="outline" className="gap-2 h-12 px-6 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer">
                  View Our Research <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="aspect-square md:aspect-[4/3] rounded-3xl border border-border bg-muted/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-overlay group-hover:opacity-75 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-foreground/80 leading-relaxed font-light">
                  "Advancing psychiatric care through acoustic biomarkers and behavioral orchestration."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 md:px-10 lg:px-16 xl:px-20 border-t border-border text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
          Experience the Platform
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Try the clinical-grade PHQ-9 assessment engine. Zero friction, completely anonymous, no account required to start.
        </p>
        <Link href="/assessments/new">
          <Button className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 cursor-pointer">
            Take Free Assessment
          </Button>
        </Link>
      </section>
    </div>
  );
}
