import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const AchievementBadge = ({ achievement, earned = false, progress = 0 }) => {
  return (
    <Card 
      className={`p-6 text-center ${earned ? "badge-glow" : "opacity-75"}`}
      hover={earned}
    >
      <motion.div
        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          earned 
            ? "bg-gradient-to-br from-accent to-warning" 
            : "bg-gradient-to-br from-gray-200 to-gray-300"
        }`}
        animate={earned ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 2, repeat: earned ? Infinity : 0, repeatDelay: 3 }}
      >
        <ApperIcon 
          name={achievement.icon} 
          size={32} 
          className={earned ? "text-white" : "text-gray-500"} 
        />
      </motion.div>
      
      <h3 className={`font-display text-lg font-bold mb-2 ${
        earned ? "text-gray-900" : "text-gray-500"
      }`}>
        {achievement.name}
      </h3>
      
      <p className={`text-sm font-body mb-4 ${
        earned ? "text-gray-600" : "text-gray-400"
      }`}>
        {achievement.description}
      </p>
      
      {!earned && progress > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}
      
      {earned && (
        <div className="flex items-center justify-center text-accent text-sm font-medium">
          <ApperIcon name="Award" size={16} className="mr-1" />
          <span className="font-cta">Earned!</span>
        </div>
      )}
    </Card>
  );
};

export default AchievementBadge;