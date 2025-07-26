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
      difficultyLevel: "adaptive"
    };
  }

  async updateSettings(settings) {
    await this.delay();
    // In a real app, this would save to a database
    return settings;
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const userService = new UserService();