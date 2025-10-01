import type { HTMLAttributes, ReactNode } from "react";

interface StatsItemProps extends HTMLAttributes<HTMLDivElement> {
  value: ReactNode;
  label: ReactNode;
  variant?: "default" | "highlighted";
  children?: ReactNode;
}

export function StatsItem({
  value,
  label,
  variant = "default",
  className = "",
  children,
  ...props
}: StatsItemProps) {
  const baseClasses = "bg-slate-100 p-4 rounded-lg border border-slate-200";

  const variantClasses = {
    default: "",
    highlighted: "bg-yellow-100 border-yellow-200",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
      {children}
    </div>
  );
}
