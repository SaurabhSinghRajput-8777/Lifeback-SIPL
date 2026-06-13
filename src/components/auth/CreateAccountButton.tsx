"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";
import { cn } from "@/lib/utils";

export function CreateAccountButton({ children, onClick, className, variant = "outline", size = "lg", ...props }: React.ComponentProps<typeof Button>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={(e) => {
          setIsModalOpen(true);
          onClick?.(e);
        }}
        variant={variant}
        size={size}
        className={cn(
          "cursor-pointer transition-all duration-300 font-heading font-bold",
          "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground",
          className
        )}
        {...props}
      >
        {children || "Create Account"}
      </Button>
      
      <RoleSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
