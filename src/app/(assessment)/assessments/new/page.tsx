"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AssessmentSkeleton } from "@/modules/assessment/components/AssessmentSkeleton";

export default function NewAssessmentPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function startAssessment() {
      try {
        const res = await fetch("/api/assessments/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateName: "PHQ9" }), // Future iterations will present a selection screen
        });

        if (!res.ok) {
          throw new Error("Failed to start assessment");
        }

        const data = await res.json();
        
        if (mounted) {
          router.replace(`/assessments/${data.id}`);
        }
      } catch (err) {
        console.error("Error starting assessment:", err);
        // Optionally redirect back to dashboard on error
        if (mounted) {
          router.replace("/dashboard/assessments");
        }
      }
    }

    startAssessment();

    return () => {
      mounted = false;
    };
  }, [router]);

  return <AssessmentSkeleton />;
}
