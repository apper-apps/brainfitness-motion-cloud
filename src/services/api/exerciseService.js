import { toast } from "react-toastify";
import React from "react";

class ExerciseService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'exercise';
  }

async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "isPremium" } },
          { field: { Name: "description" } },
          { field: { Name: "averageTime" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching exercises:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching exercises:", error?.response?.data?.message);
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
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "isPremium" } },
          { field: { Name: "description" } },
          { field: { Name: "averageTime" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching exercise with ID ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching exercise with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

async getRecommendedExercises() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "isPremium" } },
          { field: { Name: "description" } },
          { field: { Name: "averageTime" } }
        ],
        where: [
          {
            FieldName: "isPremium",
            Operator: "EqualTo",
            Values: [false]
          }
        ],
        pagingInfo: { limit: 6, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching recommended exercises:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recommended exercises:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
return [];
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "isPremium" } },
          { field: { Name: "description" } },
          { field: { Name: "averageTime" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching exercises by category ${category}:`, response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching exercises by category ${category}:`, error?.response?.data?.message);
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

export const exerciseService = new ExerciseService();