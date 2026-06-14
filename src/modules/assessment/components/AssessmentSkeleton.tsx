import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AssessmentHeader } from "./AssessmentHeader";

export function AssessmentSkeleton() {
  return (
    <>
      <AssessmentHeader exitUrl="/dashboard" isCompleted={false} />
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 px-4 py-8 sm:py-12 animate-pulse">
        {/* Segmented Progress Indicator Skeleton */}
        <div className="flex flex-col gap-3 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-8 bg-zinc-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="flex items-center gap-1.5 w-full">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i === 0 ? "bg-zinc-400 dark:bg-slate-600" : "bg-zinc-200 dark:bg-slate-800/60"}`} 
              />
            ))}
          </div>
        </div>

        {/* Main Question Card Skeleton */}
        <div className="max-w-6xl mx-auto w-full">
          <Card className="border-zinc-200 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl dark:shadow-black/50 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col min-h-[400px] p-0 gap-0">
            <div className="flex flex-col md:flex-row flex-1">
              
              {/* Left Side: Question Context Skeleton */}
              <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/20 relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-zinc-200 dark:bg-slate-800 hidden md:block"></div>
                
                <CardHeader className="px-6 pt-12 pb-8 sm:px-10 flex-1 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="h-10 bg-zinc-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
                    <div className="h-10 bg-zinc-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
                  </div>
                  <div className="h-4 bg-zinc-200 dark:bg-slate-800 rounded w-32 mt-6"></div>
                </CardHeader>

                <CardFooter className="hidden md:flex items-center justify-between px-6 py-6 sm:px-10 border-t border-zinc-200 dark:border-slate-800/80 bg-transparent mt-auto">
                  <div className="h-12 w-28 bg-zinc-200 dark:bg-slate-800 rounded-full"></div>
                  <div className="h-12 w-32 bg-zinc-300 dark:bg-slate-700 rounded-full"></div>
                </CardFooter>
              </div>

              {/* Right Side: Options Input Skeleton */}
              <div className="w-full md:flex-1 flex flex-col relative bg-slate-50/80 dark:bg-slate-800/20">
                <CardContent className="px-6 py-8 sm:px-10 sm:py-12 flex-1 flex flex-col justify-center space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-zinc-200 dark:bg-slate-800 rounded-xl"></div>
                  ))}
                </CardContent>
              </div>
            </div>

            {/* Mobile Footer Skeleton */}
            <CardFooter className="flex md:hidden items-center justify-between px-6 py-6 sm:px-10 border-t border-zinc-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/20 mt-auto">
              <div className="h-12 w-28 bg-zinc-200 dark:bg-slate-800 rounded-full"></div>
              <div className="h-12 w-32 bg-zinc-300 dark:bg-slate-700 rounded-full"></div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
