import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Lock,
  UserCheck,
  Stethoscope,
  Microscope,
  LineChart,
  Activity,
  FileText
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-1 flex flex-col">

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[90dvh] pt-32 pb-16 px-6 md:px-10 lg:px-16 xl:px-20 flex flex-col justify-center border-b border-border">
          <div className="max-w-[1440px] w-full mx-auto relative z-10">
            <div className="max-w-4xl">
              <div className="mb-8 inline-flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.14em] text-foreground/60">
                <div className="w-2 h-2 rounded-full bg-brand-secondary mr-3" />
                Clinical-Grade PHQ-9 Assessment Engine
              </div>

              <h1 className="font-heading text-[56px] leading-[1.05] md:text-[80px] lg:text-[96px] tracking-tight text-foreground mb-10">
                Understand your mental health with absolute precision.
              </h1>

              <p className="font-body text-[18px] md:text-[22px] text-foreground/70 mb-12 max-w-2xl leading-relaxed">
                A private, stark, evidence-based platform for screening depression. Zero friction. No accounts required to start.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/assessments/new">
                  <Button size="lg" className="cursor-pointer w-full sm:w-auto h-14 px-8 rounded-none font-heading font-bold text-[15px] bg-foreground text-background hover:bg-foreground/90 transition-colors">
                    Take Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="cursor-pointer w-full sm:w-auto h-14 px-8 rounded-none font-heading font-bold text-[15px] border-border bg-transparent text-foreground hover:bg-foreground/5 transition-colors">
                    Create Account
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>

          {/* Stark Line Art Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
            <div className="absolute top-0 right-[20%] w-[1px] h-full bg-foreground" />
            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-foreground" />
          </div>
        </section>

        {/* 2. TRUST BAR */}
        <section className="border-b border-border bg-background py-16 px-6 md:px-10 lg:px-16 xl:px-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
              {[
                { icon: UserCheck, label: "Anonymous Access", desc: "Start instantly. Privacy guaranteed." },
                { icon: Stethoscope, label: "Evidence-Based", desc: "Powered by the clinical PHQ-9 standard." },
                { icon: Lock, label: "Secure Processing", desc: "Data never leaves encrypted constraints." },
                { icon: Clock, label: "Instant Clarity", desc: "Actionable results in under 3 minutes." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col border-l border-border pl-6 group">
                  <item.icon className="h-6 w-6 text-foreground mb-6" strokeWidth={1.5} />
                  <span className="text-[15px] font-heading font-bold text-foreground mb-2">{item.label}</span>
                  <p className="text-[13px] font-body text-foreground/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. FLAGSHIP SHOWCASE (ASSESSMENT PREVIEW) */}
        <section className="bg-[#121214] text-white py-32 px-6 md:px-10 lg:px-16 xl:px-20 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto relative z-10 grid lg:grid-cols-[1fr_1.5fr] gap-20 items-center">

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-brand-secondary">
                Data Output
              </div>
              <h2 className="text-[44px] md:text-[56px] font-heading font-bold mb-8 leading-tight tracking-tight">
                Clear, actionable scoring framework.
              </h2>
              <p className="text-[18px] font-body text-white/60 leading-relaxed mb-10">
                LifeBack translates your PHQ-9 responses into a definitive severity matrix. You retain complete control over this data—export it, save it, or delete it instantly.
              </p>

              <ul className="space-y-6 border-t border-white/10 pt-8">
                {[
                  "Total cumulative severity score (0-27)",
                  "Stratified severity categorization",
                  "Clinical recommendations baseline"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-[15px] font-heading text-white/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {/* Product UI Mockup */}
              <div className="bg-[#1C1C1F] border border-white/10 rounded-[4px] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="h-12 border-b border-white/10 bg-[#121214] flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="p-8 md:p-12">
                  <div className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-[0.14em] mb-4">Final Report</div>
                  <div className="flex items-end gap-6 mb-12 pb-12 border-b border-white/10">
                    <div className="text-[88px] font-heading font-bold leading-none tracking-tighter text-white">
                      12
                    </div>
                    <div className="text-[24px] font-mono text-white/40 pb-3">/ 27</div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-3 w-3 bg-brand-secondary shadow-[0_0_12px_rgba(132,157,142,0.8)]" />
                    <h4 className="text-[24px] font-heading font-bold text-white">Moderate Severity</h4>
                  </div>
                  <p className="text-white/60 font-body leading-relaxed text-[16px] max-w-lg">
                    Scores in this range indicate moderate depressive symptoms. Monitoring, lifestyle adjustments, or consulting a healthcare professional is recommended for a formal evaluation.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-[#F9F9F8] border-b border-border">
          <div className="max-w-[1440px] mx-auto">
            <div className="max-w-3xl mb-20">
              <h2 className="text-[40px] md:text-[48px] leading-tight font-heading font-bold text-foreground mb-6">Standardized Process</h2>
              <p className="text-[18px] font-body text-foreground/70 leading-relaxed">A rigid, five-step clinical flow engineered to provide clarity in under three minutes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 border-t border-l border-border">
              {[
                { step: "01", title: "Initialize", desc: "No account required." },
                { step: "02", title: "Input", desc: "9 clinical questions." },
                { step: "03", title: "Process", desc: "Secure scoring engine." },
                { step: "04", title: "Output", desc: "Severity stratification." },
                { step: "05", title: "Retain", desc: "Optional data storage." }
              ].map((item, idx) => (
                <div key={idx} className="border-r border-b border-border p-8 hover:bg-white transition-colors">
                  <div className="text-[12px] font-mono font-bold text-brand-secondary mb-8">{item.step}</div>
                  <h3 className="text-[18px] font-heading font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-[14px] font-body text-foreground/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. WHY LIFEBACK */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-background border-b border-border">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-20">
              <div>
                <h2 className="text-[40px] md:text-[48px] font-heading font-bold text-foreground mb-6 leading-tight">Architecture of Trust</h2>
                <p className="text-[18px] font-body text-foreground/70 leading-relaxed">Built for precision, privacy, and clinical relevance.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
                {[
                  { title: "Research Standard", desc: "Strict adherence to the Patient Health Questionnaire (PHQ-9) diagnostic criteria." },
                  { title: "Zero Telemetry", desc: "Your data remains in your session. We do not track keystrokes or analytics during assessments." },
                  { title: "Human Oversight", desc: "Designed as an assistive triage instrument, never as a replacement for professional diagnosis." },
                  { title: "Data Portability", desc: "Export your results instantly. If you create an account, you retain absolute deletion rights." }
                ].map((feature, idx) => (
                  <div key={idx}>
                    <h3 className="text-[18px] font-heading font-bold text-foreground mb-3 pb-3 border-b border-border">{feature.title}</h3>
                    <p className="text-[15px] font-body text-foreground/60 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-background">
          <div className="max-w-[1440px] mx-auto text-center">
            <h2 className="text-[48px] md:text-[64px] font-heading font-bold text-foreground mb-8 tracking-tight">Begin Evaluation</h2>
            <Link href="/assessments/new">
              <Button size="lg" className="cursor-pointer h-16 px-12 rounded-none text-[16px] font-heading font-bold bg-foreground text-background hover:bg-foreground/90 transition-colors">
                Start PHQ-9 Assessment
              </Button>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
