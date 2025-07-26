import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { workoutService } from '@/services/api/workoutService';

const CourseAccess = ({ courseCategory, courseName, children }) => {
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [courseCategory]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      const data = await workoutService.checkCourseAccess(courseCategory);
      setAccessData(data);
    } catch (error) {
      console.error('Error checking course access:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (!accessData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Unable to check course access
        </div>
      </Card>
    );
  }

  // If user has access, render the course content
  if (accessData.hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  // If user doesn't have access, show unlock requirements
  return (
    <Card className="p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Lock" size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">
            {courseName} Locked
          </h2>
          <p className="text-gray-600 font-body">
            Complete more workouts to unlock this premium course
          </p>
        </div>

        {/* Progress towards unlock */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {accessData.readinessLevel}%
              </div>
              <div className="text-sm text-gray-600">Current</div>
            </div>
            <div className="flex-1 max-w-32">
              <div className="w-full bg-gray-200 rounded-full h-3 relative">
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(accessData.readinessLevel / accessData.requiredLevel) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute -right-1 top-0 w-3 h-3 bg-primary rounded-full shadow-lg"></div>
                </motion.div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">
                {accessData.requiredLevel}%
              </div>
              <div className="text-sm text-gray-600">Required</div>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ApperIcon name="Target" size={20} className="text-primary" />
              <span className="font-semibold text-gray-900">
                {accessData.remaining}% more to unlock
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Keep completing workouts to reach the 80% readiness threshold
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/exercises'}
          >
            <ApperIcon name="Brain" size={16} className="mr-2" />
            Start Training
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/progress'}
          >
            <ApperIcon name="TrendingUp" size={16} className="mr-2" />
            View Progress
          </Button>
        </div>

        {/* Motivational message */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-warning/10 rounded-lg border border-accent/20"
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Zap" size={16} className="text-accent" />
            <span className="text-sm font-medium text-gray-700">
              You're {Math.round((accessData.readinessLevel / accessData.requiredLevel) * 100)}% of the way there!
            </span>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
};

export default CourseAccess;