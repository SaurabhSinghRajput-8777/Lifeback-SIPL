"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";
import { AUTH_ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
        <Link href={userId ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <Image src="/lifeback_logo.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform cursor-pointer" />
          <span className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-white cursor-pointer">
            LifeBack
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {!isLoaded ? null : userId ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                About
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                How it Works
              </Link>
              <Link
                href="/#why-lifeback"
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
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoaded ? null : !userId ? (
            <Link href={AUTH_ROUTES.SIGN_IN}>
              <Button
                variant="default"
                size="sm"
                className="hidden sm:inline-flex bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-500 dark:hover:bg-zinc-600 text-white cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
