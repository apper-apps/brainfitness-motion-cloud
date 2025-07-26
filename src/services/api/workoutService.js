import { toast } from 'react-toastify';
import { exerciseService } from "./exerciseService";

class WorkoutService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'workout';
  }

async getTodayWorkout() {
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "duration" } },
          { field: { Name: "score" } },
          { field: { Name: "completed" } },
          { field: { Name: "userId" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "Contains",
            Values: [today]
          }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching today's workout:", response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's workout:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async createDailyWorkout() {
    try {
      const exercises = await exerciseService.getRecommendedExercises();
      
      const workoutData = {
        Name: `Daily Workout - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        duration: 0,
        score: 0,
        completed: false,
        userId: 1 // Current user ID
      };

      const params = {
        records: [workoutData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating daily workout:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create workout ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Daily workout created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating daily workout:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
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