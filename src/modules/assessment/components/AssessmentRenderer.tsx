"use client";

import { useState } from "react";
import { AssessmentTemplateConfig } from "@/types/assessment";
import { QuestionRenderer } from "./QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AssessmentResults } from "./AssessmentResults";

interface AssessmentRendererProps {
  assessmentId: string;
  templateConfig: AssessmentTemplateConfig;
  initialResponses?: Record<string, unknown>;
  mode?: "authenticated" | "anonymous";
  completionSource?: string;
}

export function AssessmentRenderer({
  assessmentId,
  templateConfig,
  initialResponses = {},
  mode = "authenticated",
  completionSource,
}: AssessmentRendererProps) {
  const router = useRouter();
  const questions = templateConfig.questions || [];
  
  const [startTime] = useState(() => Date.now());
  const [anonymousResult, setAnonymousResult] = useState<any>(null);
  
  const firstUnansweredIndex = questions.findIndex(q => !(q.id in initialResponses));
  const startIndex = firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [responses, setResponses] = useState<Record<string, unknown>>(initialResponses);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReviewScreen = currentIndex === questions.length;
  const progressPercentage = Math.round((Math.min(currentIndex, questions.length) / questions.length) * 100);

  const handleNext = async (overrideValue?: unknown) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    const valToSave = overrideValue !== undefined ? overrideValue : responses[currentQuestion.id];
    if (valToSave === undefined || valToSave === null) return;
    
    setIsSaving(true);
    setError(null);
    try {
      if (mode === "authenticated") {
        const res = await fetch(`/api/assessments/${assessmentId}/response`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: currentQuestion.id, answer: valToSave }),
        });
        if (!res.ok) throw new Error("Failed to save response");
      }
      
      setCurrentIndex(curr => curr + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (mode === "authenticated") {
        const completeRes = await fetch(`/api/assessments/${assessmentId}/complete`, { method: "POST" });
        if (!completeRes.ok) throw new Error("Failed to complete assessment");
        router.refresh();
      } else {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
        const completeRes = await fetch(`/api/assessments/anonymous/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses, completionSource, durationSeconds })
        });
        if (!completeRes.ok) throw new Error("Failed to complete assessment");
        const data = await completeRes.json();
        setAnonymousResult(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  if (anonymousResult) {
    return <AssessmentResults result={anonymousResult} isAnonymous={true} />;
  }

  if (isReviewScreen) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 px-4 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-500">
        <Card className="relative overflow-hidden border-zinc-200 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl dark:shadow-black/50 bg-white dark:bg-slate-900 rounded-3xl text-center p-0">
          <div className="flex flex-col bg-slate-50/80 dark:bg-slate-800/20 w-full h-full relative">
            <CardHeader className="pt-14 pb-8">
              <div className="mx-auto w-20 h-20 bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-zinc-900 dark:text-slate-200" />
              </div>
              <CardTitle className="text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-slate-50">Ready to Submit?</CardTitle>
              <CardDescription className="text-lg mt-3 text-zinc-500 dark:text-slate-400">
                You've successfully answered all {questions.length} questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-14 px-8 flex flex-col gap-5 max-w-md mx-auto w-full">
              <Button 
                size="lg" 
                onClick={handleSubmit} 
                disabled={isSaving} 
                className="w-full h-16 rounded-full text-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-xl hover:shadow-lg dark:shadow-none"
              >
                {isSaving ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Calculate My Results"}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleBack} 
                disabled={isSaving} 
                className="w-full h-14 rounded-full border-zinc-200 dark:border-slate-700 text-zinc-500 hover:text-zinc-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-zinc-100 dark:hover:bg-slate-800 transition-all font-medium"
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> Review or Edit Answers
              </Button>
              {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/30 dark:border-red-800 text-sm mt-2">
                  {error}
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return <div className="p-8 text-center">Invalid template configuration.</div>;
  }

  const currentValue = responses[currentQuestion.id];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 px-4 py-8 sm:py-12">
      {/* Segmented Progress Indicator */}
      <div className="flex flex-col gap-3 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{progressPercentage}%</span>
        </div>
        <div className="flex items-center gap-1.5 w-full">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i < currentIndex ? "bg-zinc-900 dark:bg-slate-100" :
                i === currentIndex ? "bg-zinc-600 dark:bg-slate-400 scale-y-110" :
                "bg-zinc-200 dark:bg-slate-800/60"
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Main Question Card - 2 Section Design on Desktop */}
      <div key={currentQuestion.id} className="animate-in slide-in-from-right-8 fade-in duration-500 max-w-6xl mx-auto w-full">
        <Card className="border-zinc-200 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl dark:shadow-black/50 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col min-h-[400px] p-0 gap-0">
          
          <div className="flex flex-col md:flex-row flex-1">
            {/* Left Side: Question Context */}
            <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/20 relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-zinc-900 dark:bg-slate-200 hidden md:block"></div>
              
              <CardHeader className="px-6 pt-12 pb-8 sm:px-10 flex-1 flex flex-col justify-center">
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug sm:leading-tight text-zinc-900 dark:text-slate-50">
                  {currentQuestion.text.split(/\\n|\n/).map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i !== arr.length - 1 && <br />}
                    </span>
                  ))}
                </CardTitle>
                {currentQuestion.required === false && (
                   <p className="text-sm font-medium text-zinc-500 dark:text-slate-400 mt-4 uppercase tracking-wider">Optional Question</p>
                )}
              </CardHeader>

              {/* Desktop Footer: Hidden on mobile, visible on md+ */}
              <CardFooter className="hidden md:flex items-center justify-between px-6 py-6 sm:px-10 border-t border-zinc-200 dark:border-slate-800/80 bg-transparent mt-auto">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={currentIndex === 0 || isSaving}
                  className="border-zinc-200 dark:border-slate-700 text-zinc-500 hover:text-zinc-900 dark:text-slate-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800 bg-transparent rounded-full font-medium h-12 px-6 transition-all"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                
                <Button 
                  onClick={() => handleNext()}
                  disabled={currentValue === undefined || currentValue === null || isSaving}
                  className="rounded-full px-8 h-12 font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next"}
                  {!isSaving && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </CardFooter>
            </div>

            {/* Right Side: Options Input */}
            <div className="w-full md:flex-1 flex flex-col relative bg-slate-50/80 dark:bg-slate-800/20">
              <CardContent className="px-6 py-8 sm:px-10 sm:py-12 flex-1 flex flex-col justify-center">
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/30 dark:border-red-800 text-sm flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-red-500 hidden" />
                    {error}
                  </div>
                )}
                
                <QuestionRenderer 
                  question={currentQuestion} 
                  currentValue={currentValue}
                  onChange={(val) => {
                    setResponses(prev => ({ ...prev, [currentQuestion.id]: val }));
                    handleNext(val); // Auto-advance for single-choice
                  }}
                />
              </CardContent>
            </div>
          </div>

          {/* Mobile Footer: Visible on mobile, hidden on md+ */}
          <CardFooter className="flex md:hidden items-center justify-between px-6 py-6 sm:px-10 border-t border-zinc-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/20 mt-auto">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentIndex === 0 || isSaving}
              className="border-zinc-200 dark:border-slate-700 text-zinc-500 hover:text-zinc-900 dark:text-slate-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800 bg-transparent rounded-full font-medium h-12 px-6 transition-all"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            
            <Button 
              onClick={() => handleNext()}
              disabled={currentValue === undefined || currentValue === null || isSaving}
              className="rounded-full px-8 h-12 font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next"}
              {!isSaving && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </CardFooter>

        </Card>
      </div>
    </div>
  );
}
