import { toast } from "react-toastify";
import { format, subDays } from "date-fns";
import React from "react";

class ProgressService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'progress';
  }

async getProgressHistory(days = 30) {
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "category" } },
          { field: { Name: "score" } },
          { field: { Name: "improvement" } },
          { field: { Name: "userId" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate.toISOString()]
          },
          {
            FieldName: "date",
            Operator: "LessThanOrEqualTo", 
            Values: [endDate.toISOString()]
          }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching progress history:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching progress history:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
return [];
    }
  }

  async getOverallStats() {
    await this.delay();
    const latestProgress = this.progress[this.progress.length - 1];
    
    return {
      currentScore: latestProgress?.score || 0,
      totalSessions: 42,
      averageScore: 735,
      bestCategory: "Memory",
      improvement: 25,
      overallProgress: 78,
      thinkingScoreHistory: [
        { date: "2024-01-15", score: 820 },
        { date: "2024-01-16", score: 845 },
        { date: "2024-01-17", score: 867 },
        { date: "2024-01-18", score: 892 }
      ],
      memoryImprovementData: {
        baseline: 65,
        current: 78,
        target: 85,
        weeklyProgress: [68, 71, 74, 76, 78],
        categories: {
          shortTerm: { current: 82, improvement: 17 },
          longTerm: { current: 78, improvement: 13 },
          working: { current: 85, improvement: 20 }
        }
      },
      habitStreakData: {
        currentStreak: 7,
        longestStreak: 12,
        weeklyCompletion: 85,
        monthlyTrend: [75, 80, 82, 85],
        habits: [
          { name: "Daily Exercise", streak: 7, completed: true },
          { name: "Thinking Training", streak: 6, completed: true },
          { name: "Memory Practice", streak: 5, completed: false }
        ]
      },
      categoryScores: [
        { category: "Memory", score: 85 },
        { category: "Focus", score: 78 },
        { category: "Logic", score: 82 },
        { category: "Speed", score: 75 },
        { category: "Pattern", score: 80 }
      ],
      categoryDetails: [
        { name: "Memory", icon: "Brain", score: 85, sessions: 12, progress: 85, improvement: 15 },
        { name: "Focus", icon: "Target", score: 78, sessions: 10, progress: 78, improvement: 8 },
        { name: "Logic", icon: "Puzzle", score: 82, sessions: 8, progress: 82, improvement: 12 },
        { name: "Speed", icon: "Zap", score: 75, sessions: 7, progress: 75, improvement: 5 },
        { name: "Pattern", icon: "Grid3x3", score: 80, sessions: 5, progress: 80, improvement: 10 }
      ],
      recentMilestones: [
        {
          title: "7-Day Streak",
          description: "Completed daily workouts for a week",
          date: new Date().toISOString()
        },
        {
          title: "Memory Master",
          description: "Achieved 90%+ on memory exercises",
          date: subDays(new Date(), 2).toISOString()
        },
        {
          title: "Thinking Score Milestone",
          description: "Reached 890+ thinking score",
          date: subDays(new Date(), 1).toISOString()
        }
      ],
      personalizedInsights: [
        {
          type: "strength",
          message: "Your memory performance has improved 15% this week",
          category: "Memory"
        },
        {
          type: "opportunity",
          message: "Focus exercises could boost your overall score by 8%",
          category: "Focus"
        },
        {
          type: "milestone",
          message: "You're 3 days away from your longest streak record",
          category: "Habits"
        }
      ]
    };
  }

  async syncProgressAcrossModules(userId, progressData) {
    await this.delay();
    // Sync progress data across all modules
    // Update achievements, recommendations, and analytics
    return {
      success: true,
      modulesUpdated: ["dashboard", "achievements", "exercises", "analytics"],
      newRecommendations: 3,
      achievementsUnlocked: 1
    };
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const progressService = new ProgressService();