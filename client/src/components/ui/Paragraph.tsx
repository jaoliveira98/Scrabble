import type { HTMLAttributes, ReactNode } from "react";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "muted" | "error" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Paragraph({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: ParagraphProps) {
  const baseClasses = "font-medium";

  const variantClasses = {
    default: "text-slate-800",
    muted: "text-slate-500",
    error: "text-rose-600",
    success: "text-green-600",
    warning: "text-amber-600",
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
}
