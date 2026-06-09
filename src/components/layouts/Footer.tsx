import Link from "next/link";
import { Activity } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const platformLinks = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];



const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const disclaimer =
  "This platform is designed to provide standardized self-assessment scoring based on the Patient Health Questionnaire (PHQ-9). It does not constitute a clinical diagnosis and is not a substitute for professional mental health evaluation. All observations are indicative only. Please review these reports with a qualified mental health professional before making any decisions about your care.";

export async function Footer() {
  const { userId } = await auth();

  const assessmentLinks = userId 
    ? [{ label: "Dashboard", href: "/dashboard" }, { label: "New Assessment", href: "/assessments/new" }]
    : [{ label: "PHQ-9 (Depression)", href: "/assessments/new" }];

  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="px-6 pb-10 pt-20 md:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr_0.8fr_1.2fr] lg:items-start">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href={userId ? "/dashboard" : "/"} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background">
              <span className="font-heading text-[22px] font-bold tracking-[0.08em] text-foreground">
                LifeBack
              </span>
            </Link>
            <p className="font-body text-[14px] text-foreground/70 leading-relaxed max-w-xs">
              A private, evidence-based mental health assessment platform designed for clarity and clinical security.
            </p>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Assessment" links={assessmentLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-20 border-t border-border pt-8">
          <p className="max-w-6xl font-body text-[14px] leading-7 text-foreground/80">
            {disclaimer}
          </p>

          <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-foreground/60">
            © 2026 LifeBack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="mb-7 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-foreground/60">
        {title}
      </h2>
      <ul className="grid gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-heading text-[15px] font-semibold text-foreground/80 transition-colors hover:text-foreground hover:underline hover:decoration-brand-secondary hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
