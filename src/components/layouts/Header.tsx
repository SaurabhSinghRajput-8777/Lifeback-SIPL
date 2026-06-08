"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-600 dark:bg-zinc-500 flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform cursor-pointer">
            L
          </div>
          <span className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-white cursor-pointer">
            LifeBack
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            How it Works
          </Link>
          <Link
            href="#why-lifeback"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Why LifeBack
          </Link>
          <Link
            href="/assessments/new"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Try Assessment
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isLoaded ? null : !userId ? (
            <SignInButton mode="modal">
              <Button
                variant="default"
                size="sm"
                className="hidden sm:inline-flex bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-500 dark:hover:bg-zinc-600 text-white cursor-pointer"
              >
                Sign In
              </Button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
