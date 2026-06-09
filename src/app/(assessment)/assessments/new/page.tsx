"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { AssessmentHeader } from "@/modules/assessment/components/AssessmentHeader";

export default function NewAssessmentPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const exitUrl = userId ? "/dashboard" : "/";

  useEffect(() => {
    async function startAssessment() {
      try {
        const res = await fetch("/api/assessments/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateName: "PHQ9" }), // Defaulting to PHQ9 for now, future iterations will present a selection screen here
        });

        if (!res.ok) {
          throw new Error("Failed to start assessment");
        }

        const data = await res.json();
        router.replace(`/assessments/${data.id}`);
      } catch (err) {
        console.error("Error starting assessment:", err);
      }
    }

    startAssessment();
  }, [router]);

  return (
    <>
      <AssessmentHeader exitUrl={exitUrl} isCompleted={false} />
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500 mb-4" />
        <h2 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
          Preparing your assessment...
        </h2>
      </div>
    </>
  );
}
