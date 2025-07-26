import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { promptService } from "@/services/api/promptService";
import ApperIcon from "@/components/ApperIcon";
import MarketplaceCard from "@/components/molecules/MarketplaceCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const PromptMarketplace = () => {
const [activeTab, setActiveTab] = useState('prompts');
  const [prompts, setPrompts] = useState([]);
  const [promptPacks, setPromptPacks] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [filteredPacks, setFilteredPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState('featured');
  const categories = ['All', 'Business Strategy', 'Creative Writing', 'Technology', 'Marketing', 'Education', 'Memory Enhancement', 'Focus Training', 'Problem Solving'];
  const packCategories = ['All', 'Memory Enhancement', 'Focus Training', 'Problem Solving', 'Creative Thinking', 'Decision Making'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'sales', label: 'Most Popular' }
  ];

  useEffect(() => {
loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prompts, promptPacks, searchTerm, selectedCategory, priceRange, sortBy, activeTab]);

const loadData = async () => {
    try {
      setLoading(true);
      const [promptsData, packsData] = await Promise.all([
        promptService.getMarketplacePrompts(),
        promptService.getPromptPacks()
      ]);
      setPrompts(promptsData);
      setPromptPacks(packsData);
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
      
      if (activeTab === 'prompts') {
        const filtered = await promptService.getMarketplacePrompts(filters);
        setFilteredPrompts(filtered);
      } else {
        const filtered = await promptService.getPromptPacks(filters);
        setFilteredPacks(filtered);
      }
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

const handlePurchase = async (item, isPack = false) => {
    try {
      setPurchasing(true);
      
      // In real implementation, this would integrate with Stripe Elements
      const paymentMethod = {
        type: 'card',
        card: 'pm_card_visa' // Mock payment method
      };
      
      const purchase = isPack 
        ? await promptService.purchasePromptPack(item.Id, paymentMethod)
        : await promptService.purchasePrompt(item.Id, paymentMethod);
      
      setSelectedPrompt(null);
      setSelectedPack(null);
      
      // Update sales count in local state
      if (isPack) {
        setPromptPacks(prev => prev.map(p => 
          p.Id === item.Id ? { ...p, totalSales: p.totalSales + 1 } : p
        ));
        toast.success(`${item.title} pack purchased successfully! Check your downloads.`);
      } else {
        setPrompts(prev => prev.map(p => 
          p.Id === item.Id ? { ...p, totalSales: p.totalSales + 1 } : p
        ));
        toast.success(`${item.title} purchased successfully!`);
      }
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPurchasing(false);
    }
  };

if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
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
            <p className="text-gray-600 font-body">Discover battle-tested prompts and curated brain fitness packs</p>
          </div>
        </div>
        
{/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{prompts.length}</div>
            <div className="text-sm text-gray-600">Individual Prompts</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{promptPacks.filter(p => p.tier !== 'compresslearn').length}</div>
            <div className="text-sm text-gray-600">Prompt Packs</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{promptPacks.filter(p => p.tier === 'compresslearn').length}</div>
            <div className="text-sm text-gray-600">CompressLearn Bundles</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{prompts.reduce((sum, p) => sum + p.totalSales, 0) + promptPacks.reduce((sum, p) => sum + p.totalSales, 0)}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-info">{prompts.filter(p => p.featured).length + promptPacks.filter(p => p.featured).length}</div>
            <div className="text-sm text-gray-600">Featured Items</div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'prompts'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name="FileText" size={16} className="mr-2 inline" />
            Individual Prompts
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'packs'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name="Package" size={16} className="mr-2 inline" />
            Prompt Packs
          </button>
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
                placeholder={activeTab === 'prompts' ? "Search prompts..." : "Search packs..."}
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
              {(activeTab === 'prompts' ? categories : packCategories).map(cat => (
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
              max={activeTab === 'prompts' ? "10" : "25"}
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

      {/* Content Grid */}
      {activeTab === 'prompts' ? (
        <>
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
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => (
              <Card key={pack.Id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <ApperIcon name="Package" size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pack.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={pack.tier === 'basic' ? 'info' : pack.tier === 'premium' ? 'accent' : 'primary'}>
                          {pack.tier.charAt(0).toUpperCase() + pack.tier.slice(1)}
                        </Badge>
                        {pack.featured && <Badge variant="success">Featured</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${pack.price}</div>
                    <div className="text-sm text-gray-500">{pack.promptCount} prompts</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{pack.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Prompts:</span>
                    <span className="font-medium">{pack.promptCount}</span>
                  </div>
                  {pack.includesTemplates && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Templates:</span>
                      <ApperIcon name="Check" size={16} className="text-success" />
                    </div>
                  )}
                  {pack.includesGuides && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Usage Guides:</span>
                      <ApperIcon name="Check" size={16} className="text-success" />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" size={14} className="text-accent fill-current" />
                      <span className="font-medium">{pack.rating}</span>
                      <span className="text-gray-500">({pack.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sales:</span>
                    <span className="font-medium">{pack.totalSales}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedPack(pack)}
                  className="w-full"
                  variant={pack.tier === 'premium' ? 'accent' : 'primary'}
                >
                  <ApperIcon name="Package" size={16} className="mr-2" />
                  Purchase Pack
                </Button>
              </Card>
            ))}
          </div>

          {filteredPacks.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prompt packs found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </>
      )}

{/* Purchase Modal - Individual Prompt */}
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
                  onClick={() => handlePurchase(selectedPrompt, false)}
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

      {/* Purchase Modal - Prompt Pack */}
{selectedPack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedPack.tier === 'compresslearn' ? 'Purchase CompressLearn Bundle' : 'Purchase Prompt Pack'}
                </h3>
                <button
                  onClick={() => setSelectedPack(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedPack.tier === 'compresslearn' ? 'from-orange-500 to-red-500' : 'from-primary to-secondary'} rounded-xl flex items-center justify-center`}>
                    <ApperIcon name={selectedPack.tier === 'compresslearn' ? 'Zap' : 'Package'} size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedPack.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={selectedPack.tier === 'basic' ? 'info' : selectedPack.tier === 'premium' ? 'accent' : selectedPack.tier === 'compresslearn' ? 'warning' : 'primary'}>
                        {selectedPack.tier === 'compresslearn' ? 'CompressLearn Bundle' : `${selectedPack.tier.charAt(0).toUpperCase() + selectedPack.tier.slice(1)} Pack`}
                      </Badge>
                      <Badge variant="success">{selectedPack.promptCount} Prompts</Badge>
                      {selectedPack.tier === 'compresslearn' && selectedPack.bundleDiscount && (
                        <Badge variant="error">{selectedPack.bundleDiscount}% OFF</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedPack.description}</p>
                
                {/* Preview Section */}
                {selectedPack.previewPrompts && selectedPack.previewPrompts.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <ApperIcon name="Eye" size={16} className="text-blue-600" />
                      <h5 className="font-medium text-blue-900">Preview Sample Prompts</h5>
                    </div>
                    <div className="space-y-2">
                      {selectedPack.previewPrompts.map((prompt, index) => (
                        <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-500">
                          <p className="text-sm text-gray-700 italic">"{prompt}"</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      + {selectedPack.promptCount - selectedPack.previewPrompts.length} more premium prompts included
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900">What's Included:</h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Check" size={16} className="text-success" />
                        <span className="text-sm">{selectedPack.promptCount} battle-tested prompts</span>
                      </div>
                      {selectedPack.includesTemplates && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Check" size={16} className="text-success" />
                          <span className="text-sm">Customizable templates</span>
                        </div>
                      )}
                      {selectedPack.includesGuides && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Check" size={16} className="text-success" />
                          <span className="text-sm">Usage guides & best practices</span>
                        </div>
                      )}
                      {selectedPack.includesVideoTutorials && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Check" size={16} className="text-success" />
                          <span className="text-sm">Video tutorial series</span>
                        </div>
                      )}
                      {selectedPack.includesPersonalizedCoaching && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Check" size={16} className="text-success" />
                          <span className="text-sm">3 personalized coaching sessions</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Check" size={16} className="text-success" />
                        <span className="text-sm">Instant download</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Check" size={16} className="text-success" />
                        <span className="text-sm">Workout integration suggestions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900">Pack Stats:</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-primary">{selectedPack.efficacyRating}%</div>
                        <div className="text-xs text-gray-600">Efficacy Rating</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-accent">{selectedPack.totalSales}</div>
                        <div className="text-xs text-gray-600">Total Sales</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Star" size={16} className="text-accent fill-current" />
                        <span className="text-sm font-medium">{selectedPack.rating} ({selectedPack.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Lightbulb" size={16} className="text-blue-600" />
                    <h5 className="font-medium text-blue-900">Workout Integration</h5>
                  </div>
                  <p className="text-sm text-blue-800">{selectedPack.workoutIntegration}</p>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">
                    {selectedPack.tier === 'compresslearn' ? (
                      <>Individual Value: <span className="line-through">${selectedPack.originalPrice}</span></>
                    ) : (
                      <>Value: <span className="line-through">${(selectedPack.promptCount * 2.99).toFixed(2)}</span></>
                    )}
                  </div>
                  <div className="text-right">
                    {selectedPack.originalPrice && selectedPack.originalPrice > selectedPack.price && (
                      <div className="text-sm text-gray-500 line-through">${selectedPack.originalPrice}</div>
                    )}
                    <div className="text-3xl font-bold text-primary">${selectedPack.price}</div>
                    {selectedPack.bundleDiscount && (
                      <div className="text-sm text-green-600 font-medium">Save {selectedPack.bundleDiscount}%!</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPack(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePurchase(selectedPack, true)}
                  disabled={purchasing}
                  className="flex-1"
                  variant={selectedPack.tier === 'compresslearn' ? 'warning' : selectedPack.tier === 'premium' ? 'accent' : 'primary'}
                >
                  {purchasing ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" size={16} className="mr-2" />
                      {selectedPack.tier === 'compresslearn' ? 'Get Bundle' : 'Purchase Pack'}
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