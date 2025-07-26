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
import MarketplaceCard from '@/components/molecules/MarketplaceCard';
import { promptService } from '@/services/api/promptService';

const PromptMarketplace = () => {
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Business Strategy', 'Creative Writing', 'Technology', 'Marketing', 'Education'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'sales', label: 'Most Popular' }
  ];

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prompts, searchTerm, selectedCategory, priceRange, sortBy]);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const data = await promptService.getMarketplacePrompts();
      setPrompts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters = {
        search: searchTerm,
        category: selectedCategory,
        priceRange: selectedCategory === 'All' ? priceRange : undefined,
        sortBy
      };
      
      const filtered = await promptService.getMarketplacePrompts(filters);
      setFilteredPrompts(filtered);
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  const handlePurchase = async (prompt) => {
    try {
      setPurchasing(true);
      
      // In real implementation, this would integrate with Stripe Elements
      const paymentMethod = {
        type: 'card',
        card: 'pm_card_visa' // Mock payment method
      };
      
      const purchase = await promptService.purchasePrompt(prompt.Id, paymentMethod);
      setSelectedPrompt(null);
      
      // Update prompt sales count in local state
      setPrompts(prev => prev.map(p => 
        p.Id === prompt.Id ? { ...p, totalSales: p.totalSales + 1 } : p
      ));
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPrompts} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-xl flex items-center justify-center">
            <ApperIcon name="Store" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Prompt Marketplace</h1>
            <p className="text-gray-600 font-body">Discover battle-tested prompts from top creators</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{prompts.length}</div>
            <div className="text-sm text-gray-600">Available Prompts</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{prompts.reduce((sum, p) => sum + p.totalSales, 0)}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{prompts.filter(p => p.featured).length}</div>
            <div className="text-sm text-gray-600">Featured</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-info">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
              className="w-full"
            />
          </div>
          
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <MarketplaceCard
            key={prompt.Id}
            prompt={prompt}
            onPurchase={() => setSelectedPrompt(prompt)}
          />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Purchase Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Purchase Prompt</h3>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedPrompt.title}</h4>
                <p className="text-gray-600 mb-4">{selectedPrompt.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">Prompt Preview:</h5>
                  <p className="text-sm text-gray-700 font-mono">{selectedPrompt.prompt.substring(0, 200)}...</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{selectedPrompt.battleWins}</div>
                    <div className="text-sm text-gray-600">Battle Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{selectedPrompt.totalSales}</div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Star" size={16} className="text-accent fill-current" />
                    <span className="text-sm font-medium">{selectedPrompt.rating} ({selectedPrompt.reviews} reviews)</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">${selectedPrompt.price}</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPrompt(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePurchase(selectedPrompt)}
                  disabled={purchasing}
                  className="flex-1"
                >
                  {purchasing ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" size={16} className="mr-2" />
                      Purchase Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PromptMarketplace;