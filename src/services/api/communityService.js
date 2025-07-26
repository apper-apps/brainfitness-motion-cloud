import forumsData from '../mockData/community.json';
import accountabilityGroupsData from '../mockData/accountabilityGroups.json';
import forumPostsData from '../mockData/forumPosts.json';

// Forums
let forums = [...forumsData];
let forumPosts = [...forumPostsData];
let accountabilityGroups = [...accountabilityGroupsData];

// Forum Services
export const forumService = {
  getAll: () => Promise.resolve([...forums]),
  
  getById: (id) => {
    const forum = forums.find(f => f.Id === parseInt(id));
    return Promise.resolve(forum ? { ...forum } : null);
  },
  
  getPosts: (forumId) => {
    const posts = forumPosts.filter(p => p.forumId === parseInt(forumId));
    return Promise.resolve(posts.map(p => ({ ...p })));
  },
  
  createPost: (forumId, postData) => {
    const newPost = {
      ...postData,
      Id: Math.max(...forumPosts.map(p => p.Id), 0) + 1,
      forumId: parseInt(forumId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      replies: 0,
      views: 0,
      isPinned: false
    };
    forumPosts = [newPost, ...forumPosts];
    
    // Update forum post count
    const forum = forums.find(f => f.Id === parseInt(forumId));
    if (forum) {
      forum.postCount += 1;
      forum.lastActivity = newPost.createdAt;
      forum.lastPost = {
        title: newPost.title,
        author: newPost.author.name,
        timestamp: newPost.createdAt
      };
    }
    
    return Promise.resolve({ ...newPost });
  },
  
  likePost: (postId) => {
    const post = forumPosts.find(p => p.Id === parseInt(postId));
    if (post) {
      post.likes += 1;
      return Promise.resolve({ ...post });
    }
    return Promise.reject(new Error('Post not found'));
  },
  
  searchPosts: (query) => {
    const filtered = forumPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return Promise.resolve(filtered.map(p => ({ ...p })));
  }
};

// Accountability Groups Services
export const accountabilityGroupService = {
  getAll: () => Promise.resolve([...accountabilityGroups]),
  
  getById: (id) => {
    const group = accountabilityGroups.find(g => g.Id === parseInt(id));
    return Promise.resolve(group ? { ...group } : null);
  },
  
  create: (groupData) => {
    const newGroup = {
      ...groupData,
      Id: Math.max(...accountabilityGroups.map(g => g.Id), 0) + 1,
      memberCount: 1,
      createdAt: new Date().toISOString(),
      members: [{
        Id: 1,
        name: groupData.createdBy,
        avatar: groupData.createdBy.split(' ').map(n => n[0]).join(''),
        role: 'Leader',
        streak: 0
      }],
      currentWeekProgress: 0
    };
    accountabilityGroups = [newGroup, ...accountabilityGroups];
    return Promise.resolve({ ...newGroup });
  },
  
  joinGroup: (groupId, userData) => {
    const group = accountabilityGroups.find(g => g.Id === parseInt(groupId));
    if (group && group.memberCount < group.maxMembers) {
      const newMember = {
        Id: Math.max(...group.members.map(m => m.Id), 0) + 1,
        ...userData,
        role: 'Member',
        streak: 0
      };
      group.members.push(newMember);
      group.memberCount += 1;
      return Promise.resolve({ ...group });
    }
    return Promise.reject(new Error('Cannot join group'));
  },
  
  leaveGroup: (groupId, userId) => {
    const group = accountabilityGroups.find(g => g.Id === parseInt(groupId));
    if (group) {
      group.members = group.members.filter(m => m.Id !== parseInt(userId));
      group.memberCount = Math.max(0, group.memberCount - 1);
      return Promise.resolve({ ...group });
    }
    return Promise.reject(new Error('Group not found'));
  },
  
  updateProgress: (groupId, userId, progress) => {
    const group = accountabilityGroups.find(g => g.Id === parseInt(groupId));
    if (group) {
      const member = group.members.find(m => m.Id === parseInt(userId));
      if (member) {
        member.streak = progress.streak || member.streak;
        group.currentWeekProgress = Math.min(group.weeklyGoal, (group.currentWeekProgress || 0) + 1);
        return Promise.resolve({ ...group });
      }
    }
    return Promise.reject(new Error('Member not found'));
  },
  
  searchGroups: (query) => {
    const filtered = accountabilityGroups.filter(group => 
      group.name.toLowerCase().includes(query.toLowerCase()) ||
      group.description.toLowerCase().includes(query.toLowerCase()) ||
      group.category.toLowerCase().includes(query.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return Promise.resolve(filtered.map(g => ({ ...g })));
  }
};