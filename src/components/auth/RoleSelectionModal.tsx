"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Stethoscope, X } from "lucide-react";
import { ROLES, PublicSignupRole } from "@/config/roles";
import { AUTH_ROUTES } from "@/config/routes";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState<PublicSignupRole | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleRoleSelect = (role: PublicSignupRole) => {
    setSelectedRole(role);
    // Store in sessionStorage as requested
    sessionStorage.setItem("signup_role", role);
    
    // Add a slight delay for the selection animation before redirecting
    setTimeout(() => {
      router.push(AUTH_ROUTES.SIGN_UP);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-[#121214] border border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10 text-center border-b border-white/10">
          <div className="w-12 h-12 rounded-full bg-brand-secondary/20 flex items-center justify-center mx-auto mb-6">
            <div className="w-4 h-4 rounded-full bg-brand-secondary shadow-[0_0_12px_rgba(132,157,142,0.8)]" />
          </div>
          <h2 id="modal-title" className="text-[28px] sm:text-[32px] font-heading font-bold text-white mb-3 tracking-tight">
            Create Your LifeBack Account
          </h2>
          <p className="text-[16px] font-body text-white/60">
            Choose the experience that best describes you.
          </p>
        </div>

        <div className="p-8 sm:p-10 grid sm:grid-cols-2 gap-6 bg-[#18181b]">
          {/* USER CARD */}
          <button
            onClick={() => handleRoleSelect(ROLES.USER)}
            className={`group relative text-left p-6 rounded-xl border transition-all duration-300 overflow-hidden ${
              selectedRole === ROLES.USER
                ? "border-brand-secondary bg-brand-secondary/5 shadow-[0_0_30px_rgba(132,157,142,0.15)]"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-brand-secondary/10 to-transparent opacity-0 transition-opacity duration-300 ${
              selectedRole === ROLES.USER ? "opacity-100" : "group-hover:opacity-50"
            }`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <User className={`w-8 h-8 mb-5 transition-colors ${
                selectedRole === ROLES.USER ? "text-brand-secondary" : "text-white/70 group-hover:text-white"
              }`} />
              <h3 className="text-[20px] font-heading font-bold text-white mb-2">User</h3>
              <p className="text-[14px] font-body text-white/60 leading-relaxed flex-grow">
                Track assessments, monitor progress, and access future mental health tools.
              </p>
              
              {selectedRole === ROLES.USER && (
                <div className="mt-6 flex items-center text-[13px] font-bold text-brand-secondary uppercase tracking-wider">
                  Selected <span className="ml-2 w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                </div>
              )}
            </div>
          </button>

          {/* CLINICIAN CARD */}
          <button
            onClick={() => handleRoleSelect(ROLES.CLINICIAN)}
            className={`group relative text-left p-6 rounded-xl border transition-all duration-300 overflow-hidden ${
              selectedRole === ROLES.CLINICIAN
                ? "border-orange-500 bg-orange-500/5 shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 transition-opacity duration-300 ${
              selectedRole === ROLES.CLINICIAN ? "opacity-100" : "group-hover:opacity-50"
            }`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <Stethoscope className={`w-8 h-8 mb-5 transition-colors ${
                selectedRole === ROLES.CLINICIAN ? "text-orange-500" : "text-white/70 group-hover:text-white"
              }`} />
              <h3 className="text-[20px] font-heading font-bold text-white mb-2">Clinician</h3>
              <p className="text-[14px] font-body text-white/60 leading-relaxed flex-grow">
                Manage patients, review assessment data, and access clinical workflows.
              </p>
              
              {selectedRole === ROLES.CLINICIAN && (
                <div className="mt-6 flex items-center text-[13px] font-bold text-orange-500 uppercase tracking-wider">
                  Selected <span className="ml-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
