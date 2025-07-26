import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getCurrentUser() {
    await this.delay();
    return this.users[0]; // Return first user as current user
  }

  async getCurrentUserStats() {
    await this.delay();
    const user = this.users[0];
    return {
      mentalFitnessScore: user.mentalFitnessScore,
      totalWorkouts: user.totalWorkouts,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      improvement: 25
    };
  }

  async getUserSettings() {
await this.delay();
    return {
      notifications: true,
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