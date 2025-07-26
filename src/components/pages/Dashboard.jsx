import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import StreakCounter from "@/components/molecules/StreakCounter";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { workoutService } from "@/services/api/workoutService";
import { exerciseService } from "@/services/api/exerciseService";
import { promptService } from "@/services/api/promptService";
const Dashboard = () => {
  const navigate = useNavigate();
const [userStats, setUserStats] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [stats, workout, exercises, analytics, recommendations] = await Promise.all([
        userService.getCurrentUserStats(),
        workoutService.getTodayWorkout(),
        exerciseService.getRecommendedExercises(),
        userService.getAnalyticsData(),
        userService.getPersonalizedRecommendations()
      ]);
      
      setUserStats(stats);
      setTodayWorkout(workout);
      setRecommendedExercises(exercises);
      setAnalyticsData(analytics);
      setPersonalizedRecommendations(recommendations);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const startDailyWorkout = async () => {
    try {
      if (todayWorkout) {
        navigate(`/exercise/${todayWorkout.exercises[0]?.Id}`);
      } else {
        // Create a new workout
        const workout = await workoutService.createDailyWorkout();
        navigate(`/exercise/${workout.exercises[0]?.Id}`);
      }
      toast.success("Starting your brain workout!");
    } catch (err) {
      toast.error("Failed to start workout");
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  
  const completionPercentage = todayWorkout ? 
    (todayWorkout.exercises.filter(ex => ex.completed).length / todayWorkout.exercises.length) * 100 : 0;
  
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-4">
          Your Brain Training Dashboard
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Track your cognitive fitness and maintain your learning streak
        </p>
      </motion.div>
      
      {/* Stats Overview */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mental Fitness Score"
          value={userStats?.mentalFitnessScore || 0}
          icon="Brain"
          color="primary"
          trend={{ direction: analyticsData?.mentalFitnessTrend?.direction || "up", value: analyticsData?.mentalFitnessTrend?.value || "+12" }}
        />
        <StatCard
          title="Thinking Score"
          value={analyticsData?.thinkingScore || 0}
          icon="Lightbulb"
          color="info"
          trend={{ direction: analyticsData?.thinkingTrend?.direction || "up", value: analyticsData?.thinkingTrend?.value || "+8" }}
        />
        <StatCard
          title="Memory Improvement"
          value={`${analyticsData?.memoryImprovement || 0}%`}
          icon="Brain"
          color="success"
          trend={{ direction: "up", value: `+${analyticsData?.memoryImprovementTrend || 15}%` }}
        />
        <StatCard
          title="Habit Streak"
          value={`${userStats?.currentStreak || 0} days`}
          icon="Flame"
          color="accent"
          trend={{ direction: "up", value: `+${analyticsData?.streakGrowth || 2}` }}
        />
      </div>
{/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thinking Score Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 font-display">Thinking Progress</h3>
            <ApperIcon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekly Average</span>
              <span className="font-bold text-primary">{analyticsData?.weeklyThinkingAverage || 85}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000"
                style={{ width: `${analyticsData?.thinkingProgress || 85}%` }}
              />
            </div>
            {analyticsData?.recentThinkingScores?.slice(0, 3).map((score, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{score.date}</span>
                <span className="font-medium">{score.value}</span>
              </div>
            )) || []}
          </div>
        </Card>

        {/* Memory Improvement */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 font-display">Memory Enhancement</h3>
            <ApperIcon name="Brain" size={20} className="text-accent" />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={analyticsData?.memoryImprovement || 75}
              size={120}
              strokeWidth={8}
              color="#FFB547"
              label="Improved"
            />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Short-term</span>
                <span className="font-medium text-accent">{analyticsData?.memoryMetrics?.shortTerm || 82}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Long-term</span>
                <span className="font-medium text-accent">{analyticsData?.memoryMetrics?.longTerm || 78}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Working</span>
                <span className="font-medium text-accent">{analyticsData?.memoryMetrics?.working || 85}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Habit Tracker */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 font-display">Habit Tracking</h3>
            <StreakCounter streak={userStats?.currentStreak || 0} />
          </div>
          <div className="space-y-3">
            {analyticsData?.habitMetrics?.map((habit, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${habit.completed ? 'bg-success' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-600">{habit.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">{habit.streak} days</span>
              </div>
            )) || [
              { name: "Daily Exercise", completed: true, streak: userStats?.currentStreak || 0 },
              { name: "Thinking Training", completed: true, streak: (userStats?.currentStreak || 0) - 1 },
              { name: "Memory Practice", completed: false, streak: (userStats?.currentStreak || 0) - 2 }
            ]}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Weekly Goal</span>
              <span className="text-sm font-bold text-primary">{analyticsData?.weeklyGoalProgress || 71}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-success to-accent h-2 rounded-full transition-all duration-1000"
                style={{ width: `${analyticsData?.weeklyGoalProgress || 71}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      {personalizedRecommendations?.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-display">AI Recommendations</h3>
            <ApperIcon name="Sparkles" size={24} className="text-accent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={recommendation.icon} size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => navigate(recommendation.action)}
                    >
                      {recommendation.actionText}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Workout Card */}
        <div className="lg:col-span-2">
          <Card className="p-8" gradient>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">
                  Today's Brain Workout
                </h2>
                <p className="text-gray-600 font-body">
                  {todayWorkout?.completed ? 
                    "Great job! You've completed today's workout." :
                    "Ready to challenge your mind? Start your daily training session."
                  }
                </p>
              </div>
              <ProgressRing
                progress={completionPercentage}
                size={100}
                color="#5B4CDB"
                label="Complete"
              />
            </div>
            
            {todayWorkout && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {todayWorkout.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      exercise.completed ? 'bg-success text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <ApperIcon 
                        name={exercise.completed ? "Check" : "Brain"} 
                        size={16} 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exercise.name}</p>
                      <p className="text-xs text-gray-600">{exercise.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={startDailyWorkout}
                disabled={todayWorkout?.completed}
              >
                <ApperIcon name="Play" size={20} className="mr-2" />
                {todayWorkout?.completed ? "Completed" : "Start Workout"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/exercises")}
              >
                <ApperIcon name="Grid3x3" size={20} className="mr-2" />
                Browse Exercises
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Streak & Progress */}
        <div className="space-y-6">
          {/* Mental Clarity Card */}
          <Card className="p-6 bg-gradient-to-br from-accent/5 to-warning/5 border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                  <ApperIcon name="Focus" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-display">
                    Mental Clarity
                  </h3>
                  <p className="text-sm text-gray-600">2-min focus reset</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">
                  {Math.floor(Math.random() * 95) + 75}%
                </div>
                <div className="text-xs text-gray-600">Today's Score</div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full bg-gradient-to-r from-accent to-warning text-white hover:from-accent/90 hover:to-warning/90"
              onClick={() => navigate("/clarity-trainer")}
            >
              <ApperIcon name="Sparkles" size={16} className="mr-2" />
              Start Focus Reset
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
              Your Streak
            </h3>
            <StreakCounter
              currentStreak={userStats?.currentStreak || 0}
              longestStreak={userStats?.longestStreak || 0}
            />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
              Recent Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                  <ApperIcon name="Award" size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">First Week Complete</p>
                  <p className="text-xs text-gray-600">Completed 7 days in a row</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="Target" size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Focus Master</p>
                  <p className="text-xs text-gray-600">Perfect score on Focus Training</p>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate("/achievements")}
            >
              View All Achievements
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Card>
        </div>
</div>

      {/* Performance Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 font-display mb-4">Recent Performance</h3>
          <div className="space-y-4">
            {analyticsData?.recentPerformance?.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <ApperIcon name={session.icon} size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.exercise}</p>
                    <p className="text-sm text-gray-600">{session.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{session.score}</p>
                  <p className="text-xs text-gray-500">{session.improvement}</p>
                </div>
              </div>
            )) || []}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 font-display mb-4">Achievement Progress</h3>
          <div className="space-y-4">
            {analyticsData?.nearbyAchievements?.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Target" size={20} className="text-accent" />
                  <div>
                    <p className="font-medium text-gray-900">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">{achievement.progress}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-accent h-1 rounded-full transition-all duration-500"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )) || []}
          </div>
        </Card>
      </div>

{/* Quick Exercise Access */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-display">
            Quick Training
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/exercises")}
          >
            See All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedExercises.slice(0, 4).map((exercise) => (
            <motion.div
              key={exercise.Id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/exercise/${exercise.Id}`)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Brain" size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{exercise.name}</h4>
                  <p className="text-xs text-gray-600">{exercise.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{exercise.averageTime}min</span>
                <div className="flex items-center space-x-1">
                  {[...Array(exercise.difficulty)].map((_, i) => (
                    <ApperIcon key={i} name="Star" size={10} className="text-accent fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Prompt Marketplace Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-warning rounded-lg flex items-center justify-center">
              <ApperIcon name="Store" size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-display">
                Trending Prompts
              </h2>
              <p className="text-sm text-gray-600">Battle-tested prompts from top creators</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/prompt-market")}
          >
            Browse Market
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-accent/5 to-warning/5 border border-accent/20 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => navigate("/prompt-market")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold text-accent">$4.99</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm mb-1">Business Strategy Analyzer</h4>
            <p className="text-xs text-gray-600 mb-2">15 battle wins • 89 sales</p>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={12} className="text-accent fill-current" />
              <span className="text-xs text-gray-600">4.9 (23 reviews)</span>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => navigate("/prompt-market")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Pen" size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold text-primary">$2.99</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm mb-1">Creative Writing Catalyst</h4>
            <p className="text-xs text-gray-600 mb-2">8 battle wins • 156 sales</p>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={12} className="text-accent fill-current" />
              <span className="text-xs text-gray-600">4.7 (45 reviews)</span>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-br from-success/5 to-info/5 border border-success/20 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => navigate("/prompt-market")}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-success to-info rounded-lg flex items-center justify-center">
                <ApperIcon name="Code" size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold text-success">$6.99</span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm mb-1">Technical Problem Solver</h4>
            <p className="text-xs text-gray-600 mb-2">22 battle wins • 67 sales</p>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={12} className="text-accent fill-current" />
              <span className="text-xs text-gray-600">4.8 (18 reviews)</span>
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;