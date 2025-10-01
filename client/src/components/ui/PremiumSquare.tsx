import type { HTMLAttributes, ReactNode } from "react";
import type { PremiumSquare } from "../../types";

interface PremiumSquareProps extends HTMLAttributes<HTMLDivElement> {
  premium: PremiumSquare;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export function PremiumSquare({
  premium,
  size = "md",
  className = "",
  children,
  ...props
}: PremiumSquareProps) {
  const getPremiumStyle = (premium: PremiumSquare) => {
    switch (premium) {
      case "DL":
        return "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 text-white shadow-lg border-blue-200/60";
      case "TL":
        return "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 text-white shadow-lg border-blue-300/60";
      case "DW":
        return "bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 text-white shadow-lg border-pink-300/60";
      case "TW":
        return "bg-gradient-to-br from-red-300 via-red-400 to-red-500 text-white shadow-lg border-red-300/60";
      case "STAR":
        return "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-black font-black shadow-xl border-yellow-200/50 ring-2 ring-yellow-300/30";
      default:
        return "bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-800 shadow-md border-slate-200";
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-7 h-7 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  const baseClasses = "rounded flex items-center justify-center font-bold";
  const classes = `${baseClasses} ${getPremiumStyle(premium)} ${
    sizeClasses[size]
  } ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
