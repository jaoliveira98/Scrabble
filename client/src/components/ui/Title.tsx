import type { HTMLAttributes, ReactNode } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "default" | "muted";
  children: ReactNode;
}

export function Title({
  level = 2,
  variant = "default",
  className = "",
  children,
  ...props
}: TitleProps) {
  const baseClasses = "font-bold";

  const variantClasses = {
    default: "text-slate-900",
    muted: "text-slate-600",
  };

  const levelClasses = {
    1: "text-4xl mb-8",
    2: "text-2xl mb-6",
    3: "text-xl mb-4",
    4: "text-lg mb-3",
    5: "text-base mb-2",
    6: "text-sm mb-2",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${levelClasses[level]} ${className}`;

  if (level === 1) {
    return (
      <h1 className={classes} {...props}>
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2 className={classes} {...props}>
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3 className={classes} {...props}>
        {children}
      </h3>
    );
  }
  if (level === 4) {
    return (
      <h4 className={classes} {...props}>
        {children}
      </h4>
    );
  }
  if (level === 5) {
    return (
      <h5 className={classes} {...props}>
        {children}
      </h5>
    );
  }
  if (level === 6) {
    return (
      <h6 className={classes} {...props}>
        {children}
      </h6>
    );
  }

  return (
    <h2 className={classes} {...props}>
      {children}
    </h2>
  );
}
