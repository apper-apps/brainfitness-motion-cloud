import usersData from "@/services/mockData/users.json";
class UserService {
  constructor() {
    this.users = [...usersData];
  }

async getCurrentUser() {
    await this.delay();
    const user = { ...this.users[0] };
    // Add subscription and readiness data
    user.subscription = {
      status: 'trial', // 'trial', 'active', 'canceled', 'expired'
      plan: 'premium',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
    user.readinessLevels = {
      mentalClarity: 65,
      aiTraining: 82,
      exercises: 73,
      overall: 73
    };
    return user;
  }

  // Get user's subscription details
  async getUserSubscription() {
    await this.delay();
    const user = await this.getCurrentUser();
    return user.subscription;
  }

  // Get user's readiness levels for course access
  async getUserReadiness() {
    await this.delay();
    const user = await this.getCurrentUser();
    return user.readinessLevels;
  }

  // Update subscription status
  async updateSubscription(subscriptionData) {
    await this.delay();
    // In real app, this would update the database
    return { success: true, subscription: subscriptionData };
  }

  // Apply discount code
  async applyDiscountCode(code) {
    await this.delay();
    const validCodes = {
      'BUNDLE10': { discount: 10, type: 'percentage', description: '10% off bundled plans' },
      'TRIAL7': { discount: 7, type: 'days', description: 'Extended 7-day trial' },
      'WELCOME20': { discount: 20, type: 'percentage', description: '20% off first month' }
    };
    
    if (validCodes[code]) {
      return { success: true, discount: validCodes[code] };
    }
    return { success: false, error: 'Invalid discount code' };
  }

async getCurrentUserStats() {
    await this.delay();
    const user = this.users[0];
    return {
      mentalFitnessScore: user.mentalFitnessScore,
      totalWorkouts: user.totalWorkouts,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      improvement: 25,
      thinkingScore: 892,
      memoryImprovement: 78,
      weeklyGoalProgress: 71
    };
  }

  async getAnalyticsData() {
    await this.delay();
    return {
      thinkingScore: 892,
      thinkingProgress: 85,
      thinkingTrend: { direction: "up", value: "+8" },
      mentalFitnessTrend: { direction: "up", value: "+12" },
      memoryImprovement: 78,
      memoryImprovementTrend: 15,
      streakGrowth: 2,
      weeklyThinkingAverage: 85,
      weeklyGoalProgress: 71,
      recentThinkingScores: [
        { date: "Today", value: 95 },
        { date: "Yesterday", value: 87 },
        { date: "2 days ago", value: 92 }
      ],
      memoryMetrics: {
        shortTerm: 82,
        longTerm: 78,
        working: 85
      },
      habitMetrics: [
        { name: "Daily Exercise", completed: true, streak: 7 },
        { name: "Thinking Training", completed: true, streak: 6 },
        { name: "Memory Practice", completed: false, streak: 5 }
      ],
      recentPerformance: [
        { exercise: "Pattern Recognition", date: "Today", score: "95", improvement: "+8%", icon: "Grid3x3" },
        { exercise: "Memory Matrix", date: "Yesterday", score: "87", improvement: "+5%", icon: "Brain" },
        { exercise: "Logic Puzzle", date: "2 days ago", score: "92", improvement: "+12%", icon: "Puzzle" }
      ],
      nearbyAchievements: [
        { name: "Memory Master", description: "Complete 10 memory exercises", progress: 80 },
        { name: "Logic Expert", description: "Score 90+ on logic tests", progress: 65 },
        { name: "Speed Demon", description: "Complete exercises under time", progress: 90 }
      ]
    };
  }

  async getPersonalizedRecommendations() {
    await this.delay();
    return [
      {
        title: "Focus Enhancement",
        description: "Your attention span has improved 15%. Try advanced focus exercises.",
        icon: "Target",
        action: "/exercises",
        actionText: "Try Exercises"
      },
      {
        title: "Memory Boost",
        description: "Memory scores show potential for improvement. Practice daily.",
        icon: "Brain",
        action: "/exercises",
        actionText: "Memory Games"
      },
      {
        title: "Streak Milestone",
        description: "You're 3 days away from your longest streak! Keep going.",
        icon: "Flame",
        action: "/progress",
        actionText: "View Progress"
      }
];
  }

  async getUserSettings() {
    await this.delay();
    return {
      dailyReminders: true,
      streakAlerts: true,
      soundEffects: true,
      darkMode: false,
      difficultyLevel: "adaptive",
      newsletter: {
        enabled: false,
        frequency: "weekly",
        series: [],
        workoutIntegration: true,
        emailTime: "09:00"
      }
    };
  }

  async updateSettings(settings) {
    await this.delay();
    // In a real app, this would save to a database
    // Handle newsletter preferences and validate series selections
    if (settings.newsletter) {
      const validSeries = ['mba', 'tech', 'finance', 'psychology', 'productivity', 'health'];
      settings.newsletter.series = settings.newsletter.series.filter(s => validSeries.includes(s));
    }
    return settings;
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const userService = new UserService();