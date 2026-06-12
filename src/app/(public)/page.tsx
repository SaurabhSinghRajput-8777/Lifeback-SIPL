import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateAccountButton } from "@/components/auth/CreateAccountButton";
import { auth } from "@clerk/nextjs/server";
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

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-1 flex flex-col">

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[90dvh] pt-24 pb-16 px-6 md:px-10 lg:px-16 xl:px-20 flex flex-col justify-center border-b border-border overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.50] dark:opacity-[0.25]"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
              type="video/mp4"
            />
          </video>

          <div className="max-w-[1440px] w-full mx-auto relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="w-full max-w-[880px] shrink-0">
              <div className="mb-8 inline-flex items-center text-[12px] font-mono font-bold uppercase tracking-[0.14em] text-foreground/60">
                <div className="w-2 h-2 rounded-full bg-brand-secondary mr-3" />
                Clinical-Grade PHQ-9 Assessment Engine
              </div>

              <h1 className="font-heading text-[56px] leading-[1.05] md:text-[80px] lg:text-[96px] tracking-tight text-foreground mb-10">
                Understand your <span style={{ fontFamily: "var(--font-dancing), cursive" }} className="font-normal text-[1.2em] opacity-90 pr-2">mental health</span> with absolute precision.
              </h1>

              <p className="font-body text-[18px] md:text-[22px] text-foreground/70 mb-12 max-w-2xl leading-relaxed">
                A private, stark, evidence-based platform for screening depression. Zero friction. No accounts required to start.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={userId ? "/dashboard" : "/assessments/new"}>
                  <Button size="lg" className="cursor-pointer w-full sm:w-auto h-14 px-8 rounded-none font-heading font-bold text-[15px] bg-foreground text-background hover:bg-foreground/90 transition-colors">
                    {userId ? "Go  To  Dashboard" : "Take Free Assessment"} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {!userId && (
                  <CreateAccountButton />
                )}
              </div>
            </div>

            {/* PHQ-9 Demo Box */}
            <div className="hidden lg:flex flex-1 justify-center w-full">
              <div className="w-full max-w-[320px] -translate-y-12">
                <div className="bg-background/80 backdrop-blur-md border border-border shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[4px] p-6 transform hover:rotate-2 hover:scale-[1.02] transition-all duration-500 cursor-default">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-[0.14em]">Question 1 of 9</span>
                    <div className="h-1 w-12 bg-border rounded-full overflow-hidden">
                      <div className="h-full w-[11%] bg-brand-secondary" />
                    </div>
                  </div>
                  <h3 className="text-[17px] font-heading font-bold text-foreground mb-6 leading-tight">
                    Little interest or pleasure in doing things?
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Not at all', active: false },
                      { label: 'Several days', active: true },
                      { label: 'More than half the days', active: false },
                      { label: 'Nearly every day', active: false }
                    ].map((option, i) => (
                      <div
                        key={i}
                        className={`p-3 border rounded-[4px] text-[13px] font-heading font-bold transition-all cursor-default flex items-center justify-between ${option.active
                          ? 'border-brand-secondary bg-brand-secondary/5 text-foreground'
                          : 'border-border text-foreground/60'
                          }`}
                      >
                        {option.label}
                        {option.active && <div className="h-1.5 w-1.5 bg-brand-secondary rounded-full shadow-[0_0_8px_rgba(132,157,142,0.8)]" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stark Line Art Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.00]">
            <div className="absolute top-0 right-[20%] w-[1px] h-full bg-foreground" />
            <div className="absolute top-[30%] left-0 w-full h-[1px] bg-foreground" />
          </div>
        </section>

        {/* 2. TRUST BAR */}
        <section className="border-b border-border dark:border-white/5 bg-background dark:bg-[#0B0F19] py-16 px-6 md:px-10 lg:px-16 xl:px-20">
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
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-[#F9F9F8] dark:bg-[#0B0F19] border-b border-border dark:border-white/5 overflow-hidden">
          <div className="max-w-[1440px] mx-auto">
            <div className="max-w-3xl mb-20">
              <h2 className="text-[40px] md:text-[48px] leading-tight font-heading font-bold text-foreground mb-6">
                Standardized Process
              </h2>
              <p className="text-[18px] font-body text-foreground/70 leading-relaxed">A rigid, five-step clinical flow engineered to provide clarity in under three minutes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 border-t border-l border-foreground/15">
              {[
                { step: "01", title: "Initialize", desc: "No account required." },
                { step: "02", title: "Input", desc: "9 clinical questions." },
                { step: "03", title: "Process", desc: "Secure scoring engine." },
                { step: "04", title: "Output", desc: "Severity stratification." },
                { step: "05", title: "Retain", desc: "Optional data storage." }
              ].map((item, idx) => (
                <div key={idx} className="group relative border-r border-b border-foreground/15 p-8 bg-transparent hover:bg-white dark:hover:bg-zinc-900/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:z-10 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />

                  <div className="absolute -bottom-6 -right-2 text-[100px] font-heading font-bold text-foreground/[0.03] group-hover:text-foreground/[0.06] transition-colors duration-500 pointer-events-none select-none">
                    {item.step}
                  </div>

                  <div className="relative z-10">
                    <div className="text-[12px] font-mono font-bold text-brand-secondary mb-8 flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-brand-secondary group-hover:w-6 transition-all duration-300" />
                      STEP {item.step}
                    </div>
                    <h3 className="text-[18px] font-heading font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-[14px] font-body text-foreground/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. WHY LIFEBACK */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 bg-[#121214] border-b border-white/5">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-20">
              <div>
                <h2 className="text-[40px] md:text-[48px] font-heading font-bold text-white mb-6 leading-tight">Architecture of Trust</h2>
                <p className="text-[18px] font-body text-white/70 leading-relaxed">Built for precision, privacy, and clinical relevance.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
                {[
                  { icon: FileText, title: "Research Standard", desc: "Strict adherence to the Patient Health Questionnaire (PHQ-9) diagnostic criteria." },
                  { icon: Lock, title: "Zero Telemetry", desc: "Your data remains in your session. We do not track keystrokes or analytics during assessments." },
                  { icon: Stethoscope, title: "Human Oversight", desc: "Designed as an assistive triage instrument, never as a replacement for professional diagnosis." },
                  { icon: Activity, title: "Data Portability", desc: "Export your results instantly. If you create an account, you retain absolute deletion rights." }
                ].map((feature, idx) => (
                  <div key={idx} className="group relative">
                    <div className="h-12 w-12 rounded-[4px] bg-white/5 flex items-center justify-center mb-6 group-hover:bg-orange-500/15 transition-colors duration-500">
                      <feature.icon className="h-5 w-5 text-white/50 group-hover:text-orange-400 transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[18px] font-heading font-bold text-white mb-3 pb-4 border-b border-white/10 relative">
                      {feature.title}
                      {/* Animated bottom border */}
                      <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-gradient-to-r from-orange-400 to-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
                    </h3>
                    <p className="text-[15px] font-body text-white/60 leading-relaxed group-hover:text-white/90 transition-colors duration-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="relative py-32 md:py-48 px-6 md:px-10 lg:px-16 xl:px-20 bg-background overflow-hidden flex flex-col items-center justify-center">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.40] dark:opacity-[0.20]"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_145119_f4ec4d9f-3ecd-4116-baa3-26e8cf2df976.mp4"
              type="video/mp4"
            />
          </video>

          <div className="relative z-10 max-w-[1440px] mx-auto text-center">
            <h2 className="text-[48px] md:text-[64px] font-heading font-bold text-foreground mb-8 tracking-tight">Begin Evaluation</h2>
            <Link href="/assessments/new">
              <Button size="lg" className="cursor-pointer h-16 px-12 rounded-none text-[16px] font-heading font-bold bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-2xl">
                Start PHQ-9 Assessment
              </Button>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
