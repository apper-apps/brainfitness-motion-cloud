import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();
  
  const difficultyColors = {
    1: "success",
    2: "warning", 
    3: "accent"
  };
  
  const difficultyLabels = {
    1: "Easy",
    2: "Medium",
    3: "Hard"
  };
  
  const categoryIcons = {
    "Memory": "Brain",
    "Focus": "Target",
    "Logic": "Puzzle",
    "Speed": "Zap",
    "Pattern": "Grid3x3"
  };
  
  return (
    <Card 
      className="p-6 cursor-pointer group"
      onClick={() => navigate(`/exercise/${exercise.Id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <ApperIcon 
            name={categoryIcons[exercise.category] || "Brain"} 
            size={24} 
            className="text-white" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={difficultyColors[exercise.difficulty]} size="sm">
            {difficultyLabels[exercise.difficulty]}
          </Badge>
          {exercise.isPremium && (
            <Badge variant="accent" size="sm">
              <ApperIcon name="Crown" size={12} className="mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>
      
      <h3 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {exercise.name}
      </h3>
      <p className="text-gray-600 font-body text-sm mb-4 line-clamp-2">
        {exercise.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="Clock" size={14} className="mr-1" />
          <span className="font-body">{exercise.averageTime}min avg</span>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <ApperIcon
              key={i}
              name="Star"
              size={12}
              className={i < exercise.difficulty + 2 ? "text-accent fill-current" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
      
      <motion.div
        className="mt-4 flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
        whileHover={{ x: 4 }}
      >
        <span className="font-cta">Start Exercise</span>
        <ApperIcon name="ArrowRight" size={16} className="ml-1" />
      </motion.div>
    </Card>
  );
};

export default ExerciseCard;