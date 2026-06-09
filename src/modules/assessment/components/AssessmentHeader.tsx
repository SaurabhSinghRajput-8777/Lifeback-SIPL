import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface AssessmentHeaderProps {
  isCompleted?: boolean;
  exitUrl: string;
}

export function AssessmentHeader({ isCompleted = false, exitUrl }: AssessmentHeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-zinc-950 border-b border-border z-10 sticky top-0">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-600 dark:bg-zinc-500 flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <span className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-white">
            LifeBack
          </span>
        </div>

        <Link href={exitUrl}>
          <Button 
            variant={isCompleted ? "default" : "outline"} 
            className={`cursor-pointer font-medium px-4 py-2 h-auto transition-colors ${
              !isCompleted 
                ? "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-zinc-200 dark:border-zinc-800" 
                : ""
            }`}
          >
            {isCompleted ? (
              <>
                <Home className="w-4 h-4 mr-2" />
                Home
              </>
            ) : (
              "Exit Test"
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
