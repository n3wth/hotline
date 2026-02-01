import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "motion/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      glass: "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20",
      ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
      outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      xl: "h-16 px-8 text-xl font-bold tracking-tight",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)} // Cast to any to satisfy motion props + HTML props conflict
      />
    );
  }
);
Button.displayName = "Button";
