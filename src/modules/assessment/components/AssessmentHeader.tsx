import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AssessmentHeaderProps {
  isCompleted?: boolean;
  exitUrl: string;
}

export function AssessmentHeader({ isCompleted = false, exitUrl }: AssessmentHeaderProps) {
  return (
    <header className="w-full bg-zinc-50 dark:bg-zinc-900/50 border-b border-border z-20 sticky top-0 backdrop-blur-sm">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group overflow-hidden">
          <Image src="/lifeback_logo.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform dark:hidden" />
          <Image src="/lifeback_logo_white.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform hidden dark:block" />
          <span className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">
            LifeBack
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Link href={exitUrl}>
            <Button 
              variant={isCompleted ? "default" : "outline"} 
              className={`cursor-pointer font-medium px-4 py-2 h-auto transition-colors ${
                !isCompleted 
                  ? "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border-zinc-200 dark:border-zinc-800" 
                  : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              }`}
            >
              {isCompleted ? "Return Home" : "Exit Test"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
