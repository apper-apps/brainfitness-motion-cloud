import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StreakCounter = ({ currentStreak, longestStreak }) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-3">
        <motion.div
          className="streak-flame"
          animate={{ 
            scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
            rotate: currentStreak > 0 ? [-2, 2, -2] : 0
          }}
          transition={{ 
            duration: 1.5, 
            repeat: currentStreak > 0 ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <ApperIcon 
            name="Flame" 
            size={32} 
            className={currentStreak > 0 ? "text-accent" : "text-gray-400"} 
          />
        </motion.div>
        <div>
          <motion.p 
            className="text-2xl font-bold text-gray-900 font-display"
            key={currentStreak}
            initial={{ scale: 1.2, color: "#FFB547" }}
            animate={{ scale: 1, color: "#1F2937" }}
            transition={{ duration: 0.3 }}
          >
            {currentStreak}
          </motion.p>
          <p className="text-sm text-gray-600 font-body">Day Streak</p>
        </div>
      </div>
      
      <div className="w-px h-12 bg-gray-200" />
      
      <div>
        <p className="text-lg font-bold text-gray-900 font-display">
          {longestStreak}
        </p>
        <p className="text-sm text-gray-600 font-body">Best Streak</p>
      </div>
    </div>
  );
};

export default StreakCounter;