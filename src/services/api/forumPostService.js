import { toast } from 'react-toastify';

class ForumPostService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'forum_post';
  }

  async getPosts(forumId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "forumId" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "likes" } },
          { field: { Name: "replies" } },
          { field: { Name: "views" } },
          { field: { Name: "isPinned" } }
        ],
        where: [
          {
            FieldName: "forumId",
            Operator: "EqualTo",
            Values: [parseInt(forumId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching forum posts:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching forum posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async createPost(forumId, postData) {
    try {
      const newPostData = {
        Name: postData.title,
        forumId: parseInt(forumId),
        title: postData.title,
        content: postData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        replies: 0,
        views: 0,
        isPinned: false
      };

      const params = {
        records: [newPostData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating forum post:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create forum post ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Forum post created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating forum post:", error?.response?.data?.message);
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

export const forumPostService = new ForumPostService();