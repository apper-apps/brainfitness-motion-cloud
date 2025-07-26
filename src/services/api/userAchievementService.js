import { toast } from 'react-toastify';

class UserAchievementService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'user_achievement';
  }

  async getUserAchievements(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "earned" } },
          { field: { Name: "earnedDate" } },
          { field: { Name: "progress" } },
          { field: { Name: "userId" } },
          { field: { Name: "achievementId" } }
        ],
        where: [
          {
            FieldName: "userId",
            Operator: "EqualTo", 
            Values: [parseInt(userId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching user achievements:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user achievements:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getEarnedAchievements(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "earned" } },
          { field: { Name: "earnedDate" } },
          { field: { Name: "progress" } },
          { field: { Name: "userId" } },
          { field: { Name: "achievementId" } }
        ],
        where: [
          {
            FieldName: "userId",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          },
          {
            FieldName: "earned",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching earned achievements:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching earned achievements:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const userAchievementService = new UserAchievementService();