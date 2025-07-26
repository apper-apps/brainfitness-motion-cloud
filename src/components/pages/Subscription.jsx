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
import ReadinessMeter from '@/components/molecules/ReadinessMeter';
import { subscriptionService } from '@/services/api/subscriptionService';
import { userService } from '@/services/api/userService';
import { workoutService } from '@/services/api/workoutService';

const Subscription = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [readinessData, setReadinessData] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [subscription, plansData, readiness, billing] = await Promise.all([
        subscriptionService.getSubscriptionStatus(),
        subscriptionService.getPlans(),
        workoutService.getReadinessAnalytics(),
        subscriptionService.getBillingHistory()
      ]);
      
      setCurrentSubscription(subscription);
      setPlans(plansData);
      setReadinessData(readiness);
      setBillingHistory(billing);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    try {
      const result = await subscriptionService.startTrial();
      if (result.success) {
        toast.success('7-day free trial started!');
        loadSubscriptionData();
      }
    } catch (error) {
      toast.error('Failed to start trial');
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim() || !selectedPlan) {
      toast.warning('Please select a plan and enter a discount code');
      return;
    }

    try {
      const result = await subscriptionService.applyDiscount(discountCode, selectedPlan);
      if (result.success) {
        setAppliedDiscount(result.discount);
        toast.success(`Discount applied: ${result.discount.description}`);
      } else {
        toast.error(result.error);
        setAppliedDiscount(null);
      }
    } catch (error) {
      toast.error('Failed to apply discount code');
      setAppliedDiscount(null);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      // In a real app, this would integrate with Stripe
      const result = await subscriptionService.createSubscription(planId, 'mock_payment_method');
      if (result.success) {
        toast.success('Subscription activated successfully!');
        loadSubscriptionData();
      }
    } catch (error) {
      toast.error('Failed to process subscription');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const result = await subscriptionService.cancelSubscription();
      if (result.success) {
        toast.success(result.message);
        loadSubscriptionData();
      }
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSubscriptionData} />;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Subscription Management
          </h1>
          <p className="text-gray-600 font-body mt-2">
            Manage your subscription, billing, and premium features
          </p>
        </div>
        
        {currentSubscription?.status === 'trial' && (
          <Badge variant="success" className="text-sm">
            <ApperIcon name="Clock" size={16} className="mr-1" />
            {currentSubscription.daysRemaining} days left in trial
          </Badge>
        )}
      </div>

      {/* Current Subscription Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-display">
            Current Subscription
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBilling(!showBilling)}
            >
              <ApperIcon name="Receipt" size={16} className="mr-2" />
              Billing History
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                currentSubscription?.status === 'active' ? 'bg-success' : 
                currentSubscription?.status === 'trial' ? 'bg-warning' : 'bg-gray-400'
              }`}></div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentSubscription?.status === 'trial' ? 'Free Trial' : 'Premium Plan'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentSubscription?.status === 'trial' 
                    ? `Expires ${currentSubscription.trialEndsAt?.toLocaleDateString()}`
                    : 'Active subscription'
                  }
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {currentSubscription?.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <ApperIcon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {currentSubscription?.status === 'trial' && (
              <div className="mt-6">
                <Button onClick={handleStartTrial} className="w-full">
                  <ApperIcon name="Crown" size={16} className="mr-2" />
                  Extend Trial (7 more days)
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Course Access Progress</h4>
            <div className="space-y-4">
              {readinessData && Object.entries(readinessData).map(([category, data]) => (
                <ReadinessMeter
                  key={category}
                  category={category}
                  level={data.level}
                  showDetails={false}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      {showBilling && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
              Billing History
            </h3>
            <div className="space-y-3">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {invoice.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      {invoice.date.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-900">
                      {formatPrice(invoice.amount)}
                    </span>
                    <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Available Plans */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Available Plans
        </h2>

        {/* Discount Code Section */}
        <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <h4 className="font-semibold text-gray-900 mb-3">
            Have a discount code?
          </h4>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApplyDiscount} variant="accent">
              Apply
            </Button>
          </div>
          {appliedDiscount && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-success/10 text-success rounded-lg border border-success/20"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name="Check" size={16} />
                <span className="font-medium">{appliedDiscount.description}</span>
              </div>
              <div className="text-sm mt-1">
                Save {formatPrice(appliedDiscount.savings)} on your subscription
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isYearly = plan.interval === 'year';
            const isSelected = selectedPlan === plan.id;
            const discountedPrice = appliedDiscount && appliedDiscount.applicable.includes(plan.id) 
              ? appliedDiscount.discountedPrice 
              : plan.price;

            return (
              <motion.div
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isYearly && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="accent">Most Popular</Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 font-display">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    {appliedDiscount && appliedDiscount.applicable.includes(plan.id) && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(plan.price)}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(discountedPrice)}
                    </div>
                    <div className="text-sm text-gray-600">
                      per {plan.interval}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={isSelected ? "primary" : "outline"}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {currentSubscription?.status === 'trial' ? 'Subscribe' : 'Switch Plan'}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Readiness Meters */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Course Access Progress
        </h2>
        <p className="text-gray-600 font-body mb-6">
          Complete 80% of workouts in each category to unlock premium courses
        </p>
        
        {readinessData && (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(readinessData)
              .filter(([category]) => category !== 'overall')
              .map(([category, data]) => (
                <ReadinessMeter
                  key={category}
                  category={category}
                  level={data.level}
                  requiredLevel={80}
                  showDetails={true}
                />
              ))}
          </div>
        )}
      </Card>

      {/* Cancel Subscription */}
      {currentSubscription?.status === 'active' && (
        <Card className="p-6 border-error/20">
          <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
            Cancel Subscription
          </h3>
          <p className="text-gray-600 font-body mb-4">
            You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
          </p>
          <Button
            variant="outline"
            className="border-error text-error hover:bg-error hover:text-white"
            onClick={handleCancelSubscription}
          >
            <ApperIcon name="X" size={16} className="mr-2" />
            Cancel Subscription
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Subscription;