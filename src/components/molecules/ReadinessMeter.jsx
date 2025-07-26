import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const ReadinessMeter = ({ 
  category, 
  level, 
  requiredLevel = 80, 
  showDetails = true,
  size = 'md' 
}) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(level);
    }, 300);
    return () => clearTimeout(timer);
  }, [level]);
  
  const isUnlocked = level >= requiredLevel;
  const progress = Math.min(level / requiredLevel * 100, 100);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const categoryIcons = {
    mentalClarity: 'Focus',
    aiTraining: 'Zap',
    exercises: 'Brain',
    overall: 'Target'
  };
  
  const categoryNames = {
    mentalClarity: 'Mental Clarity',
    aiTraining: 'AI Training',
    exercises: 'Exercises',
    overall: 'Overall'
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        {/* Circular Progress */}
        <div className="relative">
          <svg className={`${sizeClasses[size]} transform -rotate-90`}>
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={isUnlocked ? 'text-success' : 'text-primary'}
              strokeDasharray={`${2 * Math.PI * 40} ${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 40 * (1 - animatedLevel / 100)
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className={`font-bold ${isUnlocked ? 'text-success' : 'text-primary'} ${textSizes[size]}`}
              >
                {Math.round(animatedLevel)}%
              </motion.div>
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <ApperIcon 
                    name="Check" 
                    size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} 
                    className="text-success mx-auto" 
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Details */}
        {showDetails && (
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon 
                name={categoryIcons[category]} 
                size={16} 
                className={isUnlocked ? 'text-success' : 'text-gray-600'} 
              />
              <h3 className="font-display font-semibold text-gray-900">
                {categoryNames[category]}
              </h3>
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                >
                  <ApperIcon name="Crown" size={16} className="text-accent" />
                </motion.div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className={`font-medium ${isUnlocked ? 'text-success' : 'text-gray-900'}`}>
                  {level}% / {requiredLevel}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${isUnlocked ? 'bg-success' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isUnlocked 
                    ? 'bg-success/10 text-success' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {isUnlocked ? 'Course Unlocked' : `${requiredLevel - level}% to unlock`}
                </div>
                
                {!isUnlocked && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-gray-500"
                  >
                    Keep training!
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReadinessMeter;