import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  hover = true,
  gradient = false,
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      className={cn(
        "bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300",
        gradient && "bg-gradient-to-br from-white to-gray-50/50",
        hover && "hover:shadow-2xl cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;