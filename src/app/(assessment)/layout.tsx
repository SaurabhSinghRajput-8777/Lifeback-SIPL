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

      {/* Minimal Footer Disclaimer */}
      <footer className="w-full border-t border-border bg-zinc-50 dark:bg-zinc-900/50 py-6">
        <div className="w-full max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
