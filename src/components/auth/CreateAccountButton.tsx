"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";

export function CreateAccountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        size="lg" 
        variant="outline" 
        className="cursor-pointer w-full sm:w-auto h-14 px-8 rounded-none font-heading font-bold text-[15px] border-border bg-transparent text-foreground hover:bg-foreground/5 transition-colors"
      >
        Create Account
      </Button>
      
      <RoleSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
