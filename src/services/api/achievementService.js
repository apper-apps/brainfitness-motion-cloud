import achievementsData from "@/services/mockData/achievements.json";
import userAchievementsData from "@/services/mockData/userAchievements.json";

class AchievementService {
  constructor() {
    this.achievements = [...achievementsData];
    this.userAchievements = [...userAchievementsData];
  }

  async getAll() {
    await this.delay();
    return [...this.achievements];
  }

  async getById(id) {
    await this.delay();
    const achievement = this.achievements.find(a => a.Id === id);
    if (!achievement) {
      throw new Error("Achievement not found");
    }
    return { ...achievement };
  }

  async getUserAchievements() {
    await this.delay();
    return [...this.userAchievements];
  }

  async getEarnedAchievements() {
    await this.delay();
    const earned = this.userAchievements.filter(ua => ua.earned);
    return earned.map(ua => {
      const achievement = this.achievements.find(a => a.Id === ua.achievementId);
      return { ...achievement, earnedDate: ua.earnedDate };
    });
  }

  async checkAndUnlockAchievements(userStats) {
    await this.delay();
    // In a real app, this would check user stats against achievement requirements
    // and unlock new achievements
    const newAchievements = [];
    return newAchievements;
  }

  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const achievementService = new AchievementService();