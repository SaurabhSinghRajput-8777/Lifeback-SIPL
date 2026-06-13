import { auth } from "@clerk/nextjs/server";

const disclaimer = "This platform is designed to provide standardized self-assessment scoring based on the Patient Health Questionnaire (PHQ-9). It does not constitute a clinical diagnosis and is not a substitute for professional mental health evaluation. All observations are indicative only.";

export default async function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative z-0">
      {/* Premium Two-Tone Background */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-indigo-50/80 via-indigo-50/20 to-transparent dark:hidden -z-10" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        {children}
      </main>

      <footer className="w-full border-t border-border dark:border-white/5 bg-background dark:bg-[#0B0F19] py-8 px-4 sm:px-8 mt-auto shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Top Section: Links & Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Support Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Need Support?</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                If you are experiencing emotional distress, thoughts of self-harm, suicidal ideation, or believe you may be in immediate danger, contact local emergency services or a qualified crisis support provider immediately.
              </p>
              <div className="flex flex-col gap-2">
                <a href="/help" className="text-sm text-primary hover:underline w-fit font-medium">
                  Mental Health Support Resources
                </a>
                <a href="/crisis-support" className="text-sm text-destructive hover:underline w-fit font-medium">
                  Emergency Services
                </a>
              </div>
            </div>

            {/* Quick Actions for Assessment */}
            <div className="space-y-4 md:justify-self-end">
              <h3 className="text-sm font-semibold text-foreground">Assessment Options</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Return to Home</a></li>
                <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Data Privacy Information</a></li>
                <li><a href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Technical Support</a></li>
              </ul>
            </div>
          </div>

          {/* Middle Section: Disclaimer */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Clinical Disclaimer:</strong> LifeBack is a behavioral screening and assessment support platform. Results, observations, scores, risk indicators, and generated reports are intended solely for informational and educational purposes. They do not constitute a medical diagnosis, psychiatric evaluation, treatment recommendation, or substitute for professional clinical judgment. Always consult a qualified healthcare professional regarding mental health concerns or treatment decisions.
            </p>
          </div>

          {/* Bottom Section: Legal & Copyright */}
          <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} LifeBack by Sequoia Insilico Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms of Use</a>
              <a href="/consent" className="hover:text-foreground transition-colors">Consent Information</a>
              <a href="/support" className="hover:text-foreground transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
