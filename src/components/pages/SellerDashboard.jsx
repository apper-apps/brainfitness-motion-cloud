import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { promptService } from '@/services/api/promptService';

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prompt: '',
    price: 2.99,
    category: 'Business Strategy',
    tags: ''
  });

  const categories = ['Business Strategy', 'Creative Writing', 'Technology', 'Marketing', 'Education'];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await promptService.getSellerDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const promptData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingListing) {
        await promptService.updatePromptListing(editingListing.Id, promptData);
      } else {
        await promptService.createPromptListing(promptData);
      }

      setShowCreateForm(false);
      setEditingListing(null);
      setFormData({
        title: '',
        description: '',
        prompt: '',
        price: 2.99,
        category: 'Business Strategy',
        tags: ''
      });
      
      loadDashboard();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      description: listing.description,
      prompt: listing.prompt,
      price: listing.price,
      category: listing.category,
      tags: listing.tags.join(', ')
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await promptService.deletePromptListing(id);
      loadDashboard();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboard} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="DollarSign" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Seller Dashboard</h1>
            <p className="text-gray-600 font-body">Manage your prompt listings and earnings</p>
          </div>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="FileText" size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalListings}</div>
          <div className="text-sm text-gray-600">Active Listings</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="ShoppingCart" size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalSales}</div>
          <div className="text-sm text-gray-600">Total Sales</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-success to-info rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="DollarSign" size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${dashboardData.stats.totalEarnings}</div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-warning to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Star" size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{dashboardData.stats.averageRating}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </Card>
      </div>

      {/* Listings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-display">Your Listings</h2>
        </div>
        
        <div className="space-y-4">
          {dashboardData.listings.map((listing) => (
            <motion.div
              key={listing.Id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: '#f9fafb' }}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                  <Badge variant={listing.featured ? 'accent' : 'secondary'}>
                    {listing.featured ? 'Featured' : 'Active'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Category: {listing.category}</span>
                  <span>Sales: {listing.totalSales}</span>
                  <span>Rating: {listing.rating || 'No ratings'}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">${listing.price}</div>
                  <div className="text-xs text-gray-500">
                    Earned: ${(listing.totalSales * listing.price * 0.7).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(listing)}
                    className="p-2 text-gray-600 hover:text-primary"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(listing.Id)}
                    className="p-2 text-gray-600 hover:text-error"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {dashboardData.listings.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600 mb-4">Create your first prompt listing to start earning</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create Your First Listing
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingListing ? 'Edit Listing' : 'Create New Listing'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingListing(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter prompt title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what makes this prompt effective"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Content</label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Enter the full prompt text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    rows={6}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($1.00 - $10.00)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., strategy, analysis, business"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingListing(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingListing ? 'Update Listing' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;