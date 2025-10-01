import type { HTMLAttributes, ReactNode } from "react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "card-large" | "glass" | "glass-strong";
  children: ReactNode;
}

export function Box({
  variant = "default",
  className = "",
  children,
  ...props
}: BoxProps) {
  const baseClasses = "relative overflow-hidden";

  const variantClasses = {
    default: "bg-white border border-slate-200 rounded-lg p-4 shadow-lg",
    card: "bg-white border border-slate-200 rounded-xl p-6 shadow-2xl",
    "card-large":
      "bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl",
    glass:
      "bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-xl p-6 shadow-xl",
    "glass-strong":
      "bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
