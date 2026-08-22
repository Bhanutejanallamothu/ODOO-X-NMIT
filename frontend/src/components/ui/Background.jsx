import React from "react";
import { cn } from "../../lib/utils";

export const UniversalBackground = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full bg-paper-bg relative", className)}>
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
          `,
          backgroundSize: "8px 8px, 32px 32px, 32px 32px",
        }}
      />
      {/* Content wrapper with a relative z-index so content appears above background */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
};
