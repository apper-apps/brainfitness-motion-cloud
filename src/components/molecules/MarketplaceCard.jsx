import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const MarketplaceCard = ({ prompt, onPurchase, onPreview }) => {
  const [showPreview, setShowPreview] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      'Business Strategy': 'accent',
      'Creative Writing': 'primary',
      'Technology': 'success',
      'Marketing': 'warning',
      'Education': 'info',
      'Memory Enhancement': 'primary',
      'Focus Training': 'accent',
      'Problem Solving': 'success',
      'Creative Thinking': 'warning',
      'Decision Making': 'info'
    };
    return colors[category] || 'secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Business Strategy': 'TrendingUp',
      'Creative Writing': 'Pen',
      'Technology': 'Code',
      'Marketing': 'Megaphone',
      'Education': 'GraduationCap',
      'Memory Enhancement': 'Brain',
      'Focus Training': 'Target',
      'Problem Solving': 'Lightbulb',
      'Creative Thinking': 'Palette',
      'Decision Making': 'GitBranch'
    };
    return icons[category] || 'FileText';
  };

  const isBundle = prompt.tier === 'compresslearn';
  const hasPreview = prompt.previewPrompts && prompt.previewPrompts.length > 0;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        <Card className="p-6 h-full flex flex-col relative overflow-hidden">
          {/* Bundle Indicator */}
          {isBundle && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              BUNDLE
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${isBundle ? 'from-orange-500 to-red-500' : `from-${getCategoryColor(prompt.category)} to-${getCategoryColor(prompt.category)}/80`} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={isBundle ? 'Zap' : getCategoryIcon(prompt.category)} size={18} className="text-white" />
              </div>
              <div>
                <Badge variant={isBundle ? 'warning' : getCategoryColor(prompt.category)} size="sm">
                  {prompt.category}
                </Badge>
                {prompt.featured && (
                  <Badge variant="accent" size="sm" className="ml-2">
                    Featured
                  </Badge>
                )}
                {isBundle && prompt.bundleDiscount && (
                  <Badge variant="error" size="sm" className="ml-2">
                    {prompt.bundleDiscount}% OFF
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              {prompt.originalPrice && prompt.originalPrice > prompt.price && (
                <div className="text-sm text-gray-400 line-through">${prompt.originalPrice}</div>
              )}
              <div className={`text-2xl font-bold ${isBundle ? 'text-orange-500' : 'text-primary'}`}>
                ${prompt.price}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {prompt.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {prompt.description}
            </p>

            {/* Preview indicator */}
            {hasPreview && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Eye" size={14} className="text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">Preview Available</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  See {prompt.previewPrompts.length} sample prompts before purchasing
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {prompt.battleWins !== undefined ? (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <ApperIcon name="Trophy" size={14} className="text-accent" />
                    <span className="text-sm font-bold text-gray-900">{prompt.battleWins}</span>
                  </div>
                  <div className="text-xs text-gray-600">Battle Wins</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <ApperIcon name="Package" size={14} className="text-primary" />
                    <span className="text-sm font-bold text-gray-900">{prompt.promptCount}</span>
                  </div>
                  <div className="text-xs text-gray-600">Prompts</div>
                </div>
              )}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ApperIcon name="ShoppingCart" size={14} className="text-success" />
                  <span className="text-sm font-bold text-gray-900">{prompt.totalSales}</span>
                </div>
                <div className="text-xs text-gray-600">Sales</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ApperIcon name="Star" size={14} className="text-accent fill-current" />
                  <span className="text-sm font-bold text-gray-900">{prompt.rating}</span>
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>

            {/* Seller Info or Bundle Info */}
            {prompt.sellerName ? (
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={12} className="text-white" />
                </div>
                <span className="text-sm text-gray-600">by {prompt.sellerName}</span>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Star" size={12} className="text-accent fill-current" />
                  <span className="text-xs text-gray-600">{prompt.sellerRating}</span>
                </div>
              </div>
            ) : isBundle && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Zap" size={12} className="text-white" />
                </div>
                <span className="text-sm text-gray-600">CompressLearn Official</span>
                <Badge variant="success" size="sm">Verified</Badge>
              </div>
            )}

            {/* Tags */}
            {prompt.tags && (
              <div className="flex flex-wrap gap-1 mb-4">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bundle extras indicator */}
            {isBundle && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Gift" size={14} className="text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">Bundle Extras</span>
                </div>
                <div className="space-y-1">
                  {prompt.includesVideoTutorials && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Play" size={12} className="text-orange-600" />
                      <span className="text-xs text-orange-600">Video Tutorials</span>
                    </div>
                  )}
                  {prompt.includesPersonalizedCoaching && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Users" size={12} className="text-orange-600" />
                      <span className="text-xs text-orange-600">Personal Coaching</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {hasPreview && (
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                className="w-full"
              >
                <ApperIcon name="Eye" size={16} className="mr-2" />
                Preview Content
              </Button>
            )}
            <Button 
              onClick={onPurchase} 
              className="w-full"
              variant={isBundle ? 'warning' : 'primary'}
            >
              <ApperIcon name="CreditCard" size={16} className="mr-2" />
              {isBundle ? 'Get Bundle' : prompt.promptCount ? 'Purchase Pack' : 'Purchase Prompt'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      {showPreview && hasPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Preview: {prompt.title}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {prompt.previewPrompts.map((previewPrompt, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start space-x-3">
                      <Badge variant="info" size="sm">Sample {index + 1}</Badge>
                    </div>
                    <p className="text-gray-700 mt-2 italic">"{previewPrompt}"</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 text-center">
                  + {prompt.promptCount - prompt.previewPrompts.length} more premium prompts included in the full {isBundle ? 'bundle' : 'pack'}
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false);
                    onPurchase();
                  }}
                  className="flex-1"
                  variant={isBundle ? 'warning' : 'primary'}
                >
                  <ApperIcon name="CreditCard" size={16} className="mr-2" />
                  Purchase Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MarketplaceCard;