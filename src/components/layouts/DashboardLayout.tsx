"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BarChart2, 
  User as UserIcon, 
  Users, 
  AlertTriangle,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES } from "@/config/roles";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PlatformFooter } from "@/components/shared/platform-footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
  userName?: string | null;
}

export function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);

  const isClinician = userRole === ROLES.CLINICIAN || userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN;

  const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Assessments", href: "/dashboard/assessments", icon: FileText },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Insights", href: "/dashboard/insights", icon: BarChart2 },
    { name: "About", href: "/about", icon: Info },
  ];

  const clinicianNavigation = [
    { name: "Dashboard", href: "/clinician", icon: LayoutDashboard },
    { name: "Patients", href: "/clinician/patients", icon: Users },
    { name: "High-Risk Queue", href: "/clinician/queue", icon: AlertTriangle },
    { name: "About", href: "/about", icon: Info },
  ];

  const navigation = isClinician ? clinicianNavigation : userNavigation;

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col md:flex-row font-body text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border dark:border-white/5 bg-card dark:bg-[#0B0F19]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/lifeback_logo.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full dark:hidden" />
          <Image src="/lifeback_logo_white.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full hidden dark:block" />
          <span className="font-semibold text-xl tracking-tight text-foreground">LifeBack</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar dark:bg-[#0B0F19] border-r border-border dark:border-white/5 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col",
        isDesktopMenuCollapsed ? "w-20" : "w-64",
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"
      )}>
        <div className={cn(
          "hidden md:flex h-20 items-center border-b border-border",
          isDesktopMenuCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          {!isDesktopMenuCollapsed && (
            <Link href="/" className="flex items-center gap-2 group overflow-hidden">
              <Image src="/lifeback_logo.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform dark:hidden" />
              <Image src="/lifeback_logo_white.png" alt="LifeBack Logo" width={32} height={32} className="object-contain rounded-full group-hover:scale-105 transition-transform hidden dark:block" />
              <span className="font-semibold text-xl tracking-tight text-foreground whitespace-nowrap">LifeBack</span>
            </Link>
          )}
          <button 
            onClick={() => setIsDesktopMenuCollapsed(!isDesktopMenuCollapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-2"
            title={isDesktopMenuCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {isDesktopMenuCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isDesktopMenuCollapsed && !isMobileMenuOpen ? "justify-center px-0" : "px-3",
                  isActive 
                    ? "bg-clinical-soft/40 text-clinical-primary border border-clinical-primary/50 shadow-sm dark:bg-clinical-primary/10" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-muted hover:text-foreground border border-transparent"
                )}
                title={isDesktopMenuCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("min-w-5 min-h-5 w-5 h-5", isActive ? "text-clinical-primary" : "text-slate-500 dark:text-slate-400")} />
                {(!isDesktopMenuCollapsed || isMobileMenuOpen) && (
                  <span className={cn("whitespace-nowrap", isActive ? "font-semibold" : "")}>{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <div className={cn(
            "flex items-center gap-3 py-2",
            isDesktopMenuCollapsed && !isMobileMenuOpen ? "justify-center px-0" : "px-3"
          )}>
            <UserIcon className="min-w-5 min-h-5 w-5 h-5 text-muted-foreground" />
            {(!isDesktopMenuCollapsed || isMobileMenuOpen) && (
              <span className="text-sm font-medium text-muted-foreground truncate">
                {userName || "Profile"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-border/40 dark:border-white/5 bg-white/60 dark:bg-[#0B0F19]/80 backdrop-blur-xl z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Welcome back{userName ? `, ${userName}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col relative z-0">
          {/* Premium Two-Tone Background */}
          <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-indigo-50/80 via-indigo-50/20 to-transparent dark:hidden -z-10" />
          <main className="flex-1 p-4 sm:p-8 flex flex-col relative z-10">
            <div className="max-w-6xl mx-auto w-full flex-1">
              {/* Mobile Welcome Header */}
              <div className="md:hidden mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Welcome back{userName ? `, ${userName}` : ""}
                </h1>
                <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              {children}
            </div>
          </main>
          <PlatformFooter />
        </div>
      </div>
    </div>
  );
}
