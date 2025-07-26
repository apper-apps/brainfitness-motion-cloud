import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const MarketplaceCard = ({ prompt, onPurchase }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Business Strategy': 'accent',
      'Creative Writing': 'primary',
      'Technology': 'success',
      'Marketing': 'warning',
      'Education': 'info'
    };
    return colors[category] || 'secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Business Strategy': 'TrendingUp',
      'Creative Writing': 'Pen',
      'Technology': 'Code',
      'Marketing': 'Megaphone',
      'Education': 'GraduationCap'
    };
    return icons[category] || 'FileText';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-${getCategoryColor(prompt.category)} to-${getCategoryColor(prompt.category)}/80 rounded-lg flex items-center justify-center`}>
              <ApperIcon name={getCategoryIcon(prompt.category)} size={18} className="text-white" />
            </div>
            <div>
              <Badge variant={getCategoryColor(prompt.category)} size="sm">
                {prompt.category}
              </Badge>
              {prompt.featured && (
                <Badge variant="accent" size="sm" className="ml-2">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${prompt.price}</div>
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <ApperIcon name="Trophy" size={14} className="text-accent" />
                <span className="text-sm font-bold text-gray-900">{prompt.battleWins}</span>
              </div>
              <div className="text-xs text-gray-600">Battle Wins</div>
            </div>
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

          {/* Seller Info */}
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

          {/* Tags */}
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
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <Button onClick={onPurchase} className="w-full">
            <ApperIcon name="CreditCard" size={16} className="mr-2" />
            Purchase Prompt
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default MarketplaceCard;