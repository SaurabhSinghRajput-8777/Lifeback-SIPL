"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { User, Stethoscope, X } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { ROLES, PublicSignupRole } from "@/config/roles";
import { AUTH_ROUTES } from "@/config/routes";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter();
  const { openSignUp } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const [selectedRole, setSelectedRole] = useState<PublicSignupRole | null>(null);

  useEffect(() => {
    // Create a dedicated node for the portal to avoid document.body conflicts
    const node = document.createElement("div");
    node.setAttribute("data-portal", "role-selection");
    document.body.appendChild(node);
    setPortalNode(node);
    setMounted(true);

    return () => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  if (!mounted || !isOpen || !portalNode) return null;

  const handleRoleSelect = (role: PublicSignupRole) => {
    setSelectedRole(role);
    // Store in sessionStorage as requested
    sessionStorage.setItem("signup_role", role);
    
    // Add a slight delay for the selection animation before redirecting
    setTimeout(() => {
      onClose();
      openSignUp({ unsafeMetadata: { role } });
    }, 400);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-background border border-border dark:border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-10 text-center border-b border-border dark:border-white/10 shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-secondary/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-brand-secondary shadow-[0_0_12px_rgba(132,157,142,0.8)]" />
          </div>
          <h2 id="modal-title" className="text-2xl sm:text-[32px] font-heading font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
            Create Your LifeBack Account
          </h2>
          <p className="text-sm sm:text-[16px] font-body text-muted-foreground px-2">
            Choose the experience that best describes you.
          </p>
        </div>

        <div className="p-5 sm:p-10 grid sm:grid-cols-2 gap-4 sm:gap-6 bg-muted/20 dark:bg-[#18181b] overflow-y-auto">
          {/* USER CARD */}
          <button
            onClick={() => handleRoleSelect(ROLES.USER)}
            className={`group relative text-left p-5 sm:p-6 rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${
              selectedRole === ROLES.USER
                ? "border-brand-secondary bg-brand-secondary/5 shadow-[0_0_30px_rgba(132,157,142,0.15)]"
                : "border-border bg-card hover:bg-accent/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-brand-secondary/10 to-transparent opacity-0 transition-opacity duration-300 ${
              selectedRole === ROLES.USER ? "opacity-100" : "group-hover:opacity-50"
            }`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <User className={`w-7 h-7 sm:w-8 sm:h-8 mb-4 sm:mb-5 transition-colors ${
                selectedRole === ROLES.USER ? "text-brand-secondary" : "text-muted-foreground group-hover:text-foreground"
              }`} />
              <h3 className="text-lg sm:text-[20px] font-heading font-bold text-foreground mb-2">User</h3>
              <p className="text-xs sm:text-[14px] font-body text-muted-foreground leading-relaxed flex-grow">
                Track assessments, monitor progress, and access future mental health tools.
              </p>
              
              {selectedRole === ROLES.USER && (
                <div className="mt-4 sm:mt-6 flex items-center text-[12px] sm:text-[13px] font-bold text-brand-secondary uppercase tracking-wider">
                  Selected <span className="ml-2 w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                </div>
              )}
            </div>
          </button>

          {/* CLINICIAN CARD */}
          <button
            onClick={() => handleRoleSelect(ROLES.CLINICIAN)}
            className={`group relative text-left p-5 sm:p-6 rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${
              selectedRole === ROLES.CLINICIAN
                ? "border-orange-500 bg-orange-500/5 shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                : "border-border bg-card hover:bg-accent/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 ${
              selectedRole === ROLES.CLINICIAN ? "opacity-100" : "group-hover:opacity-50"
            }`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <Stethoscope className={`w-7 h-7 sm:w-8 sm:h-8 mb-4 sm:mb-5 transition-colors ${
                selectedRole === ROLES.CLINICIAN ? "text-orange-500" : "text-muted-foreground group-hover:text-foreground"
              }`} />
              <h3 className="text-lg sm:text-[20px] font-heading font-bold text-foreground mb-2">Clinician</h3>
              <p className="text-xs sm:text-[14px] font-body text-muted-foreground leading-relaxed flex-grow">
                Manage patients, review assessment data, and access clinical workflows.
              </p>
              
              {selectedRole === ROLES.CLINICIAN && (
                <div className="mt-4 sm:mt-6 flex items-center text-[12px] sm:text-[13px] font-bold text-orange-500 uppercase tracking-wider">
                  Selected <span className="ml-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalNode);
}
