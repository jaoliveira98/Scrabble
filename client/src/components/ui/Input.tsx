import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error";
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { variant = "default", label, error, helperText, className = "", ...props },
    ref
  ) => {
    const baseClasses =
      "px-4 py-2 rounded-xl bg-slate-100 text-slate-800 border transition-all duration-200 placeholder-slate-400 backdrop-blur-sm";

    const variantClasses = {
      default:
        "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30",
      error:
        "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30",
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
      <div className="">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input ref={ref} className={classes} {...props} />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);
