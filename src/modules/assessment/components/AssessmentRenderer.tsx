"use client";

import { useState } from "react";
import { AssessmentTemplateConfig } from "@/types/assessment";
import { QuestionRenderer } from "./QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssessmentRendererProps {
  assessmentId: string;
  templateConfig: AssessmentTemplateConfig;
  initialResponses?: Record<string, unknown>;
}

export function AssessmentRenderer({
  assessmentId,
  templateConfig,
  initialResponses = {},
}: AssessmentRendererProps) {
  const router = useRouter();
  const questions = templateConfig.questions || [];
  
  // Find the first unanswered question
  const firstUnansweredIndex = questions.findIndex(q => !(q.id in initialResponses));
  const startIndex = firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [responses, setResponses] = useState<Record<string, unknown>>(initialResponses);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const currentValue = responses[currentQuestion?.id];
  const progressPercentage = Math.round((currentIndex / questions.length) * 100);

  const handleNext = async (overrideValue?: unknown) => {
    const valToSave = overrideValue !== undefined ? overrideValue : currentValue;
    if (valToSave === undefined || valToSave === null) return;
    
    setIsSaving(true);
    setError(null);
    try {
      // API call to save response
      const res = await fetch(`/api/assessments/${assessmentId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: valToSave,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save response");
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(curr => curr + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Complete the assessment
        const completeRes = await fetch(`/api/assessments/${assessmentId}/complete`, {
          method: "POST",
        });
        
        if (!completeRes.ok) {
          const data = await completeRes.json();
          throw new Error(data.error || "Failed to complete assessment");
        }
        
        // Let the router refresh the page to show results
        router.refresh();
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

  if (!currentQuestion) {
    return <div className="p-8 text-center">Invalid template configuration.</div>;
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 px-4 py-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPercentage}% Completed</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            {currentQuestion.text}
          </CardTitle>
          {currentQuestion.required === false && (
             <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Optional</p>
          )}
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-900 border border-red-200 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <QuestionRenderer 
            key={currentQuestion.id}
            question={currentQuestion} 
            currentValue={currentValue}
            onChange={(val) => {
              setResponses(prev => ({ ...prev, [currentQuestion.id]: val }));
              if (!isLastQuestion) {
                handleNext(val);
              }
            }}
          />
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-6 border-t dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-b-xl">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentIndex === 0 || isSaving}
            className="text-zinc-600 dark:text-zinc-400"
          >
            Back
          </Button>
          <Button 
            onClick={() => handleNext()}
            disabled={currentValue === undefined || currentValue === null || isSaving}
            className="px-8"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLastQuestion ? "Complete" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
