import type { HTMLAttributes, ReactNode } from "react";

interface StatusProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "active" | "inactive" | "success" | "warning" | "error";
  children: ReactNode;
}

export function Status({
  variant = "inactive",
  className = "",
  children,
  ...props
}: StatusProps) {
  const baseClasses =
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";

  const variantClasses = {
    active: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    inactive: "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    error: "bg-rose-100 text-rose-800 border border-rose-200",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
