"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useAuth, useClerk } from "@clerk/nextjs";
import { CreateAccountButton } from "@/components/auth/CreateAccountButton";
import { AUTH_ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoaded, userId } = useAuth();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const targetPath = userId ? "/dashboard" : "/";
    if (pathname === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const getLinkClass = (path: string) => cn(
    "px-5 h-10 flex items-center justify-center text-[14px] rounded-full transition-all duration-300 cursor-pointer",
    pathname === path
      ? "text-foreground bg-zinc-200/80 dark:bg-white/20 font-semibold shadow-sm"
      : "text-foreground/70 font-medium hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5"
  );

  const getMobileLinkClass = (path: string) => cn(
    "px-5 h-14 flex items-center text-lg rounded-full transition-all duration-300",
    pathname === path
      ? "text-foreground bg-zinc-200/80 dark:bg-white/20 font-semibold shadow-sm"
      : "text-foreground/80 font-medium hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5"
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled || isMobileMenuOpen
          ? "backdrop-blur-xl bg-background/80 dark:bg-[#0B0F19]/80 border-border/50 dark:border-white/10 shadow-sm dark:shadow-none"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 xl:px-20 h-16 sm:h-20 flex items-center justify-between">
        <Link href={userId ? "/dashboard" : "/"} onClick={handleLogoClick} className="flex items-center gap-2 group">
          <Image src="/lifeback_logo.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform duration-300 cursor-pointer dark:hidden" />
          <Image src="/lifeback_logo_white.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform duration-300 cursor-pointer hidden dark:block" />
          <span className="font-heading font-bold text-xl tracking-tight text-foreground cursor-pointer">
            LifeBack
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {!isLoaded ? null : (
            <>
              {userId ? (
                <Link
                  href="/dashboard"
                  className={getLinkClass("/dashboard")}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/"
                  onClick={handleHomeClick}
                  className={getLinkClass("/")}
                >
                  Home
                </Link>
              )}
              <Link
                href="/about"
                className={getLinkClass("/about")}
              >
                About
              </Link>
              <Link
                href="/how-it-works"
                className={getLinkClass("/how-it-works")}
              >
                How it Works
              </Link>
              <Link
                href="/why-lifeback"
                className={getLinkClass("/why-lifeback")}
              >
                Why LifeBack
              </Link>
            </>
          )}
          <Link
            href={process.env.NEXT_PUBLIC_SIPL_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={getLinkClass("SIPL")}
          >
            SIPL
          </Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          
          {/* Desktop Auth Buttons */}
          {!isLoaded ? null : !userId ? (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border/50">
              <Button
                variant="outline"
                onClick={() => openSignIn()}
                className="px-5 h-10 text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full border border-border/60 dark:border-white/20 transition-all duration-300 cursor-pointer"
              >
                Sign In
              </Button>
              <CreateAccountButton
                variant="default"
                className="px-5 h-10 rounded-full text-[14px] font-medium bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up
              </CreateAccountButton>
            </div>
          ) : (
            <div className="hidden md:block">
              <UserButton />
            </div>
          )}

          {/* Mobile Menu Toggle & User Button (when authenticated) */}
          <div className="flex md:hidden items-center gap-3">
            {isLoaded && userId && (
              <UserButton />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background dark:bg-[#0B0F19] border-b border-border/50 dark:border-white/10 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200 z-40">
          <nav className="flex flex-col gap-2">
            {!isLoaded ? null : (
              <>
                {userId ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={getMobileLinkClass("/dashboard")}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/"
                    onClick={handleHomeClick}
                    className={getMobileLinkClass("/")}
                  >
                    Home
                  </Link>
                )}
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getMobileLinkClass("/about")}
                >
                  About
                </Link>
                <Link
                  href="/how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getMobileLinkClass("/how-it-works")}
                >
                  How it Works
                </Link>
                <Link
                  href="/why-lifeback"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getMobileLinkClass("/why-lifeback")}
                >
                  Why LifeBack
                </Link>
              </>
            )}
            <Link
              href={process.env.NEXT_PUBLIC_SIPL_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={getMobileLinkClass("SIPL")}
            >
              SIPL
            </Link>
          </nav>

          {!isLoaded ? null : !userId && (
            <div className="flex flex-col gap-3 pt-6 border-t border-border/50 dark:border-white/10 px-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openSignIn();
                }}
                className="w-full justify-center text-base h-14 rounded-full font-medium border border-border/60 dark:border-white/20"
              >
                Sign In
              </Button>
              <CreateAccountButton
                variant="default"
                size="lg"
                className="w-full justify-center text-base h-14 rounded-full font-medium shadow-md"
              >
                Sign Up
              </CreateAccountButton>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
