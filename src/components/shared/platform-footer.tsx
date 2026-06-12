"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ROLES } from "@/config/roles";

export function PlatformFooter() {
  const { user } = useUser();
  const role = (user?.unsafeMetadata?.role as string) || ROLES.USER;

  return (
    <footer className="w-full border-t border-border dark:border-white/5 bg-card dark:bg-[#0B0F19] py-8 px-4 sm:px-8 mt-auto shrink-0">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Top Section: Links & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Need Support?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              If you are experiencing emotional distress, thoughts of self-harm, suicidal ideation, or believe you may be in immediate danger, contact local emergency services or a qualified crisis support provider immediately.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/help" className="text-sm text-primary hover:underline w-fit font-medium">
                Mental Health Support Resources
              </Link>
              <Link href="/crisis-support" className="text-sm text-destructive hover:underline w-fit font-medium">
                Emergency Services
              </Link>
            </div>
          </div>

          {/* Role-Specific Links */}
          <div className="space-y-4 md:justify-self-end">
            <h3 className="text-sm font-semibold text-foreground">Platform Navigation</h3>
            <ul className="flex flex-col gap-2">
              {role === ROLES.USER && (
                <>
                  <li><Link href="/dashboard/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Assessment History</Link></li>
                  <li><Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</Link></li>
                  <li><Link href="/crisis-support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Crisis Support</Link></li>
                </>
              )}
              {role === ROLES.CLINICIAN && (
                <>
                  <li><Link href="/clinician/queue" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Clinical Review Queue</Link></li>
                  <li><Link href="/clinician/patients" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Patient Assessments</Link></li>
                  <li><Link href="/crisis-support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Crisis Support</Link></li>
                </>
              )}
              {(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) && (
                <>
                  <li><Link href="/admin/health" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Platform Health</Link></li>
                  <li><Link href="/admin/audit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Audit Logs</Link></li>
                  <li><Link href="/crisis-support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Crisis Support</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Middle Section: Disclaimer */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Clinical Disclaimer:</strong> LifeBack is a behavioral screening and assessment support platform. Results, observations, scores, risk indicators, and generated reports are intended solely for informational and educational purposes. They do not constitute a medical diagnosis, psychiatric evaluation, treatment recommendation, or substitute for professional clinical judgment. Always consult a qualified healthcare professional regarding mental health concerns or treatment decisions.
          </p>
        </div>

        {/* Bottom Section: Legal & Copyright */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} LifeBack by Sequoia Insilico Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
            <Link href="/consent" className="hover:text-foreground transition-colors">Consent Information</Link>
            <Link href="/support" className="hover:text-foreground transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
