import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AchievementBadge from "@/components/molecules/AchievementBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { achievementService } from "@/services/api/achievementService";

const Achievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, earned, locked
  
  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [allAchievements, userProgress] = await Promise.all([
        achievementService.getAll(),
        achievementService.getUserAchievements()
      ]);
      
      setAchievements(allAchievements);
      setUserAchievements(userProgress);
    } catch (err) {
      setError("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAchievements();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAchievements} />;
  
  const getAchievementProgress = (achievementId) => {
    const userAch = userAchievements.find(ua => ua.achievementId === achievementId);
    return {
      earned: userAch?.earned || false,
      progress: userAch?.progress || 0
    };
  };
  
  const filteredAchievements = achievements.filter(achievement => {
    const { earned } = getAchievementProgress(achievement.Id);
    if (filter === "earned") return earned;
    if (filter === "locked") return !earned;
    return true;
  });
  
  const earnedCount = achievements.filter(achievement => 
    getAchievementProgress(achievement.Id).earned
  ).length;
  
  const totalPoints = userAchievements.reduce((total, ua) => 
    total + (ua.earned ? achievements.find(a => a.Id === ua.achievementId)?.points || 0 : 0), 0
  );
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-4">
          Your Achievements
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Track your cognitive training milestones and unlock new badges
        </p>
      </motion.div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 text-center border border-primary/20">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Award" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 font-display mb-2">
            {earnedCount}
          </h3>
          <p className="text-gray-600 font-body">Achievements Earned</p>
        </div>
        
        <div className="bg-gradient-to-br from-accent/10 to-warning/10 rounded-xl p-6 text-center border border-accent/20">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Star" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 font-display mb-2">
            {totalPoints}
          </h3>
          <p className="text-gray-600 font-body">Total Points</p>
        </div>
        
        <div className="bg-gradient-to-br from-success/10 to-success/20 rounded-xl p-6 text-center border border-success/20">
          <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Target" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 font-display mb-2">
            {Math.round((earnedCount / achievements.length) * 100)}%
          </h3>
          <p className="text-gray-600 font-body">Completion Rate</p>
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex items-center justify-center space-x-2">
        {[
          { value: "all", label: "All", count: achievements.length },
          { value: "earned", label: "Earned", count: earnedCount },
          { value: "locked", label: "Locked", count: achievements.length - earnedCount }
        ].map((filterOption) => (
          <Button
            key={filterOption.value}
            variant={filter === filterOption.value ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption.value)}
          >
            {filterOption.label} ({filterOption.count})
          </Button>
        ))}
      </div>
      
      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <Empty
          icon="Award"
          title="No achievements found"
          description="Keep training to unlock your first achievements!"
          actionText="Start Training"
          onAction={() => navigate("/exercises")}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredAchievements.map((achievement, index) => {
            const { earned, progress } = getAchievementProgress(achievement.Id);
            return (
              <motion.div
                key={achievement.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AchievementBadge
                  achievement={achievement}
                  earned={earned}
                  progress={progress}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
      
      {/* Achievement Categories */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Achievement Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Streak Master", icon: "Flame", description: "Daily training streaks", color: "accent" },
            { name: "Score Crusher", icon: "Target", description: "High score achievements", color: "primary" },
            { name: "Category Expert", icon: "Brain", description: "Master different exercise types", color: "success" },
            { name: "Dedication", icon: "Award", description: "Long-term commitment rewards", color: "warning" }
          ].map((category) => (
            <div key={category.name} className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${
                category.color === "primary" ? "from-primary to-secondary" :
                category.color === "accent" ? "from-accent to-warning" :
                category.color === "success" ? "from-success to-success/80" :
                "from-warning to-accent"
              } rounded-full flex items-center justify-center mx-auto mb-4`}>
                <ApperIcon name={category.icon} size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 font-body">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Premium Achievements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl p-8 border border-accent/20"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Crown" size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 font-display mb-2">
            Premium Achievements
          </h3>
          <p className="text-gray-600 font-body mb-6 max-w-2xl mx-auto">
            Unlock exclusive achievement badges and earn bonus points with premium membership. Take your brain training to the next level!
          </p>
          <Button variant="accent" size="lg">
            <ApperIcon name="Sparkles" size={20} className="mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;