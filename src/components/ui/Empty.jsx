import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by taking your first brain training session",
  actionText = "Start Training",
  onAction,
  icon = "Brain"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center p-8"
    >
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={48} className="text-primary" />
        </div>
        <h3 className="font-display text-xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 font-body mb-6">
          {description}
        </p>
        {onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Play" size={18} className="mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;