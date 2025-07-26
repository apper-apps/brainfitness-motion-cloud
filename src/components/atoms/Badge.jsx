import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default",
  size = "md",
  className,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-accent/10 text-warning border border-warning/20",
    accent: "bg-gradient-to-r from-accent/10 to-warning/10 text-accent border border-accent/20"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full font-body",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;