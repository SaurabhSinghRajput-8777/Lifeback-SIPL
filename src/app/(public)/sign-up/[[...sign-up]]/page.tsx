"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ROLES, PublicSignupRole } from "@/config/roles";
import { AUTH_ROUTES } from "@/config/routes";

export default function SignUpPage() {
  const [role, setRole] = useState<PublicSignupRole | null>(null);

  useEffect(() => {
    // Read the role from sessionStorage (set by RoleSelectionModal)
    const storedRole = sessionStorage.getItem("signup_role");
    
    // Simple frontend validation before passing to Clerk
    if (storedRole === ROLES.CLINICIAN) {
      // eslint-disable-next-line
      setRole(ROLES.CLINICIAN);
    } else {
      // eslint-disable-next-line
      setRole(ROLES.USER); // Default to USER for anything else
    }
  }, []);

  // Prevent hydration mismatch or flashing by waiting until we read the role
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[90dvh] items-center justify-center p-6 bg-background">
      <SignUp 
        path={AUTH_ROUTES.SIGN_UP} 
        routing="path" 
        signInUrl={AUTH_ROUTES.SIGN_IN} 
        fallbackRedirectUrl="/dashboard"
        unsafeMetadata={{ role }} 
      />
    </div>
  );
}
