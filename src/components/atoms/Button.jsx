import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-cta font-semibold rounded-lg transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-white",
    accent: "bg-gradient-to-r from-accent to-warning text-white hover:from-accent/90 hover:to-warning/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary bg-white",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
    xl: "px-8 py-5 text-lg"
  };
  
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;