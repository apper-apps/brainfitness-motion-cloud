import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { forumService, accountabilityGroupService } from '@/services/api/communityService';
import { formatDistanceToNow } from 'date-fns';

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forums');
  const [forums, setForums] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [forumsData, groupsData] = await Promise.all([
        forumService.getAll(),
        accountabilityGroupService.getAll()
      ]);
      
      setForums(forumsData);
      setGroups(groupsData);
      
      // Load recent posts from all forums
      const allPosts = [];
      for (const forum of forumsData) {
        const posts = await forumService.getPosts(forum.Id);
        allPosts.push(...posts);
      }
      setRecentPosts(allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      
    } catch (err) {
      setError('Failed to load community data');
      toast.error('Error loading community data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      await accountabilityGroupService.create(groupData);
      toast.success('Accountability group created successfully!');
      setShowCreateGroup(false);
      loadCommunityData();
    } catch (err) {
      toast.error('Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await accountabilityGroupService.joinGroup(groupId, {
        name: 'Current User',
        avatar: 'CU'
      });
      toast.success('Successfully joined the group!');
      loadCommunityData();
    } catch (err) {
      toast.error('Failed to join group');
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await forumService.createPost(selectedForum, {
        ...postData,
        author: {
          Id: 1,
          name: 'Current User',
          avatar: 'CU',
          title: 'Community Member',
          level: 5,
          streak: 15
        },
        tags: postData.tags || []
      });
      toast.success('Post created successfully!');
      setShowCreatePost(false);
      setSelectedForum(null);
      loadCommunityData();
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCommunityData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Community</h1>
          <p className="text-gray-600 font-body mt-1">
            Connect, share progress, and stay motivated together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Search community..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
            icon="Search"
          />
          <Button
            onClick={() => activeTab === 'groups' ? setShowCreateGroup(true) : setShowCreatePost(true)}
            className="whitespace-nowrap"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {activeTab === 'groups' ? 'Create Group' : 'New Post'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {forums.reduce((sum, f) => sum + f.memberCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-success/5 to-info/5 border border-success/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">
                {forums.reduce((sum, f) => sum + f.postCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Posts</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success to-info rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageCircle" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-accent/5 to-warning/5 border border-accent/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-accent">{groups.length}</p>
              <p className="text-sm text-gray-600">Active Groups</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-secondary">
                {groups.reduce((sum, g) => sum + g.memberCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Group Members</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'forums', label: 'Discussion Forums', icon: 'MessageSquare' },
            { key: 'groups', label: 'Accountability Groups', icon: 'Users' },
            { key: 'recent', label: 'Recent Activity', icon: 'Activity' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'forums' && (
          <motion.div
            key="forums"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {filteredForums.length === 0 ? (
              <Empty
                icon="MessageCircle"
                title="No forums found"
                description="Try adjusting your search or create a new discussion"
              />
            ) : (
              <div className="grid gap-6">
                {filteredForums.map((forum) => (
                  <motion.div
                    key={forum.Id}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedForum(forum.Id);
                      setShowCreatePost(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${forum.color} to-${forum.color}/80 rounded-lg flex items-center justify-center`}>
                          <ApperIcon name={forum.icon} size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 font-display mb-2">
                            {forum.name}
                          </h3>
                          <p className="text-gray-600 font-body mb-4">{forum.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="MessageCircle" size={16} />
                              <span>{forum.postCount} posts</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Users" size={16} />
                              <span>{forum.memberCount} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Clock" size={16} />
                              <span>{formatDistanceToNow(new Date(forum.lastActivity))} ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 mb-1">Latest Post</p>
                        <p className="text-sm text-gray-600 mb-1">{forum.lastPost.title}</p>
                        <p className="text-xs text-gray-500">by {forum.lastPost.author}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div
            key="groups"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {filteredGroups.length === 0 ? (
              <Empty
                icon="Users"
                title="No groups found"
                description="Try adjusting your search or create a new accountability group"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <motion.div
                    key={group.Id}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 font-display mb-1">
                          {group.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {group.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Users" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {group.memberCount}/{group.maxMembers}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 font-body mb-4 text-sm line-clamp-2">
                      {group.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Schedule:</span>
                        <span className="text-gray-900 font-medium">{group.schedule}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Weekly Progress:</span>
                        <span className="text-gray-900 font-medium">
                          {group.currentWeekProgress}/{group.weeklyGoal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(group.currentWeekProgress / group.weeklyGoal) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {group.members.slice(0, 3).map((member, index) => (
                        <div
                          key={member.Id}
                          className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ zIndex: 3 - index, marginLeft: index > 0 ? '-8px' : '0' }}
                        >
                          {member.avatar}
                        </div>
                      ))}
                      {group.memberCount > 3 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold -ml-2">
                          +{group.memberCount - 3}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleJoinGroup(group.Id)}
                      disabled={group.memberCount >= group.maxMembers}
                      className="w-full"
                      size="sm"
                    >
                      {group.memberCount >= group.maxMembers ? 'Group Full' : 'Join Group'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            key="recent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 font-display mb-6">Recent Activity</h2>
              {recentPosts.length === 0 ? (
                <Empty
                  icon="Activity"
                  title="No recent activity"
                  description="Be the first to start a discussion!"
                />
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <motion.div
                      key={post.Id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {post.author.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{post.author.name}</h4>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(post.createdAt))} ago
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {post.content}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Heart" size={14} />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="MessageCircle" size={14} />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Eye" size={14} />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
                Create Accountability Group
              </h3>
              <CreateGroupForm
                onSubmit={handleCreateGroup}
                onCancel={() => setShowCreateGroup(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
                Create New Post
              </h3>
              <CreatePostForm
                onSubmit={handleCreatePost}
                onCancel={() => {
                  setShowCreatePost(false);
                  setSelectedForum(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Create Group Form Component
const CreateGroupForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    category: 'Daily Practice',
    difficulty: 'Beginner',
    maxMembers: 30,
    weeklyGoal: 7,
    isPrivate: false,
    createdBy: 'Current User'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Group Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <Input
        label="Schedule"
        placeholder="e.g., Daily at 7:00 AM"
        value={formData.schedule}
        onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option>Daily Practice</option>
            <option>Memory Training</option>
            <option>Stress Relief</option>
            <option>Focus Building</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.difficulty}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Group
        </Button>
      </div>
    </form>
  );
};

// Create Post Form Component
const CreatePostForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Post Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
        />
      </div>
      <Input
        label="Tags (comma-separated)"
        placeholder="e.g., progress, memory, tips"
        value={formData.tags.join(', ')}
        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }))}
      />
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Post
        </Button>
      </div>
    </form>
  );
};

export default Community;