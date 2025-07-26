import workoutsData from "@/services/mockData/workouts.json";
import { exerciseService } from "./exerciseService";

class WorkoutService {
  constructor() {
    this.workouts = [...workoutsData];
  }

  async getTodayWorkout() {
    await this.delay();
    const today = new Date().toISOString().split("T")[0];
    const todayWorkout = this.workouts.find(workout => 
      workout.date.split("T")[0] === today
    );
    return todayWorkout ? { ...todayWorkout } : null;
  }

  async createDailyWorkout() {
    await this.delay();
    const exercises = await exerciseService.getRecommendedExercises();
    const selectedExercises = exercises.slice(0, 3).map(ex => ({
      Id: ex.Id,
      name: ex.name,
      category: ex.category,
      completed: false
    }));

    const newWorkout = {
      Id: this.getNextId(),
      userId: "1",
      date: new Date().toISOString(),
      exercises: selectedExercises,
      duration: 0,
      score: 0,
      completed: false
    };

    this.workouts.push(newWorkout);
    return { ...newWorkout };
  }

async recordExerciseCompletion(exerciseId, score) {
    await this.delay();
    // In a real app, this would update the database
    // Update user analytics and sync across modules
    return { success: true, score, analyticsUpdated: true };
  }

  async getPerformanceAnalytics() {
    await this.delay();
    return {
      averageScore: 87.5,
      improvementRate: 12.3,
      bestCategory: "Memory",
      sessionsThisWeek: 5,
      totalMinutesTraining: 240
    };
  }

  getNextId() {
    return Math.max(...this.workouts.map(w => w.Id), 0) + 1;
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  // Calculate readiness level based on workout completion
  async calculateReadinessLevel(category = 'overall') {
    await this.delay();
    
    // Get user's workout history (mock data)
    const completedWorkouts = 15;
    const totalWorkouts = 20;
    const completionRate = (completedWorkouts / totalWorkouts) * 100;
    
    // Calculate readiness based on completion rate
    let readinessLevel = Math.min(completionRate, 100);
    
    // Apply category-specific modifiers
    const modifiers = {
      mentalClarity: 0.9,
      aiTraining: 1.1,
      exercises: 1.0,
      overall: 1.0
    };
    
    readinessLevel *= modifiers[category] || 1.0;
    return Math.round(Math.min(readinessLevel, 100));
  }

  // Check if user has access to premium courses (80% readiness required)
  async checkCourseAccess(courseCategory) {
    await this.delay();
    const readinessLevel = await this.calculateReadinessLevel(courseCategory);
    return {
      hasAccess: readinessLevel >= 80,
      readinessLevel,
      requiredLevel: 80,
      remaining: Math.max(0, 80 - readinessLevel)
    };
  }

  // Get detailed readiness analytics
  async getReadinessAnalytics() {
    await this.delay();
    
    const categories = ['mentalClarity', 'aiTraining', 'exercises'];
    const analytics = {};
    
    for (const category of categories) {
      const level = await this.calculateReadinessLevel(category);
      analytics[category] = {
        level,
        hasAccess: level >= 80,
        weeklyProgress: Math.random() * 10 + 5, // Mock weekly progress
        completedSessions: Math.floor(level / 5),
        totalSessions: 20
      };
    }
    
    // Calculate overall readiness
    const overallLevel = Math.round(
      Object.values(analytics).reduce((sum, cat) => sum + cat.level, 0) / categories.length
    );
    
    analytics.overall = {
      level: overallLevel,
      hasAccess: overallLevel >= 80,
      weeklyProgress: Object.values(analytics).reduce((sum, cat) => sum + cat.weeklyProgress, 0) / categories.length,
      completedSessions: Object.values(analytics).reduce((sum, cat) => sum + cat.completedSessions, 0),
      totalSessions: Object.values(analytics).reduce((sum, cat) => sum + cat.totalSessions, 0)
    };
    
    return analytics;
  }
}

export const workoutService = new WorkoutService();