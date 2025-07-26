import { toast } from 'react-toastify';

class AccountabilityGroupService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'accountability_group';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "memberCount" } },
          { field: { Name: "maxMembers" } },
          { field: { Name: "schedule" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "isPrivate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "weeklyGoal" } },
          { field: { Name: "currentWeekProgress" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching accountability groups:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching accountability groups:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "memberCount" } },
          { field: { Name: "maxMembers" } },
          { field: { Name: "schedule" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "isPrivate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "weeklyGoal" } },
          { field: { Name: "currentWeekProgress" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching accountability group with ID ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching accountability group with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(groupData) {
    try {
      const newGroupData = {
        Name: groupData.name,
        description: groupData.description,
        memberCount: 1,
        maxMembers: groupData.maxMembers || 30,
        schedule: groupData.schedule,
        category: groupData.category,
        difficulty: groupData.difficulty,
        isPrivate: groupData.isPrivate || false,
        createdAt: new Date().toISOString(),
        weeklyGoal: groupData.weeklyGoal || 7,
        currentWeekProgress: 0
      };

      const params = {
        records: [newGroupData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating accountability group:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create accountability group ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Accountability group created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating accountability group:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const accountabilityGroupService = new AccountabilityGroupService();