"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="flex h-20 w-full items-center justify-between px-6 md:px-10 lg:px-16 xl:px-20">
        
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background">
            <span className="font-heading text-[22px] font-bold tracking-[0.08em] text-foreground">
              LifeBack
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-9">
          {["About", "How It Works", "Privacy"].map((label) => {
            const href = `/${label.toLowerCase().replace(/ /g, "-")}`;
            return (
              <Link 
                key={href}
                href={href} 
                className="py-2 font-heading text-[14px] font-semibold text-foreground/80 transition-colors hover:text-foreground hover:underline hover:decoration-brand-secondary hover:decoration-2 hover:underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-4">
          <SignInButton mode="modal">
            <Button variant="ghost" className="cursor-pointer font-heading font-semibold text-[14px] text-foreground hover:bg-foreground/5 h-10 px-6 rounded-none">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    </header>
  );
}
