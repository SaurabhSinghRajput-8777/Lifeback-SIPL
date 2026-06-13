"use client";

import React, { useEffect, useRef, useState } from "react";

export function MobileCarousel({ 
  children, 
  className,
  autoScrollInterval = 3500,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { autoScrollInterval?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      // If the container is not scrollable (e.g., desktop grid view), do nothing.
      if (scrollWidth <= clientWidth + 10) return;

      // Check if we've reached the end
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Snap back to start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll by roughly one item width (85vw matching the item width)
        container.scrollBy({ left: clientWidth * 0.85, behavior: "smooth" });
      }
    }, autoScrollInterval);

    return () => clearInterval(intervalId);
  }, [isPaused, autoScrollInterval]);

  return (
    <div
      ref={containerRef}
      className={className}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      {children}
    </div>
  );
}
