import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = "primary",
  gradient = true 
}) => {
  const colorClasses = {
    primary: "from-primary to-secondary",
    success: "from-success to-success/80",
    warning: "from-warning to-accent",
    accent: "from-accent to-warning"
  };
  
  return (
    <Card gradient={gradient} className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 font-body mb-1">
            {title}
          </p>
          <motion.p 
            className="text-3xl font-bold text-gray-900 font-display"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={trend.direction === "up" ? "text-success" : "text-error"}
              />
              <span className={`text-sm font-medium ml-1 ${
                trend.direction === "up" ? "text-success" : "text-error"
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;