import React from "react";
import { cn } from "./button";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-3xl p-6 transition-all duration-300",
          hover && "hover:bg-white/5 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === "default" && "bg-white/10 text-white backdrop-blur-md",
          variant === "outline" && "border border-white/20 text-white/70",
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
