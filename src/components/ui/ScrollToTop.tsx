"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);

  useEffect(() => {
    let ticking = false;

    const checkBackground = () => {
      // 1. Visibility
      setIsVisible(window.scrollY > 300);

      // 2. Color detection
      const btn = document.getElementById("scroll-to-top-btn");
      if (btn) {
        // Target exact center
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Use pointer-events none to avoid layout thrashing (flicker)
        const originalPointerEvents = btn.style.pointerEvents;
        btn.style.pointerEvents = 'none';
        const elements = document.elementsFromPoint(x, y);
        btn.style.pointerEvents = originalPointerEvents;

        let foundDark = false;
        let explicitBgFound = false;

        for (const el of elements) {
          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
              const alpha = match[4] ? parseFloat(match[4]) : 1;
              // Ignore faint semi-transparent backgrounds (like white/10 overlays)
              if (alpha < 0.5) continue;

              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              // Calculate relative luminance
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              foundDark = brightness < 128;
              explicitBgFound = true;
              break;
            }
          }
        }
        
        // Fallback to theme mode if no block background found
        if (!explicitBgFound && document.documentElement.classList.contains('dark')) {
          foundDark = true;
        }

        setIsDarkBg(foundDark);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkBackground);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(checkBackground, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 p-3 md:p-4 rounded-full transition-all duration-300 z-[9999] hover:scale-110 shadow-lg border cursor-pointer",
        isDarkBg 
          ? "bg-white text-black border-white/20 shadow-black/20" 
          : "bg-[#121214] text-white border-black/10 shadow-black/10",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}
