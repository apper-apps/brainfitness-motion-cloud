import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  label,
  error,
  className,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-body">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg font-body text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-400",
          error && "border-error focus:ring-error/20 focus:border-error",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;