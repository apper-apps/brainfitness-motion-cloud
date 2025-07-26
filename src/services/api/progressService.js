import progressData from "@/services/mockData/progress.json";
import { subDays, format } from "date-fns";

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getProgressHistory(days = 30) {
    await this.delay();
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    return this.progress
      .filter(p => {
        const progressDate = new Date(p.date);
        return progressDate >= startDate && progressDate <= endDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
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
      categoryScores: [
        { category: "Memory", score: 85 },
        { category: "Focus", score: 78 },
        { category: "Logic", score: 82 },
        { category: "Speed", score: 75 },
        { category: "Pattern", score: 80 }
      ],
      categoryDetails: [
        { name: "Memory", icon: "Brain", score: 85, sessions: 12, progress: 85 },
        { name: "Focus", icon: "Target", score: 78, sessions: 10, progress: 78 },
        { name: "Logic", icon: "Puzzle", score: 82, sessions: 8, progress: 82 },
        { name: "Speed", icon: "Zap", score: 75, sessions: 7, progress: 75 },
        { name: "Pattern", icon: "Grid3x3", score: 80, sessions: 5, progress: 80 }
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
        }
      ]
    };
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const progressService = new ProgressService();