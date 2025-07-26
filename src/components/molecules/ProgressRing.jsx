import { motion } from "framer-motion";

const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = "#5B4CDB",
  backgroundColor = "#E5E7EB",
  showLabel = true,
  label,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${progress * circumference / 100} ${circumference}`;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (progress * circumference / 100) }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="progress-ring-circle"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 font-display">
              {Math.round(progress)}%
            </div>
            {showLabel && label && (
              <div className="text-xs text-gray-600 font-body mt-1">
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;